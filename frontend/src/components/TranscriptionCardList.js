import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TranscriptionCard from "./TranscriptionCard";

const TranscriptionCardList = () => {
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    // Fetch data from the Django API
    axios
      .get("http://localhost:8000/transcription/api/transcriptions/")
      .then((response) => {
        setTranscriptions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transcriptions:", error);
      });
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {transcriptions.map((transcription) => (
        <Link
          to={`/transcription/${transcription.id}`}
          key={transcription.id}
          style={{ textDecoration: "none" }}
        >
          <TranscriptionCard
            image={transcription.image_file}
            title={transcription.title}
            likes={transcription.likes}
            saves={transcription.saves}
          />
        </Link>
      ))}
    </div>
  );
};

export default TranscriptionCardList;
