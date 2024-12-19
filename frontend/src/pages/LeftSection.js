import React from "react";
import { Link } from "react-router-dom";
import FavoriteItemCard from "../components/FavoriteItemCard";
import { Scrollbars } from "react-custom-scrollbars";
import "./LeftSection.css";

const LeftSection = ({ favorites }) => {
  // Custom scroll thumb renderer
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "rgba(255, 255, 255, 0.4)", // Semi-transparent white
      borderRadius: "6px", // Rounded corners
      width: "8px", // Thin scrollbar
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <div className="left-section">
      <h2>Favorites</h2>
      <div className="favorites-container">
        <Scrollbars
          autoHide // Automatically hides scrollbar when inactive
          autoHideTimeout={1000} // Hides after 1 second of inactivity
          autoHideDuration={300} // Smooth hide duration
          renderThumbVertical={renderThumb} // Custom thumb style
          universal={true} // Ensures consistent behavior across devices
        >
          {favorites.length ? (
            <ul className="favorites-list">
              {favorites.map((item) => (
                <Link
                  to={`/favorites/${item.id}`}
                  key={item.id}
                  className="favorite-link"
                >
                  <FavoriteItemCard
                    image={item.image}
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
