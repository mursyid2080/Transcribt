import React, { useState } from "react";
import { Link } from "react-router-dom";
import FavoriteItemCard from "../components/FavoriteItemCard";
import { Scrollbars } from "react-custom-scrollbars";
import "./LeftSection.css";

const LeftSection = ({ favorites }) => {
  const [searchValue, setSearchValue] = useState('');

  // Custom scroll thumb renderer
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "rgba(255, 255, 255, 0.4)", // Semi-transparent white
      borderRadius: "6px", // Rounded corners
      width: "8px", // Thin scrollbar
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredFavorites = favorites.filter(item =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="left-section">
      <div className="favorites-container">
        <h2>Favorites</h2>
        <input
          type="text"
          placeholder="Search favorites..."
          value={searchValue}
          onChange={handleSearchChange}
          className="favorites-search"
        />
        <Scrollbars
          autoHide // Automatically hides scrollbar when inactive
          autoHideTimeout={1000} // Hides after 1 second of inactivity
          autoHideDuration={300} // Smooth hide duration
          renderThumbVertical={renderThumb} // Custom thumb style
          universal={true} // Ensures consistent behavior across devices
        >
          {filteredFavorites.length ? (
            <ul className="favorites-list">
              {filteredFavorites.map((item) => (
                <Link
                  to={`/transcription/${item.id}`}
                  key={item.id}
                  className="favorite-link"
                >
                  <FavoriteItemCard
                    image={item.image_file}
                    title={item.title}
                    type={item.type || "Unknown"}
                    author={item.author}
                  />
                </Link>
              ))}
            </ul>
          ) : (
            <p className="no-favorites">No favorites yet.</p>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default LeftSection;