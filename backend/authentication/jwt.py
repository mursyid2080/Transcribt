# authentication/jwt.py
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Get the token from the request (typically from the Authorization header)
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None  # No token found, so no authentication

        try:
            # The token should be in the format "Bearer <token>"
            prefix, token = auth_header.split(' ')
            if prefix != 'Bearer':
                raise AuthenticationFailed('Authorization header must start with "Bearer"')

            # Decode the JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])

            # Fetch the user based on the payload's user_id (or another claim)
            user = User.objects.get(id=payload['user_id'])  # Assuming your token has 'user_id'
            
            # Return the user and token if authentication is successful
            return (user, token)
        
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('token is expired')
        except jwt.DecodeError:
            raise AuthenticationFailed('Error decoding token')
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')
