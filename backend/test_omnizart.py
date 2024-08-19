import omnizart
from omnizart.vocal import VocalTranscription
from music21 import converter, note, stream
import os

# Initialize the vocal transcription model
vocal_transcriber = VocalTranscription()

# Path to the audio file (e.g., an mp3 or wav file)
audio_path = "Recording1.wav"

# Transcribe the vocal melody and save it to a file
midi_object = vocal_transcriber.transcribe(audio_path)
midi_path = "output_transcription.mid"
midi_object.write(midi_path)

# Verify that the file exists
if os.path.exists(midi_path):
    print(f"MIDI file exists at: {midi_path}")
else:
    print("MIDI file not found!")

# Load the MIDI file with music21
midi_score = converter.parse(midi_path)

# Extract notes and durations
for element in midi_score.flat.notes:
    if isinstance(element, note.Note):
        print(f"Note: {element.nameWithOctave}, Duration: {element.duration.quarterLength} quarter lengths")
    elif isinstance(element, note.Rest):
        print(f"Rest, Duration: {element.duration.quarterLength} quarter lengths")
