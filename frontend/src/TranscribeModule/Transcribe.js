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
      <IconButton text="URL" color="bg-gradient-to-tr from-yellow-500 to-purple-500 via-pink-500">
        <LinkIcon size={20} />
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
    <Container maxWidth="lg">
      <div className="main-content" marginTop="100px">
        <InputSelector onClick={handleInputClick} />
        <Box>
          {inputDictionary[currentInput]}
        </Box>
      </div>

      {musicxml && (
        <Box sx={{ marginTop: 4, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Music Sheet
          </Typography>
          <MusicXMLRenderer musicxml={musicxml} />
        </Box>
      )}
    </Container>
  );
};

export default Transcribe;
