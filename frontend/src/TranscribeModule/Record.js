import React, { useState } from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import Box from '@mui/material/Box';
import { Container } from "@mui/material";
import axios from 'axios';

export default function Record({ onMusicXml }) {
  const [audioDetails, setAudioDetails] = useState({
    url: null,
    blob: null,
    chunks: null,
    duration: { h: 0, m: 0, s: 0 }
  });

  const handleAudioStop = (data) => {
    console.log(data);
    setAudioDetails(data);
  };

  const handleAudioUpload = () => {
    if (!audioDetails.url) {
      console.error('No audio URL provided');
      return;
    }

    // Use axios to download the audio file from the URL
    axios.get(audioDetails.url, {
        responseType: 'blob' // Ensure response type is blob to receive binary data
    })
    .then(response => {
        const audioBlob = response.data;
        
        // Now you have the audio data in blob format, proceed with FormData
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav'); // Assuming the filename is 'audio.wav'

        // Send the FormData with axios
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
    })
    .catch(error => {
        console.error('Error downloading audio file:', error);
    });
};


  const handleReset = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: { h: 0, m: 0, s: 0 }
    };
    setAudioDetails(reset);
  };

  return (
    <Container
      className="Record"
      style={{
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
        backgroundColor: "#212121",
        width: "600px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <Recorder
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontFamily: 'Poppins, sans-serif'
        }}
        record={true}
        hideHeader={true}
        audioURL={audioDetails.url}
        showUIAudio
        handleAudioStop={(data) => handleAudioStop(data)}
        handleAudioUpload={handleAudioUpload}
        handleReset={() => handleReset()}
      />
      {/* <button onClick={handleAudioUpload}>Upload Audio</button> */}
    </Container>
  );
}
