from django.contrib import admin

# Register your models here.
from .models import SavedTranscription, UserFavorite

@admin.register(SavedTranscription)
class SavedTranscriptionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_published')
    search_fields = ('title', 'author')

@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'transcription', 'favorited_at')  # Columns to display in the admin list view
    search_fields = ('user__username', 'transcription__title')  # Enable search by related fields
    list_filter = ('user', 'favorited_at')  # Filters for the admin interface

