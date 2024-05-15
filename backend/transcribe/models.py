from django.db import models

class Transcription(models.Model):
    audio_file = models.FileField(upload_to='audio/')
    transcription_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.transcription_text[:50]
