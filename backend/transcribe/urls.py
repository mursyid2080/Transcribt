from django.urls import path
from .views import TranscriptionUploadView
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('upload/', TranscriptionUploadView.as_view(), name='transcription-upload'),
    path('get-midi/', views.get_midi_file, name='get_midi_file'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
