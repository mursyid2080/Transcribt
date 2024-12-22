from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import SavedTranscription, UserFavorite
from .serializers import SavedTranscriptionSerializer
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from authentication.models import User

@csrf_exempt  # Temporarily disable CSRF for testing (for APIs, use proper CSRF token handling)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_transcription(request):
    if request.method == 'POST':
        # Retrieve standard fields from `request.POST`
        title = request.POST.get('title')
        author = request.POST.get('author')
        lyrics = request.POST.get('lyrics')
        categories = json.loads(request.POST.get('categories', '[]'))  # Deserialize JSON string to Python list

        score_data = request.FILES.get('score_data')  # Deserialize JSON string to Python dict
        print(score_data)
        is_published = request.POST.get('is_published') == 'true'

        # Retrieve file uploads from `request.FILES`
        audio_file = request.FILES.get('audio_file')
        image_file = request.FILES.get('image_file')

        # Now you can use these files, for example:
        # Save them to a model, handle them, or validate them
        print(f'Authenticated user: {request.user}')
        print(f'Session ID: {request.session.session_key}')
        user = request.user

        # Example saving to a model
        transcription = SavedTranscription.objects.create(
            title=title,
            author=author,
            categories=categories,
            score_data=score_data,
            is_published=is_published,
            audio_file=audio_file,
            image_file=image_file,
            lyrics=lyrics,
            user=user,
        )

        # Response to confirm the save operation
        return JsonResponse({'message': 'Transcription saved successfully!'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

class TranscriptionListView(APIView):
    def get(self, request, *args, **kwargs):
        transcriptions = SavedTranscription.objects.all()
        serializer = SavedTranscriptionSerializer(
            transcriptions, many=True, context={"request": request}
        )
        return Response(serializer.data)
    
class TranscriptionDetailView(RetrieveAPIView):
    queryset = SavedTranscription.objects.all()
    serializer_class = SavedTranscriptionSerializer
    lookup_field = 'id'  # Use 'id' instead of 'pk'

class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, transcription_id):
        transcription = get_object_or_404(SavedTranscription, id=transcription_id)

        # Check if the user already favorited the transcription
        favorite, created = UserFavorite.objects.get_or_create(user=request.user, transcription=transcription)

        if not created:
            # If already favorited, unfavorite it
            favorite.delete()
            return Response({'status': 'unfavorited', 'transcription_id': transcription.id})

        # Otherwise, mark as favorite
        return Response({'status': 'favorited', 'transcription_id': transcription.id})
    
