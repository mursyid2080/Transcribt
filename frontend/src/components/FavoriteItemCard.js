import React from "react";
import "./FavoriteItemCard.css";

const FavoriteItemCard = ({ image, title, type, author }) => {
  return (
    <div className="favorite-item-card">
      <img src={image} alt={title} className="favorite-item-image" />
      <div className="favorite-item-details">
        <p className="favorite-item-title">{title}</p>
        <p className="favorite-item-meta">
          {type} • {author}
        </p>
      </div>
    </div>
  );
};

export default FavoriteItemCard;
