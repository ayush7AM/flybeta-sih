from django.contrib import admin

from learn.models import Domain, Level, Lesson, DomainProgress, LevelProgress


# ---------------------------------------------------------------------------
# Content models
# ---------------------------------------------------------------------------

@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    list_display = ('title', 'name', 'color', 'icon')
    search_fields = ('title', 'name')
    prepopulated_fields = {'name': ('title',)}


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ('order', 'title', 'xp_reward', 'coins_reward', 'is_mandatory')
    ordering = ('order',)


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'domain', 'number', 'title')
    list_filter = ('domain',)
    inlines = (LessonInline,)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'order', 'xp_reward', 'coins_reward', 'is_mandatory')
    list_filter = ('level__domain', 'is_mandatory')
    search_fields = ('title',)


# ---------------------------------------------------------------------------
# Progress models
# ---------------------------------------------------------------------------

@admin.register(DomainProgress)
class DomainProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'domain', 'current_level', 'is_unlocked')
    list_filter = ('domain', 'is_unlocked')
    search_fields = ('user__username',)


@admin.register(LevelProgress)
class LevelProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'is_completed')
    list_filter = ('level__domain', 'is_completed')
    search_fields = ('user__username',)
