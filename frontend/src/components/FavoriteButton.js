import React, { useState } from 'react';
import axios from 'axios';

const FavoriteButton = ({ transcriptionId, isFavoritedInitially }) => {
    const [isFavorited, setIsFavorited] = useState(isFavoritedInitially);
    const [loading, setLoading] = useState(false);

    const getCSRFToken = () => {
        console.log(document.cookie);
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
          const [name, value] = cookie.split('=');
          acc[name] = value;
          return acc;
        }, {});
      
        return cookies.csrftoken || null;
      };

    const handleToggleFavorite = async () => {
        setLoading(true);
        const csrfToken = getCSRFToken();

        try {
            const response = await axios.post(
                `http://localhost:8000/transcription/api/toggle-favorite/${transcriptionId}/`,
                {},
                {
                    headers: {
                        // 'Authorization': token,
                        'X-CSRFToken': csrfToken, // Include CSRF token
                    },
                    withCredentials: true,
                }
            );

            if (response.data.status === 'favorited') {
                setIsFavorited(true);
            } else if (response.data.status === 'unfavorited') {
                setIsFavorited(false);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Failed to toggle favorite. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleToggleFavorite} disabled={loading}>
            {loading ? 'Processing...' : isFavorited ? 'Unfavorite' : 'Favorite'}
        </button>
    );
};

export default FavoriteButton;
