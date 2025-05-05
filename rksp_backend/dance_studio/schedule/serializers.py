from rest_framework import serializers
import base64
from django.core.files.base import ContentFile
from .models import (
    Direction, Trainer, Hall, 
    AbonementType, CustomUser,
    Abonement, Training, UserTraining
)


class Base64ImageField(serializers.ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]

            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)

        return super().to_internal_value(data)


class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = '__all__'


class TrainerSerializer(serializers.ModelSerializer):
    photo = Base64ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Trainer
        fields = '__all__'


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = '__all__'


class AbonementTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbonementType
        fields = '__all__'


class AbonementSerializer(serializers.ModelSerializer):
    abonement_type = AbonementTypeSerializer(read_only=True)
    abonement_type_id = serializers.PrimaryKeyRelatedField(
        queryset=AbonementType.objects.all(),
        source='abonement_type',
        write_only=True
    )

    class Meta:
        model = Abonement
        fields = '__all__'
        read_only_fields = ['user']


class UserSerializer(serializers.ModelSerializer):
    abonements = AbonementSerializer(many=True, read_only=True)
    abonement_id = serializers.PrimaryKeyRelatedField(
        queryset=Abonement.objects.all(),
        source='abonements',
        write_only=True,
        many=True
    )

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                 'phone', 'birth_date', 'abonements', 'abonement_id']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'read_only': True},  # Запрещаем изменение username
            'email': {'read_only': True},    # Запрещаем изменение email
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class TrainingSerializer(serializers.ModelSerializer):
    direction = DirectionSerializer(read_only=True)
    trainer = TrainerSerializer(read_only=True)
    hall = HallSerializer(read_only=True)
    direction_id = serializers.PrimaryKeyRelatedField(
        queryset=Direction.objects.all(),
        source='direction',
        write_only=True
    )
    trainer_id = serializers.PrimaryKeyRelatedField(
        queryset=Trainer.objects.all(),
        source='trainer',
        write_only=True
    )
    hall_id = serializers.PrimaryKeyRelatedField(
        queryset=Hall.objects.all(),
        source='hall',
        write_only=True
    )
    
    class Meta:
        model = Training
        fields = '__all__'


class UserTrainingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    training = TrainingSerializer(read_only=True)
    training_id = serializers.PrimaryKeyRelatedField(
        queryset=Training.objects.all(),
        source='training',
        write_only=True
    )
    # training = serializers.PrimaryKeyRelatedField(queryset=Training.objects.all())

    class Meta:
        model = UserTraining
        fields = '__all__'
        read_only_fields = ['user']
