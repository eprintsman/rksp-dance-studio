from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django.conf import settings
from django.conf.urls.static import static

from .views import (
    DirectionViewSet, TrainerViewSet,
    HallViewSet, AbonementTypeViewSet,
    UserViewSet, AbonementViewSet,
    TrainingViewSet, UserTrainingViewSet
)


router = DefaultRouter()
router.register(r'directions', DirectionViewSet, basename='direction')
router.register(r'trainers', TrainerViewSet, basename='trainer')
router.register(r'halls', HallViewSet, basename='hall')
router.register(r'abonement-types', AbonementTypeViewSet, basename='abonement-type')
router.register(r'users', UserViewSet, basename='user')
router.register(r'abonements', AbonementViewSet, basename='abonement')
router.register(r'trainings', TrainingViewSet, basename='training')
router.register(r'registrations', UserTrainingViewSet, basename='registration')

urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)