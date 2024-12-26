from authentication import views
from django.urls import path

from rest_framework_simplejwt.views import (TokenObtainPairView)

# urlpatterns = [
#     # path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
#     # path('users/profile/', views.getUserProfile, name='getUserProfile')
#     path('register', views.RegisterAPIView.as_view(), name='register'),
#     path('login', views.LoginAPIView.as_view(), name='login'),
#     path('user', views.AuthUserAPIView.as_view(), name='user'),
# ]
urlpatterns = [
    path('register', views.RegistrationView.as_view(), name='register'),
    path('login', views.LoginView.as_view(), name='login'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('csrf-token/', views.CSRFTokenView.as_view(), name='csrf-token'),
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('user/profile/update/', views.UpdateUserProfileView.as_view(), name='update-user-profile'),
    # path('', login_required(views.HomeView.as_view()), name='home'),
    # path('activate/<uidb64>/<token>',
    #      views.ActivateAccountView.as_view(), name='activate'),
    # path('set-new-password/<uidb64>/<token>',
    #      views.SetNewPasswordView.as_view(), name='set-new-password'),
    # path('request-reset-email', views.RequestResetEmailView.as_view(),
    #      name='request-reset-email')
]