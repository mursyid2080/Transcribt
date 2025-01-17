import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import TranscriptionCard from "../components/TranscriptionCard";
import TranscriptionPage from "../components/TranscriptionPage";
import "./Home.css";
import API_BASE_URL from "../config";

const Home = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/transcription/api/transcriptions/`, {}, {
          withCredentials: true
        });
        const data = response.data;

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

        setTranscriptions(data);
        setTrending(sortedTrending);
        setCategories(groupedCategories);
      } catch (error) {
        console.error("Error fetching transcriptions:", error);
      }
    };

    fetchData();
  }, []);

  const handleScroll = (direction, ref) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      ref.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: "smooth" });
    }
  };

  const trendingRef = React.createRef();

  return (
    <div className="home-page">
      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search" />
        <button>Search</button>
      </div>

      {/* Trending Section */}
      <section className="trending-section">
        <h2>Trending</h2>
        <div className="scroll-container">
          <button className="scroll-button left" onClick={() => handleScroll("left", trendingRef)}>
            &lt;
          </button>
          <div className="trending-grid" ref={trendingRef}>
            {trending.map((item) => (
              <Link
                to={`/transcription/${item.id}`}
                key={item.id}
                style={{ backgroundColor: "transparent" }}
              >
                <TranscriptionCard
                  image={item.image_file}
                  title={item.title}
                  likes={item.favorites}
                  saves={item.saves || 0}
                />
              </Link>
            ))}
          </div>
          <button className="scroll-button right" onClick={() => handleScroll("right", trendingRef)}>
            &gt;
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Categories</h2>
        {Object.keys(categories).map((category) => (
          <div key={category} className="category-row">
            {/* Left section with image and title */}
            <div className="category-left">
              <img
                src={`/images/${category}.jpg`} // Adjust path dynamically
                alt={category}
                className="category-image"
              />
              <h3 className="category-title">{category}</h3>
            </div>

            {/* Right section with cards */}
            <div className="category-cards">
              {categories[category].map((item) => (
                <Link
                  to={`/transcription/${item.id}`}
                  key={item.id}
                  style={{ backgroundColor: "transparent" }}
                >
                  <TranscriptionCard
                    image={item.image_file}
                    title={item.title}
                    likes={item.favorites}
                    saves={item.saves || 0}
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>


      {/* Routes */}
      <Routes>
        <Route path="/transcription/:id" element={<TranscriptionPage />} />
      </Routes>
    </div>
  );
};

export default Home;
