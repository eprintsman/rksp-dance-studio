from rest_framework import viewsets, permissions, status
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from .permissions import IsOwnerOrAdmin
from rest_framework.response import Response
from .models import (
    Direction, Trainer, Hall, 
    AbonementType, CustomUser,
    Abonement, Training, UserTraining
)
from .serializers import (
    DirectionSerializer, TrainerSerializer, 
    HallSerializer, AbonementTypeSerializer,
    UserSerializer, AbonementSerializer,
    TrainingSerializer, UserTrainingSerializer
)


class DirectionViewSet(viewsets.ModelViewSet):
    """API endpoint for dance directions"""
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class TrainerViewSet(viewsets.ModelViewSet):
    """API endpoint for trainers"""
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class HallViewSet(viewsets.ModelViewSet):
    """API endpoint for training halls"""
    queryset = Hall.objects.all()
    serializer_class = HallSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class AbonementTypeViewSet(viewsets.ModelViewSet):
    """API endpoint for Abonement types"""
    queryset = AbonementType.objects.filter(is_active=True)
    serializer_class = AbonementTypeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint for users"""
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]  # Allow registration
        return super().get_permissions()

    def get_object(self):
        if self.kwargs.get('pk') == 'me':
            return self.request.user
        return super().get_object()

    # def list(self, request, *args, **kwargs):
    #     # Обычным пользователям запрещаем просмотр списка пользователей
    #     if not request.user.is_staff:
    #         return Response(
    #             {"detail": "У вас нет прав для просмотра списка пользователей."},
    #             status=status.HTTP_403_FORBIDDEN
    #         )
    #     return super().list(request, *args, **kwargs)


class AbonementViewSet(viewsets.ModelViewSet):
    """API endpoint for Abonements"""
    serializer_class = AbonementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Abonement.objects.all()
        return Abonement.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TrainingViewSet(viewsets.ModelViewSet):
    """API endpoint for training sessions"""
    queryset = Training.objects.filter(is_active=True)
    serializer_class = TrainingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by direction if provided
        direction_id = self.request.query_params.get('direction_id')
        if direction_id:
            queryset = queryset.filter(direction_id=direction_id)
            
        # Filter by trainer if provided
        trainer_id = self.request.query_params.get('trainer_id')
        if trainer_id:
            queryset = queryset.filter(trainer_id=trainer_id)
            
        return queryset.order_by('start_datetime')


class UserTrainingViewSet(viewsets.ModelViewSet):
    queryset = UserTraining.objects.all()
    serializer_class = UserTrainingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Для анонимных пользователей - полный список
        if not self.request.user.is_authenticated:
            return queryset.select_related('user', 'training')
        
        # Если пользователь не администратор - фильтруем по его записям
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        # Дополнительные фильтры из query parameters
        training_id = self.request.query_params.get('training')
        if training_id:
            queryset = queryset.filter(training_id=training_id)
            
        return queryset.select_related('user', 'training')
        
    def create(self, request, *args, **kwargs):
        user = request.user
        training_id = request.data.get('training_id')

        try:
            training = Training.objects.get(id=training_id)
        except Training.DoesNotExist:
            raise ValidationError({"detail": "Тренировка не найдена."})

        abonement = user.abonements.filter(is_active=True).first()

        if not abonement:
            raise ValidationError({"detail": "У вас нет активного абонемента."})

        if abonement.remaining_lessons <= 0:
            raise ValidationError({"detail": "Недостаточно уроков в абонементе."})

        if UserTraining.objects.filter(user=user, training=training).exists():
            raise ValidationError({"detail": "Вы уже записаны на эту тренировку."})

        current_participants = UserTraining.objects.filter(training=training).count()
        if current_participants >= training.max_participants:
            raise ValidationError({"detail": "Не осталось мест."})

        # Создание записи
        registration = UserTraining.objects.create(user=user, training=training)

        # Списываем занятие
        abonement.remaining_lessons -= 1
        abonement.save()

        serializer = self.get_serializer(registration)
        return Response({
            "detail": "Вы успешно записаны на тренировку!",
            "training": TrainingSerializer(training).data,
            "available_spots": training.max_participants - (current_participants + 1),
            "registration": serializer.data
        }, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # Проверяем, что это будущая тренировка
        # if instance.training.start_datetime <= timezone.now():
        #     raise ValidationError({"detail": "Нельзя отменить запись на прошедшую тренировку."})

        # Возврат занятия в активный абонемент
        abonement = user.abonements.filter(is_active=True).first()
        if abonement:
            abonement.remaining_lessons += 1
            abonement.save()

        self.perform_destroy(instance)

        return Response({
            "detail": "Запись отменена. Занятие возвращено в ваш абонемент."
        }, status=status.HTTP_200_OK)
