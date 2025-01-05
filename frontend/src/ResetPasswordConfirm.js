import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API_BASE_URL from './config';
import './Login.css';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/password_reset/confirm/${uid}/${token}/`, {
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setError(''); // Clear any previous error
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      setMessage(''); // Clear any previous message
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Reset Password</h2>
        <p>Enter your new password</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input-box"
            />
          </div>
          <button type="submit" className="login-button">Submit</button>
        </form>
        {message && <small className="success-message">{message}</small>}
        {error && <small className="error-message">{error}</small>}
      </div>
      <div className="login-right" style={{backgroundImage: `url('/images/login_batik.jpg')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center"}}>
        <div style={{ width: "100%", height: "100%", backgroundColor: 'rgba(0,0,0, 0.55)'}}/>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;