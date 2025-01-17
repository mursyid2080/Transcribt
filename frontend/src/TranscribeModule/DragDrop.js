import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FileUploader } from "react-drag-drop-files";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import API_BASE_URL from '../config';


const fileTypes = ['mp3', 'wav'];

function DragDrop({ onMusicXml, setLoading }) { // Accept onMusicXml prop
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate


  const handleChange = (selectedFile) => {
    const { name } = selectedFile;
    setFile(selectedFile);
    console.log('Selected file:', name);
  };

  const handleUpload = () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    setLoading(true); // Set loading to true when the upload starts

    const formData = new FormData();
    formData.append('file', file, file.name);

    axios.post(`${API_BASE_URL}/transcribe/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      const { transcription } = response.data;

      // Access MusicXML
      const midi = transcription.midi_file;

      // Access speech transcription
      const speechTranscription = transcription.speech_transcription;

      const audioFileURL = URL.createObjectURL(file);
      // let midiURL;
      // if (midi instanceof Blob) {
      //   midiURL = URL.createObjectURL(midi);
      // } else {
      //   // Convert to Blob if not already
      //   const byteCharacters = atob(midi);
      //   const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      //   const byteArray = new Uint8Array(byteNumbers);
      //   const midiBlob = new Blob([byteArray], { type: 'audio/midi' });
      //   midiURL = URL.createObjectURL(midiBlob);
      // }
      // const midiURL = URL.createObjectURL(midi);
      // console.log('Generated MIDI File URL:', midiURL);  // Check if the URL is correct
      console.log('Generated Audio File URL:', audioFileURL);  // Check if the URL is correct


      // Now you can use the data
      console.log('Midi:', midi);
      console.log('Speech Transcription:', speechTranscription);

      navigate('/editor', { 
        state: { 
          score: midi, 
          audioFile: audioFileURL } 
        });
        
      // onMusicXml(transcription.musicxml);  // Pass MusicXML data to parent component
    })  
    .catch(error => {
      console.error('There was an error uploading the file!', error);
      setLoading(false);
    })
    .finally(() => {
      setLoading(false); // Set loading to false when the upload is complete
    });
    
    
  };

  const dropMessageStyle = {
    backgroundColor: 'red',
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", fontFamily: 'Poppins, sans-serif' }}>
      <Box sx={{ border: "2px dashed black", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>
          Drag & Drop File Here
        </Typography>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          dropMessageStyle={dropMessageStyle}
        >
          <MusicNoteIcon fontSize="large" />
          <Typography variant="body1" sx={{ marginTop: 1, fontFamily: 'Poppins, sans-serif' }}>
            {fileTypes.join(", ")}
          </Typography>
        </FileUploader>
        {file && (
          <>
            <Typography variant="body1" sx={{ marginTop: 1, fontFamily: 'Poppins, sans-serif' }}>
              Selected file: {file.name}
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2, fontFamily: 'Poppins, sans-serif' }} onClick={handleUpload}>
              Upload
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}

export default DragDrop;
