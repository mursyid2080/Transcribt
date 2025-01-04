from rest_framework import serializers
from .models import SavedTranscription, UserFavorite
import tempfile
import base64
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from music21 import converter, midi, musicxml

class SavedTranscriptionSerializer(serializers.ModelSerializer):
    # image_file = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    is_favorited = serializers.SerializerMethodField()

    # def get_image_file(self, obj):
    #     request = self.context.get('request')
    #     if obj.image_file:
    #         return request.build_absolute_uri(obj.image_file.url)
    #     return None
    
    def get_profile_picture(self, obj):
        request = self.context.get('request')  # Get the request context
        user_profile = obj.user.profile
        if user_profile.profile_picture:
            return request.build_absolute_uri(user_profile.profile_picture.url)  # Use build_absolute_uri
        return None
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        user = obj.user
        return obj.favorited_by.filter(user=user).exists()
    
    # def get_pdf_file(self, obj):
    #     if obj.score_data:
    #         score = converter.parse(obj.score_data.path)
    #         with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_pdf:
    #             c = canvas.Canvas(temp_pdf.name, pagesize=letter)
    #             c.drawString(100, 750, "MusicXML to PDF Conversion")
                
    #             # Render the score onto the PDF
    #             for element in score.flat.notes:
    #                 c.drawString(100, 700 - 20 * element.offset, str(element))
                
    #             c.showPage()
    #             c.save()
    #             temp_pdf.seek(0)
    #             pdf_content = temp_pdf.read()
    #             pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
    #             return f"data:application/pdf;base64,{pdf_base64}"
    #     return None


    # def get_midi_file(self, obj):
    #     if obj.score_data:
    #         # Convert XML to MIDI
    #         score = converter.parse(obj.score_data.path)
    #         with tempfile.NamedTemporaryFile(delete=False, suffix='.mid') as temp_midi:
    #             mf = midi.translate.music21ObjectToMidiFile(score)
    #             mf.open(temp_midi.name, 'wb')
    #             mf.write()
    #             mf.close()
    #             temp_midi.seek(0)
    #             midi_content = temp_midi.read()
    #             midi_base64 = base64.b64encode(midi_content).decode('utf-8')
    #             return f"data:audio/midi;base64,{midi_base64}"
    #     return None

    class Meta:
        model = SavedTranscription
        fields = '__all__'

    # def to_representation(self, instance):
    #     ret = super().to_representation(instance)
    #     ret.update({
    #         'midi_file': self.get_midi_file(instance),
    #         'pdf_file': self.get_pdf_file(instance),
    #     })
    #     return ret

class UserFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFavorite
        fields = '__all__'
