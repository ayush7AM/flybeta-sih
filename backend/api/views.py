from datetime import date, timedelta
import re
import traceback

from accounts.models import StudentProfile
# pyrefly: ignore [missing-import]
from django.contrib.auth import get_user_model
# pyrefly: ignore [missing-import]
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

from learn.models import Domain, Level, Lesson, LevelProgress, DomainProgress, CapstoneSubmission
from accounts.models import StudentProfile
from api.serializers import (
    DomainSerializer, LevelSerializer, LessonSerializer, UserStatsSerializer,
    CapstoneSubmissionSerializer, UserProfileSerializer
)
from api.ai_services import generate_project_blueprint, generate_code_review, generate_video_quiz, ask_oracle
from learn.services.github_service import fetch_github_repo_content
from learn.services.ai_evaluator import evaluate_code
from rest_framework import viewsets


def get_dev_user():
    """Get the dev user for mock auth. In production, use request.user instead."""
    User = get_user_model()
    return User.objects.get(username='dev')


class UserMeView(APIView):
    """
    GET /api/v1/users/me/
    Returns the current user's gamification stats.
    """
    from rest_framework.permissions import IsAuthenticated
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserStatsSerializer(request.user.profile)
        return Response(serializer.data)


class UserProfileView(APIView):
    """
    GET  /api/v1/users/profile/  — full dashboard payload (rank, XP, theme, progress)
    PATCH /api/v1/users/profile/ — update name, bio, avatar, theme_preference
    """
    from rest_framework.permissions import IsAuthenticated
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        profile = request.user.profile
        # Auto-sync rank from XP on every read
        computed = profile.compute_rank()
        if profile.current_rank != computed:
            profile.current_rank = computed
            profile.save(update_fields=['current_rank'])
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = request.user.profile
        user = request.user
        updated_fields = []
        updated_user_fields = []

        # ── Name (on CustomUser) ─────────────────────────────────────
        name = request.data.get('name')
        if name is not None:
            user.name = name.strip()
            updated_user_fields.append('name')

        # ── Bio (on StudentProfile) ──────────────────────────────────
        bio = request.data.get('bio')
        if bio is not None:
            if len(bio) > 160:
                return Response(
                    {'error': 'Bio must be 160 characters or fewer.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            profile.bio = bio.strip()
            updated_fields.append('bio')

        # ── Avatar (file upload) ─────────────────────────────────────
        avatar = request.FILES.get('avatar')
        if avatar is not None:
            profile.avatar = avatar
            updated_fields.append('avatar')

        # ── Theme preference ─────────────────────────────────────────
        theme = request.data.get('theme_preference')
        if theme is not None:
            if theme not in StudentProfile.VALID_THEMES:
                return Response(
                    {'error': f'Invalid theme. Choose from: {sorted(StudentProfile.VALID_THEMES)}'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            profile.theme_preference = theme
            updated_fields.append('theme_preference')

        # ── Persist ──────────────────────────────────────────────────
        if updated_user_fields:
            user.save(update_fields=updated_user_fields)
        if updated_fields:
            profile.save(update_fields=updated_fields)

        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


class DomainViewSet(ReadOnlyModelViewSet):
    """
    Read-only API for learning domains (tracks).
    Lists all domains with nested levels and lessons.
    """
    queryset = Domain.objects.filter(is_published=True).prefetch_related('levels__lessons').all()
    serializer_class = DomainSerializer
    lookup_field = 'name'  # Allow lookup by slug: /api/v1/domains/cloud/


class LevelViewSet(ReadOnlyModelViewSet):
    """
    Read-only API for levels.
    Supports filtering by domain: /api/v1/levels/?domain=cloud
    """
    queryset = Level.objects.select_related('domain').prefetch_related('lessons').all()
    serializer_class = LevelSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        domain_name = self.request.query_params.get('domain')
        if domain_name:
            qs = qs.filter(domain__name=domain_name)
        return qs

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def pass_quiz(self, request, pk=None):
        level = self.get_object()
        user = request.user
        
        with transaction.atomic():
            domain_progress, _ = DomainProgress.objects.get_or_create(
                user=user,
                domain=level.domain
            )
            
            if domain_progress.highest_unlocked_level == level.number:
                domain_progress.highest_unlocked_level += 1
                domain_progress.save()
                
                profile = user.profile
                profile.xp += 50
                profile.total_xp += 50
                profile.current_rank = profile.compute_rank()
                profile.save()

        # Re-fetch profile to ensure serializer sees updated domain_progress
        profile = StudentProfile.objects.select_related('user').get(user=user)
                
        return Response({
            'status': 'success',
            'user': UserProfileSerializer(profile).data
        }, status=status.HTTP_200_OK)


class LessonViewSet(ReadOnlyModelViewSet):
    """
    Read-only API for individual lessons.
    Supports filtering by level: /api/v1/lessons/?level=<id>
    Also provides POST /api/v1/lessons/{id}/complete/ to mark lesson done.
    """
    queryset = Lesson.objects.select_related('level__domain').all()
    serializer_class = LessonSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        level_id = self.request.query_params.get('level')
        if level_id:
            qs = qs.filter(level_id=level_id)
        return qs

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def complete(self, request, pk=None):
        """
        POST /api/v1/lessons/{id}/complete/

        Marks a lesson as completed for the current user:
        1. Get-or-create LevelProgress for this user + lesson's level
        2. Add lesson to lessons_completed (idempotent)
        3. Award XP and coins to UserProfile
        4. Update streak based on last_active_date
        5. Check if all mandatory lessons are done → mark level complete
        6. Return updated user stats
        """
        lesson = self.get_object()
        user = request.user
        profile = user.profile
        today = date.today()

        with transaction.atomic():
            # 1. Get or create LevelProgress
            level_progress, _ = LevelProgress.objects.get_or_create(
                user=user,
                level=lesson.level,
            )

            # 2. Check if already completed (idempotent)
            already_completed = level_progress.lessons_completed.filter(pk=lesson.pk).exists()

            if not already_completed:
                # Add lesson to completed set
                level_progress.lessons_completed.add(lesson)

                # 3. Award XP and coins
                profile.xp += lesson.xp_reward
                profile.total_xp += lesson.xp_reward
                profile.coins += lesson.coins_reward

                # 4. Streak logic
                if profile.last_active_date is None:
                    # First ever activity
                    profile.streak = 1
                elif profile.last_active_date == today:
                    # Already active today — no streak change
                    pass
                elif profile.last_active_date == today - timedelta(days=1):
                    # Active yesterday — increment streak
                    profile.streak += 1
                else:
                    # Streak broken — reset to 1
                    profile.streak = 1

                profile.last_active_date = today
                profile.current_rank = profile.compute_rank()
                profile.save()

            # 5. Check level completion (all mandatory lessons done?)
            mandatory_lessons = set(
                lesson.level.lessons.filter(is_mandatory=True).values_list('pk', flat=True)
            )
            completed_lessons = set(
                level_progress.lessons_completed.values_list('pk', flat=True)
            )
            level_completed = mandatory_lessons.issubset(completed_lessons)

            if level_completed:
                if not level_progress.is_completed:
                    level_progress.is_completed = True
                    level_progress.save()

                # Auto-unlock next level if this level has no boss quiz
                if not lesson.level.quiz_data:
                    domain_progress, _ = DomainProgress.objects.get_or_create(
                        user=user,
                        domain=lesson.level.domain
                    )
                    if domain_progress.highest_unlocked_level == lesson.level.number:
                        domain_progress.highest_unlocked_level += 1
                        domain_progress.save()

        # Re-fetch profile so serializer sees updated domain_progress
        profile = StudentProfile.objects.select_related('user').get(user=user)

        # 6. Return updated stats (full profile payload)
        return Response({
            'status': 'already_completed' if already_completed else 'completed',
            'lesson': {
                'id': lesson.id,
                'title': lesson.title,
                'xp_reward': lesson.xp_reward,
                'coins_reward': lesson.coins_reward,
            },
            'user': UserProfileSerializer(profile).data,
            'level_completed': level_completed,
        }, status=status.HTTP_200_OK)


class BlueprintView(APIView):
    """
    POST /api/v1/ai/architect/

    Accepts a project prompt and returns a step-by-step blueprint.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        prompt = request.data.get('prompt', '').strip()

        if not prompt:
            return Response(
                {'error': 'A "prompt" field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            steps = generate_project_blueprint(prompt)
            return Response({
                'prompt': prompt,
                'steps': steps,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return Response(
                {'error': 'The Architect is meditating. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CodeReviewView(APIView):
    """
    POST /api/v1/ai/reviewer/

    Accepts a code snippet and returns structured review findings.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip()

        if not code:
            return Response(
                {'error': 'A "code" field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        language = request.data.get('language', 'python').strip()
        try:
            findings = generate_code_review(code, language)
            return Response({
                'code': code,
                'language': language,
                'findings': findings,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return Response(
                {'error': 'The Reviewer is meditating. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SynapseExtractView(APIView):
    """
    POST /api/v1/ai/synapse/
    Accepts video_url, extracts video_id, calls Gemini for quiz generation.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        video_url = request.data.get('video_url', '').strip()
        
        if not video_url:
            return Response(
                {'error': 'A "video_url" field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        # Extract ID using regex
        video_id = None
        patterns = [
            r'(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})',
            r'(?:youtu\.be\/)([a-zA-Z0-9_-]{11})',
            r'(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
            r'^([a-zA-Z0-9_-]{11})$' # allow raw ID
        ]
        
        for pattern in patterns:
            match = re.search(pattern, video_url)
            if match:
                video_id = match.group(1)
                break
                
        if not video_id:
            return Response(
                {'error': 'Invalid YouTube URL or ID.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
            
        try:
            quiz = generate_video_quiz(video_id)
            return Response(quiz, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            traceback.print_exc()
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OracleChatView(APIView):
    """
    POST /api/v1/ai/oracle/
    Accepts message and history, calls ask_oracle, returns reply.
    """
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])

        if not message:
            return Response(
                {'error': 'A "message" field is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            reply = ask_oracle(message, history)
            return Response({'reply': reply}, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return Response(
                {'error': 'The Oracle is meditating. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CapstoneSubmissionViewSet(viewsets.ModelViewSet):
    """
    POST /api/v1/capstone/
    Accepts a GitHub URL, extracts code, grades it, and returns the AI report card.
    """
    queryset = CapstoneSubmission.objects.all()
    serializer_class = CapstoneSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        domain_id = request.data.get('domain')
        github_url = request.data.get('github_url')
        
        if not domain_id or not github_url:
            return Response({'error': 'domain and github_url are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            domain = Domain.objects.get(pk=domain_id)
        except Domain.DoesNotExist:
            return Response({'error': 'Domain not found'}, status=status.HTTP_404_NOT_FOUND)

        # 1. Save as pending
        submission = CapstoneSubmission.objects.create(
            user=user,
            domain=domain,
            github_url=github_url,
            status='pending'
        )

        try:
            # 2. Fetch code from GitHub
            code_content = fetch_github_repo_content(github_url)
            
            # 3. Grade using AI
            eval_result = evaluate_code(domain.title, code_content)
            
            # 4. Update the submission
            submission.score = eval_result['score']
            submission.passed = eval_result['passed']
            submission.ai_feedback = eval_result['feedback']
            submission.status = 'graded'
            submission.save()
            
        except Exception as e:
            submission.status = 'failed'
            submission.ai_feedback = f"Error during evaluation: {str(e)}"
            submission.save()

        # 5. Return updated submission
        serializer = self.get_serializer(submission)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


