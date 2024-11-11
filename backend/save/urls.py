
from django.urls import path
from . import views

urlpatterns = [
    path('save-transcription/', views.save_transcription, name='save_transcription'),
]
