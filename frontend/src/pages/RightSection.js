import React from "react";
import './RightSection.css';
import Scrollbars from "react-custom-scrollbars";

const RightSection = ({ categories }) => {

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "rgba(255, 255, 255, 0)", // Semi-transparent white
      borderRadius: "6px", // Rounded corners
      width: "8px", // Thin scrollbar
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  return (
    <div className="right">
      <div className="right-section">
        <h2>Categories</h2>
        <Scrollbars
          autoHide // Automatically hides scrollbar when inactive
          autoHideTimeout={1000} // Hides after 1 second of inactivity
          autoHideDuration={300} // Smooth hide duration
          renderThumbVertical={renderThumb} // Custom thumb style
          universal={true} // Ensures consistent behavior across devices
          >
          {Object.keys(categories).length > 0 ? (
            <div className="categories-right-grid">
              {Object.keys(categories).map((category) => (
                <div key={category} className="category-card">
                  <h3 className="category-title">{category}</h3>
                  <img
                    src={`/images/${category}.jpg`} // Adjust path dynamically
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
