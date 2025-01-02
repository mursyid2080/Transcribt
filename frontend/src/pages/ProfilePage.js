import React, { useEffect, useState } from "react";
import './ProfilePage.css';
import axios from 'axios';
import { LiaUserEditSolid } from "react-icons/lia";
import EditProfileModal from '../components/EditProfileModal';
import TranscriptionCard from '../components/TranscriptionCard';
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; 
import Scrollbars from "react-custom-scrollbars";
import API_BASE_URL from "../config";

const ProfilePage = () => {

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: "rgba(236, 236, 236, 0.64)", // Semi-transparent white
      borderRadius: "6px", // Rounded corners
      width: "8px", // Thin scrollbar
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };
  
  const [user, setUser] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const navigate = useNavigate();
  const [hasReloaded, setHasReloaded] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('hasReloaded')) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.replace(window.location.href); // Perform a deep refresh
    }
  }, []);

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
        // window.location.reload();
        const transcriptionsResponse = await axios.get(`${API_BASE_URL}/transcription/api/user/transcriptions/`, {
          withCredentials: true
        });
        const transcriptionsData = transcriptionsResponse.data;
        const totalFavorites = transcriptionsData.reduce((acc, transcription) => acc + (transcription.saves || 0), 0);

        console.log(transcriptionsData); 
  
        const userProfileResponse = await axios.get(`${API_BASE_URL}/api/auth/user/profile/`, {
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
      const response = await axios.post(`${API_BASE_URL}/api/auth/user/profile/update/`, formData, {
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
        <div style={{backgroundImage: `url('/images/login_batik.jpg')`, filter: 'brightness(0.2)'}} className="profile-background">
        </div>
        <div className='user-info'>
          <div style={{ backgroundColor: '#181818', color: '#fff', padding: '20px', borderRadius: '8px' }}>
            <button className="edit-button" onClick={() => setIsEditing(true)} style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              fontSize: '24px' 
            }}>
              <LiaUserEditSolid />
            </button>
            <div className="profile-picture-container">
              <img 
                src={user.profile.profile_picture ? user.profile.profile_picture : `url('/images/profile.jpg')`} 
                alt="Profile" 
                className="profile-picture" 
              />
            </div>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <p>Total Favorites: {totalFavorites}</p>
            <p>{user.profile.bio}</p>
          </div>
        </div>
      </div>
      <div className="profile-right-section">
        <div className="top-section">
          <h3>Saved Projects</h3>
          <Scrollbars
            autoHide
            renderThumbHorizontal={renderThumb}
            >
            <div style={{ display: 'flex', flexDirection: "row", alignItems: "center", height: "100%"}}>

              {transcriptions.filter(transcription => !transcription.is_published).map(transcription => (
                <div 
                  key={transcription.id}
                  onClick={() => handleNavigate(transcription)}
                  style={{ cursor: 'pointer' , display: "flex", alignItems: "center"}}
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
          </Scrollbars>
        </div>
        <div className="bottom-section">
          <h3>Published Projects</h3>
          <Scrollbars
            autoHide
            renderThumbHorizontal={renderThumb}
            >

            <div style={{ display: 'flex', flexDirection: "row", alignItems: "center", height: "100%"}}>

            {transcriptions.filter(transcription => transcription.is_published).map(transcription => (
                <div 
                  key={transcription.id}
                  onClick={() => handleNavigate(transcription)}
                  style={{ cursor: 'pointer' , display: "flex", alignItems: "center"}}
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
          </Scrollbars>
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