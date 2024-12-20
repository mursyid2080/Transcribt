import React from "react";
import LeftSection from "./LeftSection";
import MiddleSection from "./MiddleSection";
import { MidiInstrument } from "opensheetmusicdisplay";
import "./Home2.css"

const Home = () => {
  const favorites = [
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      title: "Towards Dawn",
      type: "Album",
      author: "Jacob LaVallee",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      title: "Ghost Voices",
      type: "Single",
      author: "Virtual Self",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/50",
      title: "Shelter",
      type: "Song",
      author: "Porter Robinson & Madeon",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/50",
      title: "Towards Dawn (Again)",
      type: "Album",
      author: "Jacob LaVallee",
    },
    {
      id: 5,
      image: "https://via.placeholder.com/50",
      title: "Ghost Voices (Redux)",
      type: "Single",
      author: "Virtual Self",
    },
    {
      id: 6,
      image: "https://via.placeholder.com/50",
      title: "Shelter (Remix)",
      type: "Song",
      author: "Porter Robinson & Madeon",
    },
  ];
  

  return (
    <div className="home-container">
      <LeftSection className="left-section" favorites={favorites} />
      <MiddleSection className="middle-section"/>
    </div>
    

  );
};

export default Home;
