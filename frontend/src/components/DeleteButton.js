import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getCSRFToken = () => {
    console.log(document.cookie);
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});
  
    return cookies.csrftoken || null;
};

const DeleteButton = ({ transcriptionId, onDelete }) => {
    const navigate = useNavigate();
  

    const handleDelete = async () => {
        const csrfToken = getCSRFToken();
        try {
        const response = await axios.delete(
            `http://localhost:8000/transcription/api/transcriptions/delete/${transcriptionId}/`,
            {
            headers: {
                'X-CSRFToken': csrfToken, // Include CSRF token
            },
            withCredentials: true,
            }
        );
        console.log('Delete successful:', response);
        // onDelete(transcriptionId); // Call the onDelete callback to update the parent component
        navigate('/profile'); // Redirect to the profile page
        } catch (error) {
        console.error('Error deleting transcription:', error);
        }
    };

  return (
    <button
      style={{
        width: '100px',
        padding: '10px 20px',
        cursor: 'pointer',
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
      }}
      onClick={handleDelete}
    >
      Delete
    </button>
  );
};

export default DeleteButton;