import React from "react";
import { Routes, Route } from "react-router-dom";
import TranscriptionCardList from "../components/TranscriptionCardList"; // Parent component for the list of transcription cards
import TranscriptionPage from "../components/TranscriptionPage"; // Component to display the transcription details

const Home = () => {
  return (
    <Routes>
      <Route path="/" element={<TranscriptionCardList />} />
      <Route path="/transcription/:id" element={<TranscriptionPage />} />
 
    </Routes>
  );
};

export default Home;
