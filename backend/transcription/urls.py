from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import save_transcription, TranscriptionListView, TranscriptionDetailView, ToggleFavoriteView, UserTranscriptionsView

urlpatterns = [
    path('save-transcription/', save_transcription, name='save_transcription'),
    path('api/transcriptions/', TranscriptionListView.as_view(), name='transcription-list'),
    path('api/transcriptions/<int:id>/', TranscriptionDetailView.as_view(), name='transcription-detail'),
    path('api/toggle-favorite/<int:transcription_id>/', ToggleFavoriteView.as_view(), name='toggle-favorite'),
    path('api/user/transcriptions/', UserTranscriptionsView.as_view(), name='user-transcriptions'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
