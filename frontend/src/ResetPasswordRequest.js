// ResetPasswordRequest.js
import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from './config';
import './Login.css'

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/password_reset/`, { email });
      setMessage(response.data.message);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Reset Password</h2>
        <p>Enter your email to reset your password</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default ResetPasswordRequest;
