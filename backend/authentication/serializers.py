from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()


    def get_profile_picture(self, obj):
        request = self.context.get('request')  # Get the request context
        user_profile = obj.user.profile
        if user_profile.profile_picture:
            return request.build_absolute_uri(user_profile.profile_picture.url)  # Use build_absolute_uri
        return None

    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'bio']
        
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ['username', 'email', 'profile']

# from rest_framework import serializers
# from authentication.models import User
# # from rest_framework_simplejwt.tokens import RefreshToken

# class RegisterSerializer(serializers.ModelSerializer):

#     password=serializers.CharField(
#         max_length=128, min_length=6, write_only=True
#     )

#     class Meta:
#         model=User
#         fields=('username', 'email', 'password', )

#     def create(self, validated_data):
#         return User.objects.create_user(**validated_data)
    
# class LoginSerializer(serializers.ModelSerializer):

#     password=serializers.CharField(
#         max_length=128, min_length=6, write_only=True
#     )

#     class Meta:
#         model=User
#         fields=('username', 'email', 'password', 'token')

#         read_only_fields = ['token']


# # class UserSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model=User
# #         fields='__all__'

# # class UserSerializerWithToken(serializers.ModelSerializer):
# #     def get_token(self,obj):
# #         token=RefreshToken.for_user(obj)
# #         return str(token.access_token)

# #     class Meta:
# #         model=User
# #         fields='__all__'

    