import React from "react";
import "./TranscriptionCard.css";

const TranscriptionCard = ({ image, title, likes, saves }) => {
  return (
    <div className="transcription-card">
      {/* Square Image */}
      <div className="card-image">
        <img src={image} alt="Transcription Preview" />
      </div>

      {/* Title and Stats */}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-stats">
          <span className="likes">❤️ {likes} Likes</span>
          <span className="saves">🔖 {saves} Saves</span>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionCard;
