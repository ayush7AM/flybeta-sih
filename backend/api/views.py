from datetime import date, timedelta

from django.contrib.auth.models import User
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import action
from rest_framework import status

from learn.models import Domain, Level, Lesson, LevelProgress
from accounts.models import UserProfile
from api.serializers import (
    DomainSerializer, LevelSerializer, LessonSerializer, UserStatsSerializer,
)


def get_dev_user():
    """Get the dev user for mock auth. In production, use request.user instead."""
    return User.objects.get(username='dev')


class UserMeView(APIView):
    """
    GET /api/v1/users/me/
    Returns the current user's gamification stats.
    Uses mock auth (dev user) for local development.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_dev_user()
        serializer = UserStatsSerializer(user.profile)
        return Response(serializer.data)


class DomainViewSet(ReadOnlyModelViewSet):
    """
    Read-only API for learning domains (tracks).
    Lists all domains with nested levels and lessons.
    """
    queryset = Domain.objects.prefetch_related('levels__lessons').all()
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

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
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
        user = get_dev_user()
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
                profile.save()

            # 5. Check level completion (all mandatory lessons done?)
            mandatory_lessons = set(
                lesson.level.lessons.filter(is_mandatory=True).values_list('pk', flat=True)
            )
            completed_lessons = set(
                level_progress.lessons_completed.values_list('pk', flat=True)
            )
            level_completed = mandatory_lessons.issubset(completed_lessons)

            if level_completed and not level_progress.is_completed:
                level_progress.is_completed = True
                level_progress.save()

        # 6. Return updated stats
        return Response({
            'status': 'already_completed' if already_completed else 'completed',
            'lesson': {
                'id': lesson.id,
                'title': lesson.title,
                'xp_reward': lesson.xp_reward,
                'coins_reward': lesson.coins_reward,
            },
            'user': UserStatsSerializer(profile).data,
            'level_completed': level_completed,
        }, status=status.HTTP_200_OK)

