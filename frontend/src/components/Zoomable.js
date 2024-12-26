import React, { useState, useEffect } from "react";
import "./Zoomable.css"; // Create a CSS file for zoom classes

const Zoomable = ({ children, osmd, scoreData }) => {
  const zoomStates = ["zoom-100", "zoom-75", "zoom-50", "zoom-25"];
  const [zoom, setZoom] = useState(1); // Default value to 0.75 (index 1)

  useEffect(() => {
    const handleResize = () => {
      if (osmd && scoreData) {
        osmd.load(scoreData).then(() => osmd.render());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [osmd, scoreData]);

  useEffect(() => {
    if (osmd && scoreData) {
      osmd.load(scoreData).then(() => osmd.render());
    }
  }, [zoom, osmd, scoreData]);

  return (
    <div className="zoom-container">
      <div className="zoom-controls">
        <button
          onClick={() => {
            if (zoom < zoomStates.length - 1) setZoom(zoom + 1);
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            if (zoom > 0) setZoom(zoom - 1);
          }}
        >
          +
        </button>
      </div>
      <div className={`zoomable ${zoomStates[zoom]}`}>
        {children}
      </div>
    </div>
  );
};

export default Zoomable;