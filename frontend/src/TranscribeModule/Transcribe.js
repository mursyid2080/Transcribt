import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import LinkIcon from '@mui/icons-material/Link';
import { GitHub, Twitter, Facebook, Instagram, Youtube } from "react-feather"
import IconButton from "./IconButton"
import DragDrop from './DragDrop';
import Record from './Record';
import MusicXMLRenderer from './MusicXMLRenderer';

function InputSelector({ onClick }) {
  return (
    <div className="flex flex-row justify-center gap-4">
      <IconButton text="File" onClick={() => onClick('DragDrop')}>
        <AudioFileIcon size={20} />
      </IconButton>
      <IconButton text="Record" color="bg-blue-500" onClick={() => onClick('Record')}>
        <KeyboardVoiceIcon size={20} />
      </IconButton>

    </div>
  );
}

const Transcribe = () => {

  const [musicxml, setMusicxml] = useState(null); // State to hold MusicXML data

  // Function to handle MusicXML data
  const handleMusicXml = (data) => {
    setMusicxml(data); // Update MusicXML data in state
  };
  
  const inputDictionary = {
    'DragDrop': <DragDrop onMusicXml={handleMusicXml} />,
    'Record': <Record onMusicXml={handleMusicXml} />
  };
  
  const [currentInput, setCurrentInput] = useState('DragDrop');
  
  const handleInputClick = (value) => {
    console.log('Clicked value:', value);
    setCurrentInput(value);
  };

  

  return (
    <div style={{height: '92vh', backgroundImage: `url('/images/input.jpg')`}}>
      <div style={{height: '92vh', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>

        <Container maxWidth="lg" style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <Typography variant="h4" align="center" gutterBottom style={{marginTop: "60px", fontFamily: "Poppins"}}>
            Transcribe Your Music
          </Typography>
          <Typography variant="body1" align="center" paragraph style={{width: "400px", fontFamily: "Poppins"}}>
            This page allows you to upload an audio file or record your voice to generate a music sheet. 
            Simply choose your preferred input method below and let our tool do the rest. 
            Create beautiful music sheets effortlessly with your voice!
          </Typography>
          <div className="inputSelection" style={{ marginTop: '20px' }}>
            <InputSelector onClick={handleInputClick} />
            <Box>
              {inputDictionary[currentInput]}
            </Box>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Transcribe;
