import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import LeftSection from "./LeftSection";
import MiddleSection from "./MiddleSection";
import RightSection from "./RightSection";
import "./Home2.css";

const Home = () => {
  // const favorites = [
  //   {
  //     id: 1,
  //     image: "https://via.placeholder.com/50",
  //     title: "Towards Dawn",
  //     type: "Album",
  //     author: "Jacob LaVallee",
  //   },
  //   {
  //     id: 2,
  //     image: "https://via.placeholder.com/50",
  //     title: "Ghost Voices",
  //     type: "Single",
  //     author: "Virtual Self",
  //   },
  //   {
  //     id: 3,
  //     image: "https://via.placeholder.com/50",
  //     title: "Shelter",
  //     type: "Song",
  //     author: "Porter Robinson & Madeon",
  //   },
  //   // Additional favorites here...
  // ];

  const [transcriptions, setTranscriptions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState({});
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/transcription/api/transcriptions/", {}, {
          withCredentials: true
        });
        const data = response.data;
        console.log(data);

        // Sort by favorites for trending
        const sortedTrending = [...data].sort((a, b) => b.saves - a.saves).slice(0, 10);

        // Group by categories, avoiding duplicates
        const groupedCategories = {};

        data.forEach((item) => {
          const itemCategories = Array.isArray(item.categories) ? item.categories : [];
          itemCategories.forEach((category) => {
            if (!groupedCategories[category]) groupedCategories[category] = [];
            groupedCategories[category].push(item);
          });
        });

        // Sort each category by date (latest first)
        for (let category in groupedCategories) {
          groupedCategories[category] = groupedCategories[category].sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        // Favorites
        const favoritedTranscriptions = data.filter(item => item.is_favorited);

        setFavorites(favoritedTranscriptions);
        setTranscriptions(data);
        setTrending(sortedTrending);
        setCategories(groupedCategories);
      } catch (error) {
        console.error("Error fetching transcriptions:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="home-container">
      <LeftSection className="left-section" favorites={favorites} />
      <MiddleSection className="middle-section" />
      <RightSection className="right-section" categories={categories} />
    </div>
  );
};

export default Home;
