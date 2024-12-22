from rest_framework import serializers
from .models import SavedTranscription, UserFavorite

class SavedTranscriptionSerializer(serializers.ModelSerializer):
    image_file = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()

    def get_image_file(self, obj):
        request = self.context.get('request')
        if obj.image_file:
            return request.build_absolute_uri(obj.image_file.url)
        return None
    
    def get_profile_picture(self, obj):
        request = self.context.get('request')  # Get the request context
        user_profile = obj.user.profile
        if user_profile.profile_picture:
            return request.build_absolute_uri(user_profile.profile_picture.url)  # Use build_absolute_uri
        return None
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        user = obj.user
        return obj.favorited_by.filter(user=user).exists()

    class Meta:
        model = SavedTranscription
        fields = '__all__'

class UserFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFavorite
        fields = '__all__'
