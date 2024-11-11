from django.contrib import admin

# Register your models here.
from .models import SavedTranscription

@admin.register(SavedTranscription)
class SavedTranscriptionAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_published')
    search_fields = ('title', 'author')
