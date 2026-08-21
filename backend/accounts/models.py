from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Extended profile attached 1:1 to Django's built-in User.
    Stores gamification state: XP, coins, streak.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
    )
    xp = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f'{self.user.username} — XP: {self.xp}, Coins: {self.coins}'
