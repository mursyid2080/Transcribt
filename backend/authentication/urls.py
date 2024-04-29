from authentication import views
from django.urls import path

from rest_framework_simplejwt.views import (TokenObtainPairView)

urlpatterns = [
    # path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('users/profile/', views.getUserProfile, name='getUserProfile')
    path('register', views.RegisterAPIView.as_view(), name='register'),
    path('login', views.LoginAPIView.as_view(), name='login'),
    path('user', views.AuthUserAPIView.as_view(), name='user'),
]