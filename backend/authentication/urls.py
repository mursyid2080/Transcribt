from authentication import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (TokenObtainPairView)
from .views import PasswordResetRequestView, PasswordResetConfirmView


urlpatterns = [
    path('register', views.RegistrationView.as_view(), name='register'),
    path('login', views.LoginView.as_view(), name='login'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('csrf-token/', views.CSRFTokenView.as_view(), name='csrf-token'),
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/profile/update/', views.UpdateUserProfileView.as_view(), name='update-user-profile'),
    
    path('password_reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password_reset/confirm/<str:uid>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)