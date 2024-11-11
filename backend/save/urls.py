
from django.urls import path
from . import views

from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('save-transcription/', views.save_transcription, name='save_transcription'),
]