
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
// import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import { GitHub, Twitter, Facebook, Instagram, Youtube } from "react-feather"
import IconButton from "./IconButton"

const fileTypes = ['mp3', 'wav', 'flac'];

function DragDrop() {
  const [file, setFile] = useState(null);

  const handleChange = (selectedFile) => {
    // Extract file information
    const { name } = selectedFile;
    // Update state with the selected file
    setFile(selectedFile);
    // Log the file name (you can remove this line in production)
    console.log('Selected file:', name);
  };

  const dropMessageStyle = {
    backgroundColor: 'red', // Example styling, replace with your desired styles
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
            Supported file types: {fileTypes.join(", ")}
          </Typography>
        </FileUploader>
        {file && (
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Selected file: {file.name}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default DragDrop;