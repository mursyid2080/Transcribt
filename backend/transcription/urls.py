from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import save_transcription, TranscriptionListView, TranscriptionDetailView

urlpatterns = [
    path('save-transcription/', save_transcription, name='save_transcription'),
    path('api/transcriptions/', TranscriptionListView.as_view(), name='transcription-list'),
    path('api/transcriptions/<int:id>/', TranscriptionDetailView.as_view(), name='transcription-detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
