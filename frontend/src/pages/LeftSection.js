import React from "react";

const LeftSection = ({ favorites }) => {
  return (
    <div className="left-section">
      <h2>Favorites</h2>
      {favorites.length ? (
        <ul>
          {favorites.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>No favorites yet.</p>
      )}
    </div>
  );
};

export default LeftSection;
