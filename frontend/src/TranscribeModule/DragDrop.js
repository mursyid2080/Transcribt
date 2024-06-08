import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FileUploader } from "react-drag-drop-files";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import axios from 'axios';

const fileTypes = ['mp3', 'wav', 'flac'];

function DragDrop({ onMusicXml }) { // Accept onMusicXml prop
  const [file, setFile] = useState(null);

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

    const formData = new FormData();
    formData.append('file', file, file.name);

    axios.post('http://localhost:8000/transcribe/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log('Transcription:', response.data);
      const { transcription } = response.data;
      onMusicXml(transcription.musicxml);  // Pass MusicXML data to parent component
    })
    .catch(error => {
      console.error('There was an error uploading the file!', error);
    });
  };

  const dropMessageStyle = {
    backgroundColor: 'red',
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Box sx={{ border: "2px dashed black", padding: "20px", borderRadius: "10px", marginTop: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Drag & Drop File Here
        </Typography>
        <FileUploader
          handleChange={handleChange}
          name="file"
          types={fileTypes}
          dropMessageStyle={dropMessageStyle}
        >
          <MusicNoteIcon fontSize="large" />
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            {fileTypes.join(", ")}
          </Typography>
        </FileUploader>
        {file && (
          <>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              Selected file: {file.name}
            </Typography>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleUpload}>
              Upload
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
}

export default DragDrop;
