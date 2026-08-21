from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

# TODO: Phase 2 — register ViewSets here
# router.register(r'domains', DomainViewSet)
# router.register(r'levels', LevelViewSet)
# ...

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
]
