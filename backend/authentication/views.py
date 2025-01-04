from django.shortcuts import render
from django.views.generic import View
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile
from .serializers import UserProfileSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import PasswordResetSerializer
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model

@method_decorator(csrf_exempt, name='dispatch')
class RegistrationView(View):
    def get(self, request):
        return JsonResponse({'message': 'Please fill out the registration form.'})

    def post(self, request):
        email = request.POST.get('email')
        username = request.POST.get('username')
        # full_name = request.POST.get('name')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        print(request)

        errors = []

        if len(password) < 6:
            errors.append('Passwords should be at least 6 characters long.')

        if password != password2:
            errors.append('Passwords do not match.')

        if User.objects.filter(email=email).exists():
            errors.append('Email is already taken.')

        if User.objects.filter(username=username).exists():
            errors.append('Username is already taken.')

        if errors:
            return JsonResponse({'errors': errors}, status=400)

        user = User.objects.create_user(username=username, email=email)
        user.set_password(password)
        # user.first_name = full_name
        # user.last_name = full_name
        user.is_active = True  # Directly activate the account
        user.save()

        

        return JsonResponse({'message': 'Account created successfully. You can now log in.'})


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def get(self, request):
        return JsonResponse({'message': 'Please provide login credentials.'})

    def post(self, request):
        print(request.POST)
        username = request.POST.get('username')
        password = request.POST.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Both username and password are required.'}, status=400)

        user = authenticate(request, username=username, password=password)

        if not user:
            return JsonResponse({'error': 'Invalid credentials.'}, status=401)

        login(request, user)
        print(f'Authenticated user: {request.user}')  # Should print the user object
        print(f'Session ID: {request.session.session_key}')


        # Generate tokens using SimpleJWT
        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            'message': 'Login successful.',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        })

class CSRFTokenView(View):
    def get(self, request):
        csrf_token = get_token(request)  # Generate and return the CSRF token
        return JsonResponse({'csrfToken': csrf_token})
    
class HomeView(View):
    def get(self, request):
        return JsonResponse({'message': 'Welcome to the home page!'})


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(View):
    def post(self, request):
        logout(request)
        return JsonResponse({'message': 'Logout successful.'})


class PasswordResetRequestView(APIView):
    """
    Sends a password reset email with a link containing a token.
    """
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                # Generate password reset token and email link
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(str(user.pk).encode())
                reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
                
                # Send email with reset link
                send_mail(
                    'Password Reset Request',
                    f'Click the link to reset your password: {reset_link}',
                    'noreply@yourdomain.com',
                    [email],
                )
                return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)
            return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    def post(self, request, uid, token):
        try:
            # Decode the uid (which is base64 encoded)
            uid = urlsafe_base64_decode(uid).decode()  # Decoding the uid
            user = get_user_model().objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, get_user_model().DoesNotExist):
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the token is valid
        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        # Reset password logic
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Set and save the new password
        user.set_password(new_password)
        user.save()

        return Response({"success": "Password reset successful"}, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class SetNewPasswordView(View):
    def post(self, request, uidb64):
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if len(password) < 6:
            return JsonResponse({'error': 'Passwords should be at least 6 characters long.'}, status=400)

        if password != password2:
            return JsonResponse({'error': 'Passwords do not match.'}, status=400)

        try:
            user = User.objects.get(pk=uidb64)
            user.set_password(password)
            user.save()

            return JsonResponse({'message': 'Password reset successful. You can now log in.'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid user ID.'}, status=400)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user, context={"request": request})
        return Response(serializer.data)

class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        print(data)

        # Update email if provided and not empty
        email = data.get('email')
        if email:
            user.email = email

        # Update bio if provided and not empty
        bio = data.get('bio')
        if bio:
            user.profile.bio = bio

        # Update profile picture if provided
        if 'profile_picture' in request.FILES:
            user.profile.profile_picture = request.FILES['profile_picture']

        user.save()
        user.profile.save()
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)