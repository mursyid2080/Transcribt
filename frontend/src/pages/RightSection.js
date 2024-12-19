import React from "react";

const RightSection = ({ categories }) => {
  return (
    <div className="right-section">
      <h2>Categories</h2>
      {categories.length ? (
        <ul>
          {categories.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>No Categories.</p>
      )}
    </div>
  );
};

export default RightSection;
