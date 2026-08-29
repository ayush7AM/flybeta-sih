from rest_framework import serializers

from learn.models import Domain, Level, Lesson, DomainProgress, CapstoneSubmission
from accounts.models import StudentProfile

class DomainProgressSerializer(serializers.ModelSerializer):
    domain_name = serializers.CharField(source='domain.name', read_only=True)

    class Meta:
        model = DomainProgress
        fields = ['domain_name', 'is_unlocked', 'current_level', 'highest_unlocked_level']


class UserStatsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    domain_progress = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ['username', 'xp', 'coins', 'streak', 'last_active_date', 'total_xp', 'current_rank', 'domain_progress']

    def get_domain_progress(self, obj):
        progress = obj.user.domain_progress.all()
        return DomainProgressSerializer(progress, many=True).data


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id', 'level', 'order', 'title',
            'content_md', 'xp_reward', 'coins_reward', 'is_mandatory',
            'illustration_url', 'lesson_type',
        ]


class LevelSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ['id', 'domain', 'number', 'title', 'description', 'lessons', 'quiz_data']


class DomainSerializer(serializers.ModelSerializer):
    levels = LevelSerializer(many=True, read_only=True)

    class Meta:
        model = Domain
        fields = ['id', 'name', 'title', 'icon', 'color', 'track_code', 'character_image', 'is_published', 'levels']


class CapstoneSubmissionSerializer(serializers.ModelSerializer):
    domain_name = serializers.CharField(source='domain.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = CapstoneSubmission
        fields = [
            'id', 'user', 'username', 'domain', 'domain_name',
            'github_url', 'status', 'ai_feedback', 'score', 'passed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'ai_feedback', 'score', 'passed', 'user']

