from rest_framework import serializers

from learn.models import Domain, Level, Lesson, DomainProgress
from accounts.models import UserProfile

class DomainProgressSerializer(serializers.ModelSerializer):
    domain_name = serializers.CharField(source='domain.name', read_only=True)

    class Meta:
        model = DomainProgress
        fields = ['domain_name', 'is_unlocked', 'current_level', 'highest_unlocked_level']


class UserStatsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    domain_progress = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['username', 'xp', 'coins', 'streak', 'last_active_date', 'domain_progress']

    def get_domain_progress(self, obj):
        progress = obj.user.domain_progress.all()
        return DomainProgressSerializer(progress, many=True).data


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id', 'level', 'order', 'title',
            'content_md', 'xp_reward', 'coins_reward', 'is_mandatory',
            'illustration_url',
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
        fields = ['id', 'name', 'title', 'icon', 'color', 'levels']
