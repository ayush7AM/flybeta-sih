from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import DomainViewSet, LevelViewSet, LessonViewSet, UserMeView, BlueprintView

router = DefaultRouter()
router.register(r'domains', DomainViewSet)
router.register(r'levels', LevelViewSet)
router.register(r'lessons', LessonViewSet)

app_name = 'api'

urlpatterns = [
    path('users/me/', UserMeView.as_view(), name='user-me'),
    path('ai/architect/', BlueprintView.as_view(), name='ai-architect'),
    path('', include(router.urls)),
]

