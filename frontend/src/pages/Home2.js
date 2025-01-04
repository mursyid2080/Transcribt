import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftSection from "./LeftSection";
import MiddleSection from "./MiddleSection";
import RightSection from "./RightSection";
import "./Home2.css";
import API_BASE_URL from "../config";

const Home = ({ searchInput, setSearchInput }) => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.time('fetchTranscriptions');
        const response = await axios.get(`${API_BASE_URL}/transcription/api/transcriptions/`, {}, {
          withCredentials: true
        });
        console.timeEnd('fetchTranscriptions');
        console.log('Response size:', response.data.length);

        const allData = response.data;

        const data = allData.filter(item => item.is_published);

        const sortedTrending = [...data].sort((a, b) => b.saves - a.saves).slice(0, 10);

        const groupedCategories = {};
        data.forEach((item) => {
          const itemCategories = Array.isArray(item.categories) ? item.categories : [];
          itemCategories.forEach((category) => {
            if (!groupedCategories[category]) groupedCategories[category] = [];
            groupedCategories[category].push(item);
          });
        });

        for (let category in groupedCategories) {
          groupedCategories[category] = groupedCategories[category].sort((a, b) => new Date(b.date) - new Date(a.date));
        }

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
      <MiddleSection
        className="middle-section"
        transcriptions={transcriptions}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchInput={searchInput} // Pass searchInput to MiddleSection
        setSearchInput={setSearchInput}
      />
      <RightSection
        className="right-section"
        categories={categories}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
};

export default Home;