from django.urls import path
from .views import TranscriptionUploadView

urlpatterns = [
    path('upload/', TranscriptionUploadView.as_view(), name='transcription-upload'),
]
