from rest_framework import serializers
from .models import SavedTranscription

class SavedTranscriptionSerializer(serializers.ModelSerializer):
    image_file = serializers.SerializerMethodField()

    def get_image_file(self, obj):
        request = self.context.get('request')
        if obj.image_file:
            return request.build_absolute_uri(obj.image_file.url)
        return None

    class Meta:
        model = SavedTranscription
        fields = '__all__'
