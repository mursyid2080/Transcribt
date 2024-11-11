from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import SavedTranscription
import json

@csrf_exempt  # Temporarily disable CSRF for testing (for APIs, use proper CSRF token handling)
# Inside your Django view
def save_transcription(request):
    if request.method == 'POST':
        # Retrieve standard fields from `request.POST`
        title = request.POST.get('title')
        author = request.POST.get('author')
        categories = json.loads(request.POST.get('categories', '[]'))  # Deserialize JSON string to Python list
        score_data = json.loads(request.POST.get('score_data', '{}'))  # Deserialize JSON string to Python dict
        is_published = request.POST.get('is_published') == 'true'

        # Retrieve file uploads from `request.FILES`
        audio_file = request.FILES.get('audio_file')
        image_file = request.FILES.get('image_file')

        # Now you can use these files, for example:
        # Save them to a model, handle them, or validate them

        # Example saving to a model
        transcription = SavedTranscription.objects.create(
            title=title,
            author=author,
            categories=categories,
            score_data=score_data,
            is_published=is_published,
            audio_file=audio_file,
            image_file=image_file,
        )

        # Response to confirm the save operation
        return JsonResponse({'message': 'Transcription saved successfully!'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
