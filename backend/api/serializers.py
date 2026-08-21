from rest_framework import serializers

from learn.models import Domain, Level, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id', 'level', 'order', 'title',
            'content_md', 'xp_reward', 'coins_reward', 'is_mandatory',
        ]


class LevelSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ['id', 'domain', 'number', 'title', 'description', 'lessons']


class DomainSerializer(serializers.ModelSerializer):
    levels = LevelSerializer(many=True, read_only=True)

    class Meta:
        model = Domain
        fields = ['id', 'name', 'title', 'icon', 'color', 'levels']
