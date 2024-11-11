from rest_framework import serializers
from .models import SavedTranscription

class SavedTranscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedTranscription
        fields = ['id', 'title', 'author', 'categories', 'score_data', 'audio_file', 'image_file', 'is_published']