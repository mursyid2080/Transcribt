import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TranscriptionCard from "./TranscriptionCard";
import API_BASE_URL from "../config";

const TranscriptionCardList = () => {
  const [transcriptionsList, setTranscriptionsList] = useState([]);

  useEffect(() => {
    // Fetch data from the Django API
    axios
      .get(`${API_BASE_URL}/transcription/api/transcriptions/`)
      .then((response) => {
        setTranscriptionsList(response.data);
        console.log('card list: ',response.data);
      })
      .catch((error) => {
        console.error("Error fetching transcriptions:", error);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {transcriptionsList.map((transcription) => (
        <Link
          to={`/transcription/${transcription.id}`}
          key={transcription.id}
          style={{ textDecoration: "none" }}
        >
          <TranscriptionCard
            image={transcription.image_file}
            title={transcription.title}
            saves={transcription.saves}
          />
        </Link>
      ))}
    </div>
  );
};

export default TranscriptionCardList;
