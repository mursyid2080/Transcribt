import React, { useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';
import API_BASE_URL from '../config';

const PublishButton = ({ transcriptionId, initialIsPublished }) => {
    const [isPublished, setIsPublished] = useState(initialIsPublished);
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

    const handleTogglePublish = async () => {
        setLoading(true);
        const csrfToken = getCSRFToken();
        try {
            const response = await axios.post(
                `${API_BASE_URL}/transcription/api/transcription/toggle-publish/${transcriptionId}/`,
                {},
                {
                    headers: {
                        'X-CSRFToken': csrfToken, // Include CSRF token
                    },
                    withCredentials: true,
                }
            );

            if (response.data.is_published !== undefined) {
                setIsPublished(response.data.is_published);
            }
        } catch (error) {
            console.error('Error toggling publish:', error);
            alert('Failed to toggle publish. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button style={{width:"100px"}}onClick={handleTogglePublish} disabled={loading}>
            {loading ? 'Loading...' : isPublished ? 'Unpublish' : 'Publish'}
        </button>
    );
};

export default PublishButton;