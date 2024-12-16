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


@method_decorator(csrf_exempt, name='dispatch')
class RequestResetEmailView(View):
    def get(self, request):
        return JsonResponse({'message': 'Please provide your email to reset the password.'})

    def post(self, request):
        email = request.POST.get('email')

        if not email:
            return JsonResponse({'error': 'Email is required.'}, status=400)

        user = User.objects.filter(email=email).first()
        if user:
            email_subject = 'Reset Your Password'
            message = f"Click the link to reset your password: /reset-password/{user.pk}"

            email_message = EmailMessage(
                email_subject,
                message,
                settings.EMAIL_HOST_USER,
                [email]
            )
            email_message.send()

        return JsonResponse({'message': 'If the email is valid, instructions to reset your password have been sent.'})


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
