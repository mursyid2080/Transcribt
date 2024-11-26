import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TranscriptionPost = () => {
  const { id } = useParams(); // Access the dynamic 'id' from the URL
  const [transcription, setTranscription] = useState(null);

  useEffect(() => {
    // Fetch the specific transcription using the id from the URL
    axios
      .get(`http://localhost:8000/transcription/api/transcriptions/${id}/`)
      .then((response) => {
        setTranscription(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transcription:", error);
      });
  }, [id]);

  if (!transcription) {
    return <div>Loading...</div>; // Display a loading message while fetching
  }

  return (
    <div>
      <h2>{transcription.title}</h2>
      
    </div>
  );
};

export default TranscriptionPost;
