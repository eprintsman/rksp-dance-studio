from django.db import models
from django.contrib.auth.models import AbstractUser


class Direction(models.Model):
    """Dance direction model"""
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Direction"
        verbose_name_plural = "Directions"


class Trainer(models.Model):
    """Trainer model"""
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    experience = models.PositiveIntegerField()
    photo = models.ImageField(
        upload_to='trainers/photo/',
        null=True,
        default=None
        )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Trainer"
        verbose_name_plural = "Trainers"


class AbonementType(models.Model):
    """Abonement type model"""
    name = models.CharField(max_length=100)
    lesson_count = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.lesson_count} lessons ({self.price} USD)"

    class Meta:
        verbose_name = "Abonement Type"
        verbose_name_plural = "Abonement Types"


class CustomUser(AbstractUser):
    """Extended user model with abonement  reference"""
    phone = models.CharField(max_length=20, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class Abonement(models.Model):
    """User's abonement  model"""
    abonement_type = models.ForeignKey(
        AbonementType,
        on_delete=models.PROTECT,
        related_name='abonements'   # related_name='abonement'
    )
    remaining_lessons = models.PositiveIntegerField()
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='abonements'
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user} - {self.abonement_type})"

    class Meta:
        verbose_name = "Abonement"
        verbose_name_plural = "Abonements"


class Hall(models.Model):
    """Training hall model"""
    name = models.CharField(max_length=100, unique=True)
    capacity = models.PositiveIntegerField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} (capacity: {self.capacity})"

    class Meta:
        verbose_name = "Hall"
        verbose_name_plural = "Halls"


class Training(models.Model):
    """Training session model"""
    start_datetime = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    hall = models.ForeignKey(
        Hall,
        on_delete=models.PROTECT,
        related_name='trainings'
    )
    direction = models.ForeignKey(
        Direction,
        on_delete=models.PROTECT,
        related_name='trainings'
    )
    trainer = models.ForeignKey(
        Trainer,
        on_delete=models.PROTECT,
        related_name='trainings'
    )
    is_active = models.BooleanField(default=True)
    max_participants = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.direction} with {self.trainer} at {self.start_datetime}"

    class Meta:
        verbose_name = "Training"
        verbose_name_plural = "Trainings"
        ordering = ['start_datetime']


class UserTraining(models.Model):
    """Many-to-many relationship between users and trainings"""
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='user_trainings'
    )

    training = models.ForeignKey(
        Training,
        on_delete=models.CASCADE,
        related_name='user_trainings'
    )

    def __str__(self):
        return f"{self.user} - {self.training}"

    class Meta:
        verbose_name = "User Training"
        verbose_name_plural = "User Trainings"
        unique_together = ('user', 'training')
