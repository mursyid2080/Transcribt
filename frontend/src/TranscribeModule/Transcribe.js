import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
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

function InputSelector({onClick}) {
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
  )
}



const Transcribe = () => {
  const inputDictionary = {
    'DragDrop': <DragDrop />, 
    'Record': <Record />
  };
  const [currentInput, setCurrentInput] = useState('DragDrop');
  const handleInputClick = (value) => {
    // Here you can do whatever you want with the clicked value
    console.log('Clicked value:', value);
    setCurrentInput(value);
    // For example, you can set the value to state or pass it to another function
  };
    return(
        <div>
            <div className="main-content">
                <InputSelector onClick={handleInputClick}/>
                <Box>
                  {inputDictionary[currentInput]}
                </Box>
            </div>
        </div>
    )
}

export default Transcribe;