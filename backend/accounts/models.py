from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Adds a required 'name' field and enforces unique email.
    """
    name = models.CharField(max_length=150, help_text='Full display name')
    email = models.EmailField(unique=True, help_text='Unique email address')

    # USERNAME_FIELD remains 'username' (inherited from AbstractUser)
    REQUIRED_FIELDS = ['name', 'email']  # prompted when creating superuser via CLI

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.username} ({self.name})'


class StudentProfile(models.Model):
    """
    Extended profile attached 1:1 to CustomUser.
    Stores gamification state and user preferences.
    """
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='profile',
    )

    # Gamification — original fields
    xp = models.IntegerField(default=0, help_text='Legacy XP (from lessons)')
    coins = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)

    # New fields
    total_xp = models.IntegerField(default=0, help_text='Cumulative XP across all tracks')
    current_rank = models.CharField(max_length=50, default='Novice')
    theme_preference = models.CharField(max_length=50, default='doraemon')

    class Meta:
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'

    def __str__(self):
        return f'{self.user.username} — XP: {self.total_xp}, Rank: {self.current_rank}'
