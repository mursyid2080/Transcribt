import React, { useState } from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import Box from '@mui/material/Box';
import { Container } from "@mui/material";

export default function Record() {
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

  const handleAudioUpload = (file) => {
    console.log(file);
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
    <Container className="Record" style={{ padding: "20px", borderRadius: "10px", marginTop: "20px", backgroundColor:"#212121"}}>
      <Recorder
        record={true}
        hideHeader={true}
        audioURL={audioDetails.url}
        showUIAudio
        handleAudioStop={(data) => handleAudioStop(data)}
        handleAudioUpload={(data) => handleAudioUpload(data)}
        handleReset={() => handleReset()}
      />
    </Container>
  );
  
}
