import React from "react";
import './RightSection.css';
import Scrollbars from "react-custom-scrollbars";

const RightSection = ({ categories, setSelectedCategory }) => {
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "rgba(255, 255, 255, 0)", 
      borderRadius: "6px",
      width: "8px",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <div className="right">
      <div className="right-section">
        <h2>Categories</h2>
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={300}
          renderThumbVertical={renderThumb}
          universal={true}
        >
          {Object.keys(categories).length > 0 ? (
            <div className="categories-right-grid">
              {Object.keys(categories).map((category) => (
                <div
                  key={category}
                  className="category-card"
                  onClick={() => setSelectedCategory(category)} // Set selected category
                >
                  <h3 className="category-title">{category}</h3>
                  <img
                    src={`/images/${category}.jpg`}
                    alt={category}
                    className="category-image"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No Categories.</p>
          )}
        </Scrollbars>
      </div>
    </div>
  );
};

export default RightSection;


