import React, { useEffect, useState } from "react";
import './ProfilePage.css';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import EditProfileModal from '../components/EditProfileModal';
import TranscriptionCard from '../components/TranscriptionCard';
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; 

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const navigate = useNavigate();

  const handleNavigate = (transcription) => {
    navigate('/editor', { 
      state: { 
        id: transcription.id,
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transcriptionsResponse = await axios.get("http://localhost:8000/transcription/api/user/transcriptions/", {
          withCredentials: true
        });
        const transcriptionsData = transcriptionsResponse.data;
        const totalFavorites = transcriptionsData.reduce((acc, transcription) => acc + (transcription.saves || 0), 0);

        console.log(transcriptionsData); 
  
        const userProfileResponse = await axios.get("http://localhost:8000/api/auth/user/profile/", {
          withCredentials: true
        });
        const userProfileData = userProfileResponse.data;
        console.log(userProfileData);
  
        setTotalFavorites(totalFavorites);
        setUser(userProfileData);
        setTranscriptions(transcriptionsData);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
  
    fetchData();
  }, []);

  const getCSRFToken = () => {
    console.log(document.cookie);
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [name, value] = cookie.split('=');
      acc[name] = value;
      return acc;
    }, {});
  
    return cookies.csrftoken || null;
  };

  const handleUpdateProfile = async (formData) => {
    // formData.append('email', email);
    // formData.append('bio', bio);
    // if (profilePicture) {
    //   const imageBlob = new Blob([new Uint8Array(atob(profilePicture).split("").map(c => c.charCodeAt(0)))], { type: 'image/png' });
    //   const imageFileName = `image_${uuidv4()}.png`; // Generate a unique name for the image file using UUID
    //   const imageFileObject = new File([imageBlob], imageFileName, { type: imageBlob.type });
    //   formData.append('profile_picture', imageFileObject);
    // }

    try {
      console.log("Updating profile...");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const csrfToken = getCSRFToken();
      const response = await axios.post("http://localhost:8000/api/auth/user/profile/update/", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        }
      });
      const updatedUser = response.data;
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-left-section" >
        <div style={{backgroundImage: `url('/images/profile_batik.jpg')`, filter: 'brightness(0.2)'}} className="profile-background">
        </div>
        <div className='user-info'>
          <div className="profile-picture-container">
            <img src={user.profile.profile_picture} alt="Profile" className="profile-picture" />
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit />
            </button>
          </div>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p>{user.profile.bio}</p>
          <p>Total Favorites: {totalFavorites}</p>
        </div>
      </div>
      <div className="profile-right-section">
        <div className="top-section">
          <h3>Saved Projects</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>

            {transcriptions.filter(transcription => !transcription.is_published).map(transcription => (
              <div 
                key={transcription.id}
                onClick={() => handleNavigate(transcription)}
                style={{ cursor: 'pointer' }}
              >
                <TranscriptionCard
                  image={transcription.image_file}
                  title={transcription.title}
                  likes={transcription.favorites}
                  saves={transcription.saves || 0}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="bottom-section">
          <h3>Published Projects</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>

            {transcriptions.filter(transcription => transcription.is_published).map(transcription => (
              <Link to={`/editor/${transcription.id}`} key={transcription.id}>
                <TranscriptionCard
                  image={transcription.image_file}
                  title={transcription.title}
                  likes={transcription.favorites}
                  saves={transcription.saves || 0}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSubmit={handleUpdateProfile}
        initialEmail={user.email}
        initialBio={user.profile.bio}
        initialProfilePicture={user.profile.profile_picture}
      />
    </div>
  );
};

export default ProfilePage;