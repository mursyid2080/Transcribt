import React from "react";

const MiddleSection = ({ trending }) => {
  return (
    <div className="middle-section">
      <h2>Trending Songs</h2>
      {trending.length ? (
        <ul>
          {trending.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>No trending songs.</p>
      )}
    </div>
  );
};

export default MiddleSection;
