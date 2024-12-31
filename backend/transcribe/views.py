from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transcription
from .serializers import TranscriptionSerializer
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import logging
from pydub import AudioSegment
import os
import requests
import soundfile as sf
from scipy.io import wavfile
import music21
import tempfile
import base64
from django.http import JsonResponse, HttpResponse
from django.core.files.storage import FileSystemStorage
from pathlib import Path
import crepe
from scipy.io import wavfile
from music21 import midi, converter
import shutil
from IPython.core.display import display, HTML, Javascript
import json, random
from django.conf import settings

import matplotlib.pyplot as plt
import librosa
from librosa import display as librosadisplay

import logging
import math
import statistics
import sys

from IPython.display import Audio, Javascript

import uuid
from base64 import b64decode

import omnizart
from omnizart.vocal import VocalTranscription
from music21 import converter, note, stream, tempo
import pretty_midi
import malaya_speech    
import numpy as np
from malaya_speech import Pipeline
from crepe_notes import crepe_notes
from django.http import FileResponse

EXPECTED_SAMPLE_RATE = 16000

A4 = 440
C0 = A4 * pow(2, -4.75)
note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

MAX_ABS_INT16 = 32768.0

logger = logging.getLogger(__name__)

class TranscriptionUploadView(APIView):
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
        # Check if a file was uploaded
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file uploaded'}, status=400)

            # Save the uploaded file
            audio_file = request.FILES['file']
            output_file = str(uuid.uuid4()) + ".wav"
            convert_to_wav(audio_file, output_file)

            # Resolve the directory of the output file
            # Assuming output_dir is defined and you want the files to be saved inside the `media` directory.
            output_dir = Path("media")  # or set this to another desired location
            output_dir.mkdir(parents=True, exist_ok=True)  # Ensure the directory exists

            # Define the base filename (e.g., from the audio file name or as needed)
            base_filename = "converted"  # You can dynamically change this based on the input file

            # Combine output_dir and base_filename to get the full path
            analysis_files_prefix = output_dir / base_filename

            try:
                # Process the audio file with crepe_notes
                sr, audio = wavfile.read(str(output_file))
                time, frequency, confidence, activation = crepe.predict(audio, sr, viterbi=True, model_capacity='medium')

                # Generate MIDI from crepe_notes
                midi_data = crepe_notes.process(frequency, confidence, Path(output_file), sensitivity=0.002)
                print("Generated MIDI data")
             
                # Define the paths for the generated .wav and .mid files
                                # Define the paths for the generated .wav and .mid files
                wav_file = Path(output_file).with_suffix('.wav')
                midi_file = Path(output_file).with_suffix('.transcription.mid')

                # Define the destination paths in the media folder
                media_wav_file = Path(settings.MEDIA_ROOT) / wav_file.name
                media_midi_file = Path(settings.MEDIA_ROOT) / midi_file.name

                # Move the .wav file to the media folder
                shutil.move(str(wav_file), str(media_wav_file))
                shutil.move(str(midi_file), str(media_midi_file))

                file_name_without_extension = os.path.splitext(output_file)[0]
                new_midi_name = f"{file_name_without_extension}.mid"

                # Define the path for the renamed MIDI file in the media folder
                new_media_midi_file = Path(settings.MEDIA_ROOT) / new_midi_name

                # Rename and move the MIDI file
                os.rename(media_midi_file, new_media_midi_file)
                # shutil.move(str(midi_file), str(media_midi_file))
                # midi_file_path = tempfile.mktemp(suffix='.mid')
                # with open(midi_file_path, 'wb') as f:
                #     f.write(midi_data)  # Assuming `crepe_notes.process` returns binary MIDI data

    

                print(f"Generated MIDI file: {midi_data}")
                # Convert MIDI to MusicXML
            

                # small_model = malaya_speech.stt.deep_transducer(model = 'small-conformer')
                # print("Loaded model")

                # # Load the audio file
                # y, sr = malaya_speech.load(output_file)
                # if y is None or len(y) == 0:
                #     raise ValueError("The audio file is empty or not loaded properly.")

                # # Perform speech-to-text
                # result = small_model.greedy_decoder([y])

                # Clean up temporary files
                # os.remove(base_filename + '.transcription' + '.mid')
                # os.remove(output_file + '.amp_envelope' + '.npz')
                # os.remove(output_file + '.f0' + '.csv')
                # os.remove(output_file + '.onsets' + '.npz')
                # os.remove(output_file + '.wav')
                file_name_without_extension = os.path.splitext(output_file)[0]

                sc_dict = {
                    'midi_file': file_name_without_extension,  # Include the MusicXML representation
                    'speech_transcription': "result" # Include the speech transcription
                }

                # Return the MusicXML as a downloadable response
                return Response({'transcription': sc_dict}, status=status.HTTP_200_OK)

            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
                print(f"Error processing the audio file: {str(e)}")
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_midi_file(request):
    print("get_midi_file")
    
    # Get the output_file (just the base name)
    output_file = request.GET.get('output_file')
    file_path = os.path.join(settings.MEDIA_ROOT, 'midi_files', output_file)
    if os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='audio/midi')
            response['Content-Disposition'] = f'attachment; filename={output_file}'
            return response
    else:
        return HttpResponse(status=404)
    
# def convert_to_wav(file_path):
#     """
#     Convert an MP3 file to WAV using FFmpeg or other conversion tools.
#     If the file is already a WAV file, it returns the same path.
#     """
#     if file_path.endswith('.wav'):
#         return file_path

#     wav_file_path = tempfile.mktemp(suffix='.wav')
#     os.system(f'ffmpeg -i "{file_path}" "{wav_file_path}"')
#     print(f"File converted to WAV format and saved as {wav_file_path}")
#     return wav_file_path


from music21 import midi, stream, note, meter, converter
import tempfile
import os
from lxml import etree


def convert_midi_to_musicxml(midi_file_path):
    # Parse the MIDI file using music21
    midi_data = converter.parse(midi_file_path)

    # Check if there is a time signature and set it if it's missing
    if midi_data.getTimeSignatures():
        time_signature = midi_data.getTimeSignatures()[0]
    else:
        time_signature = meter.TimeSignature('4/4')  # Default to 4/4 time signature
    
    # Insert the time signature at the start of the stream
    midi_data.insert(0, time_signature)

    # Convert to MusicXML format and write to string (no need to save to a file)
    musicxml_data = midi_data.write('musicxml')  # This will return a file path

    # Optionally, we can use lxml to pretty-print the MusicXML content if you need it to be formatted
    tree = etree.parse(str(musicxml_data))
    pretty_musicxml = etree.tostring(tree, pretty_print=True, encoding='unicode')

    # Return the pretty-formatted MusicXML string
    return pretty_musicxml

# def convert_midi_to_musicxml(midi_file_path):
#     # midi = pretty_midi.PrettyMIDI(midi_file_path)
#     midi_data = converter.parse(midi_file_path)


#     # Convert to MusicXML
#     musicxml_data = midi_data.write('musicxml')

#     # Read the MusicXML file and return its content as a string
#     with open(musicxml_data, 'r') as file:
#         musicxml_str = file.read()

#     # Return or send musicxml_str in your web response
#     return musicxml_str

# def convert_midi_to_musicxml(midi_file_path):
#     """
#     Convert a MIDI file to MusicXML format using pretty_midi and music21.
#     """
#     # Load the MIDI file with pretty_midi
#     midi = pretty_midi.PrettyMIDI(midi_file_path)

#     # Create a Music21 Stream to hold the music
#     score = stream.Score()

#     # We will create one part for all instruments (or you can separate by instruments if desired)
#     part = stream.Part()

#     # Iterate through all instruments in the MIDI file
#     for instrument in midi.instruments:
#         # Iterate through all the notes for the instrument
#         for note_obj in instrument.notes:
#             # Convert PrettyMIDI notes to Music21 notes
#             n = note.Note(note_obj.pitch)
#             n.quarterLength = note_obj.quarter_length  # Duration of the note
#             part.append(n)

#     # Add the part to the score
#     score.append(part)

#     # Optionally, set up a time signature and tempo if present in the MIDI
#     if midi.time_signature is not None:
#         score.append(meter.TimeSignature(f'{midi.time_signature.numerator}/{midi.time_signature.denominator}'))

#     if midi.get_end_time() > 0:
#         score.append(tempo.MetronomeMark(number=120))  # Default tempo, you can modify this based on MIDI info

#     # Write the score to a MusicXML string
#     musicxml_content = score.write('musicxml')

#     return musicxml_content

# def convert_midi_to_musicxml(midi_file_path):
#     """
#     Convert a MIDI file to MusicXML format using music21.
#     Adds measures for every 4 notes.
#     """
#     try:
#         # Load the MIDI file
#         print(f"Converting MIDI file to MusicXML: {midi_file_path}")
#         midi_data = midi.MidiFile()
#         midi_data.open(Path(midi_file_path))
#         midi_data.read()
#         midi_data.close()
#         print("Loaded MIDI data")

#         # Parse MIDI data into a music21 stream
#         midi_stream = converter.parse(Path(midi_file_path))
#         print("Parsed MIDI data")

#         # Create a new score and set up measures
#         score = stream.Score()
#         current_measure = stream.Measure(number=1)
#         note_count = 0

#         for element in midi_stream.flat.notes():
#             if isinstance(element, note.Note) or isinstance(element, note.Rest):
#                 current_measure.append(element)
#                 note_count += 1

#                 # Add a new measure every 4 notes
#                 if note_count == 4:
#                     score.append(current_measure)
#                     current_measure = stream.Measure(number=current_measure.number + 1)
#                     note_count = 0

#         # Append the last measure if not empty
#         if len(current_measure) > 0:
#             score.append(current_measure)

#         # Ensure there is at least one measure in the score
#         if len(score) == 0:
#             raise ValueError("No valid notes found in the MIDI file.")

#         # Write the score to a MusicXML file
#         musicxml_file = tempfile.mktemp(suffix='.musicxml')
#         score.write('musicxml', fp=musicxml_file)

#         # Read the MusicXML content into a variable
#         with open(musicxml_file, 'r') as f:
#             musicxml_content = f.read()

#         # Clean up the temporary file
#         os.remove(musicxml_file)

#         return musicxml_content

#     except Exception as e:
#         raise ValueError(f"Error converting MIDI to MusicXML: {str(e)}")
#         print(f"Error converting MIDI to MusicXML: {str(e)}")

# class TranscriptionUploadView(APIView):
#     def post(self, request, *args, **kwargs):
#         file = request.FILES.get('file')
#         if file:
#             ## Convert input audio file to WAV format
#             output_file = "converted.wav"
#             convert_to_wav(file, output_file)

#             # Initialize the vocal transcription model (like SPICE)
#             vocal_transcriber = VocalTranscription()

#             # Transcribe the vocal melody directly into a music21 stream object
#             midi_object = vocal_transcriber.transcribe(output_file)

#             # Convert the transcription to a music21 stream
#             midi_stream = stream.Stream()
    


#             # Add notes to the stream only if their duration is supported
#             for instrument in midi_object.instruments:  # Loop through each instrument
#                 for midi_note in instrument.notes:  # Access the notes for that instrument
#                     if isinstance(midi_note, pretty_midi.Note):
#                         note_duration = midi_note.end - midi_note.start
#                         if is_supported_duration(note_duration):
#                             music21_note = note.Note(midi_note.pitch)
#                             music21_note.quarterLength = note_duration
#                             midi_stream.append(music21_note)

#             # Analyze the transcribed notes directly from the `music21` stream
#             for element in midi_stream.flat.notes:
#                 if isinstance(element, note.Note):
#                     print(f"Note: {element.nameWithOctave}, Duration: {element.duration.quarterLength} quarter lengths")
#                 elif isinstance(element, note.Rest):
#                     print(f"Rest, Duration: {element.duration.quarterLength} quarter lengths")

#             # Create a music21 score object
#             sc = stream.Score()
#             sc.append(midi_stream)  # Add the midi_stream to the score

#             # Write the score to a MusicXML string
#             xml = sc.write('musicxml')

            
#             # Read the MusicXML content into a variable
#             with open(xml, 'r') as f:
#                 musicxml_content = f.read()


#             # Initialize Malaya for speech recognition
#             # Load the pre-trained speech-to-text (ASR) model
#             small_model = malaya_speech.stt.deep_transducer(model = 'small-conformer')
#             print("Loaded model")

#             # Load the audio file
#             y, sr = malaya_speech.load('converted.wav')
#             if y is None or len(y) == 0:
#                 raise ValueError("The audio file is empty or not loaded properly.")

#             # Perform speech-to-text
#             result = small_model.greedy_decoder([y])

#             # Prepare the response dictionary with both transcription and sheet music
#             sc_dict = {
#                 'musicxml': musicxml_content,  # Include the MusicXML representation
#                 'speech_transcription': result # Include the speech transcription
#             }

#             # Clean up the temporary files
#             os.remove(output_file)
#             os.remove(xml)

#             return Response({'transcription': sc_dict}, status=status.HTTP_200_OK)



#         else:
#             return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

#     # def post(self, request, *args, **kwargs):
#         file = request.FILES.get('file')
#         if file:
#             output_file = "converted.wav"
#             convert_to_wav(file, output_file)
            
#             # Load SPICE model
#             model = hub.load("https://tfhub.dev/google/spice/2")
            
#             # Read the converted audio file
#             audio_data, sample_rate = sf.read(output_file)

#             converted_audio_file = convert_audio_for_model(output_file)

#             sample_rate, audio_samples = wavfile.read(converted_audio_file, 'rb')

#             # Show some basic information about the audio.
#             duration = len(audio_samples)/sample_rate
#             print(f'Sample rate: {sample_rate} Hz')
#             print(f'Total duration: {duration:.2f}s')
#             print(f'Size of the input: {len(audio_samples)}')

#             audio_samples = audio_samples / float(MAX_ABS_INT16)
            
#             # load pre-trained SPICE model
#             model = hub.load("https://tfhub.dev/google/spice/2")    

#             # prediction
#             model_output = model.signatures["serving_default"](tf.constant(audio_samples, tf.float32))
#             # pitch
#             pitch_outputs = model_output["pitch"]
#             # uncertainty generated
#             uncertainty_outputs = model_output["uncertainty"]

#             # 'Uncertainty' basically means the inverse of confidence.
#             confidence_outputs = 1.0 - uncertainty_outputs


#             confidence_outputs = list(confidence_outputs)
#             pitch_outputs = [ float(x) for x in pitch_outputs]

#             indices = range(len (pitch_outputs))
#             confident_pitch_outputs = [ (i,p)
#             # remove low confidence estimates of value c and plot remaining ones
#                 for i, p, c in zip(indices, pitch_outputs, confidence_outputs) if  c >= 0.5  ]
#             confident_pitch_outputs_x, confident_pitch_outputs_y = zip(*confident_pitch_outputs)

#             confident_pitch_values_hz = [ output2hz(p) for p in confident_pitch_outputs_y ]

#             # if there is no singing the output becomes zero, for generating empty notes
#             pitch_outputs_and_rests = [
#                 output2hz(p) if c >= 0.9 else 0
#                 for i, p, c in zip(indices, pitch_outputs, confidence_outputs)
#             ]

#             A4 = 440
#             C0 = A4 * pow(2, -4.75)
#             note_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

#             # The ideal offset is the mean quantization error for all the notes
#             # (excluding rests):
#             offsets = [hz2offset(p) for p in pitch_outputs_and_rests if p != 0]
#             print("offsets: ", offsets)

#             ideal_offset = statistics.mean(offsets)
#             print("ideal offset: ", ideal_offset)

#             # best_error = float("inf")
#             # best_notes_and_rests = None
#             # best_predictions_per_note = None

#             # for predictions_per_note in range(20, 65, 1):
#             #     for prediction_start_offset in range(predictions_per_note):

#             #         error, notes_and_rests = get_quantization_and_error(
#             #             pitch_outputs_and_rests, predictions_per_note,
#             #             prediction_start_offset, ideal_offset)
#             #         print(1)
#             #         if error < best_error:
#             #             best_error = error
#             #             print(best_error)
                        
#             #             best_notes_and_rests = notes_and_rests
#             #             best_predictions_per_note = predictions_per_note

#             best_notes_and_rests, best_predictions_per_note, best_error = find_best_quantization(pitch_outputs_and_rests, ideal_offset)

#             # Now you can use the returned values as needed
#             print("Best quantization:")
#             print("Notes and rests:", best_notes_and_rests)
#             print("Best predictions per note:", best_predictions_per_note)
#             print("Best error:", best_error)    
#             # At this point, best_notes_and_rests contains the best quantization.
#             # Since we don't need to have rests at the beginning, let's remove these:
#             # while best_notes_and_rests[0] == 'Rest':
#             #     est_notes_and_rests = best_notes_and_rests[1:]
#             # # Also remove silence at the end.
#             # while best_notes_and_rests[-1] == 'Rest':
#             #     best_notes_and_rests = best_notes_and_rests[:-1]

            
#             # Creating the sheet music score.
#             sc = music21.stream.Score()
#             # Adjust the speed to match the actual singing.
#             bpm = 60 * 60 / best_predictions_per_note
#             print ('bpm: ', bpm)
#             a = music21.tempo.MetronomeMark(number=bpm)
#             sc.insert(0,a)

#             for snote in best_notes_and_rests:
#                 # set all notes to have same duration; half note for simplicity
#                 d = 'half'
#                 if snote == 'Rest':
#                     sc.append(music21.note.Rest(type=d))
#                 else:
#                     sc.append(music21.note.Note(snote, type=d))
                        
            
#             xml = open(sc.write('musicxml')).read()

#             sc_dict = {
#                 'metadata': sc.metadata,  # Include any metadata if needed
#                 'notes_and_rests': [str(element) for element in sc],  # Convert notes and rests to strings
#                 'musicxml': xml  # Include the MusicXML representation
#             }

          

#             return Response({'transcription': sc_dict}, status=status.HTTP_200_OK)
#         else:
#             return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

def find_best_quantization(pitch_outputs_and_rests, ideal_offset):
    best_error = float('inf')  # Initialize best_error to a large value
    best_notes_and_rests = None
    best_predictions_per_note = None

    for predictions_per_note in range(20, 65, 1):
        for prediction_start_offset in range(predictions_per_note):

            error, notes_and_rests = get_quantization_and_error(
                pitch_outputs_and_rests, predictions_per_note,
                prediction_start_offset, ideal_offset)
            
            if error < best_error:
                best_error = error
                best_notes_and_rests = notes_and_rests
                best_predictions_per_note = predictions_per_note 

    return best_notes_and_rests, best_predictions_per_note, best_error


def is_supported_duration(duration):
    MIN_DURATION = 1/64.0
    return duration >= MIN_DURATION

def showScore(score):
    xml = open(score.write('musicxml')).read()
    showMusicXML(xml)

def showMusicXML(xml):
    DIV_ID = "OSMD_div"
    display(HTML('<div id="'+DIV_ID+'">loading OpenSheetMusicDisplay</div>'))
    script = """
    var div_id = %%DIV_ID%%;
    function loadOSMD() {
        return new Promise(function(resolve, reject){
            if (window.opensheetmusicdisplay) {
                return resolve(window.opensheetmusicdisplay)
            }
            // OSMD script has a 'define' call which conflicts with requirejs
            var _define = window.define // save the define object
            window.define = undefined // now the loaded script will ignore requirejs
            var s = document.createElement( 'script' );
            s.setAttribute( 'src', "https://cdn.jsdelivr.net/npm/opensheetmusicdisplay@0.7.6/build/opensheetmusicdisplay.min.js" );
            //s.setAttribute( 'src', "/custom/opensheetmusicdisplay.js" );
            s.onload=function(){
                window.define = _define
                resolve(opensheetmusicdisplay);
            };
            document.body.appendChild( s ); // browser will try to load the new script tag
        })
    }
    loadOSMD().then((OSMD)=>{
        window.openSheetMusicDisplay = new OSMD.OpenSheetMusicDisplay(div_id, {
          drawingParameters: "compacttight"
        });
        openSheetMusicDisplay
            .load(%%data%%)
            .then(
              function() {
                openSheetMusicDisplay.render();
              }
            );
    })
    """.replace('%%DIV_ID%%',DIV_ID).replace('%%data%%',json.dumps(xml))
    display(Javascript(script))
    return

# try different speed and time offsets to speculate the sequence of notes in the audio
def quantize_predictions(group, ideal_offset):
  # Group values are either 0, or a pitch in Hz.
  non_zero_values = [v for v in group if v != 0]
  zero_values_count = len(group) - len(non_zero_values)

  # Create a rest if 80% is silent, otherwise create a note.
  if zero_values_count > 0.8 * len(group):
    # Interpret as a rest. Count each dropped note as an error, weighted a bit
    # worse than a badly sung note (which would 'cost' 0.5).
    return 0.51 * len(non_zero_values), "Rest"
  else:
    # Interpret as note, estimating as mean of non-rest predictions.
    h = round(
        statistics.mean([
            12 * math.log2(freq / C0) - ideal_offset for freq in non_zero_values
        ]))
    octave = h // 12
    n = h % 12
    note = note_names[n] + str(octave)
    # Quantization error is the total difference from the quantized note.
    error = sum([
        abs(12 * math.log2(freq / C0) - ideal_offset - h)
        for freq in non_zero_values
    ])
    return error, note


def get_quantization_and_error(pitch_outputs_and_rests, predictions_per_eighth,
                               prediction_start_offset, ideal_offset):
  # Apply the start offset - we can just add the offset as rests.
  pitch_outputs_and_rests = [0] * prediction_start_offset + \
                            pitch_outputs_and_rests
  # Collect the predictions for each note (or rest).
  groups = [
      pitch_outputs_and_rests[i:i + predictions_per_eighth]
      for i in range(0, len(pitch_outputs_and_rests), predictions_per_eighth)
  ]

  quantization_error = 0

  notes_and_rests = []
  for group in groups:
    error, note_or_rest = quantize_predictions(group, ideal_offset)
    quantization_error += error
    notes_and_rests.append(note_or_rest)

  return quantization_error, notes_and_rests

# adding offset so the notes can be represented easily with the 12 notes.
def hz2offset(freq):
  # This measures the quantization error for a single note.
  if freq == 0:  # Rests always have zero error.
    return None
  # Quantized note.
  h = round(12 * math.log2(freq / C0))
  return 12 * math.log2(freq / C0) - h

def output2hz(pitch_output):
  # Constants taken from https://tfhub.dev/google/spice/2
  PT_OFFSET = 25.58
  PT_SLOPE = 63.07
  FMIN = 10.0;
  BINS_PER_OCTAVE = 12.0;
  cqt_bin = pitch_output * PT_SLOPE + PT_OFFSET;
  return FMIN * 2.0 ** (1.0 * cqt_bin / BINS_PER_OCTAVE)

def convert_audio_for_model(user_file, output_file='converted_audio_file.wav'):
  audio = AudioSegment.from_file(user_file)
  audio = audio.set_frame_rate(EXPECTED_SAMPLE_RATE).set_channels(1)
  audio.export(output_file, format="wav")
  return output_file

def download_blob(blob_url, save_path):
    response = requests.get(blob_url)
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"Blob downloaded successfully to {save_path}")
    else:
        print(f"Failed to download Blob. Status code: {response.status_code}")

def convert_to_wav(input_file, output_file):
    sound = AudioSegment.from_file(input_file)
    sound.export(output_file, format="wav")
    print(f"File converted to WAV format and saved as {output_file}")

def convert_pitch_to_text(pitch, confidence):
    """
    Placeholder function to convert pitch and confidence arrays to text.
    This requires additional implementation to interpret pitch values as phonemes or words.
    """
    # Example: Dummy conversion logic (to be replaced with actual implementation)
    transcription_text = "Transcribed text based on pitch data."
    return transcription_text
