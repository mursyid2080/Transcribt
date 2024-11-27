from django.db import models

class SavedTranscription(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    categories = models.JSONField()  # Django 3.1+ supports JSONField natively
    score_data = models.JSONField()
    is_published = models.BooleanField(default=False)
    audio_file = models.FileField(upload_to='audio_files/')  # Define upload path
    image_file = models.ImageField(upload_to='image_files/', null=True, blank=True)
    saves = models.IntegerField(default=0)

