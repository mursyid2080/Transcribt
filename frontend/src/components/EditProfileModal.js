import React, { useState } from 'react';
import './EditProfileModal.css';
import { v4 as uuidv4 } from 'uuid';

const EditProfileModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialEmail,
  initialBio,
  initialProfilePicture
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [bio, setBio] = useState(initialBio);
  const [profilePicture, setProfilePicture] = useState(initialProfilePicture);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('bio', bio);
    if (profilePicture) {
      const newFileName = `${uuidv4()}_${profilePicture.name}`;
      const renamedFile = new File([profilePicture], newFileName, { type: profilePicture.type });
      formData.append('profile_picture', renamedFile);
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </label>
          <label>
            Bio:
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
            />
          </label>
          <label>
            Profile Picture:
            <input 
              type="file" 
              onChange={(e) => setProfilePicture(e.target.files[0])} 
            />
          </label>
          <button type="submit">Update Profile</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;