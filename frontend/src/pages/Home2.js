import React from "react";
import LeftSection from "./LeftSection";

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
  ];

  return (
    <div >
      <LeftSection favorites={favorites} />
    </div>
  );
};

export default Home;
