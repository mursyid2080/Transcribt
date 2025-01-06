import React, { useState } from 'react';
import './EditProfileModal.css';

const KeyboardInputInfo = ({
    showTutorial,
    closeTutorial,
}) => {
    if (!showTutorial) return null;

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <h2>Welcome to the music editor</h2>
            <p>To start writing notes, use your keyboard input.</p>
            <p>For more information, click the help button on the left.</p>
            <button onClick={closeTutorial} style={{backgroundColor: 'red', color: '#fff'}}>Close</button>
        </div>
    </div>
    );
};

export default KeyboardInputInfo;