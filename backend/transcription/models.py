from django.db import models
from django.contrib.auth.models import User  # Import User model

class SavedTranscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_transcriptions', null=True, blank=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    categories = models.JSONField()  # Django 3.1+ supports JSONField natively
    score_data = models.JSONField()
    is_published = models.BooleanField(default=False)
    audio_file = models.FileField(upload_to='audio_files/')  # Define upload path
    image_file = models.ImageField(upload_to='image_files/', null=True, blank=True)
    saves = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class UserFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    transcription = models.ForeignKey(SavedTranscription, on_delete=models.CASCADE, related_name='favorited_by')
    favorited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'transcription')  # Prevent a user from favoriting the same transcription multiple times

    def __str__(self):
        return f"{self.user.username} -> {self.transcription.title}"