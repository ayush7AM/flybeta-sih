from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from accounts.models import UserProfile


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = ('xp', 'coins', 'streak', 'last_active_date')


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)


# Re-register the User admin with our inline
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
