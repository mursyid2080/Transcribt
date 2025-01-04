import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // For styling
import API_BASE_URL from './config';


const Login = ({ setLoggedIn, setUsername }) => {
  const [username, setUsernameState] = useState('');
  const [password, setPasswordState] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = () => {
    setUsernameError('');
    setPasswordError('');
    setLoginError('');

    if (!username) {
      setUsernameError('Please enter your email address');
      return;
    }

    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }
    if (password.length < 6) {
      setPasswordError('The password must be 6 characters or longer');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    axios
      .post(`${API_BASE_URL}/api/auth/login`, formData, { withCredentials: true })
      .then((response) => {
        localStorage.setItem('access_token', response.data.access_token);
        setUsername(username);
        setLoggedIn(true);
        navigate('/');
      })
      .catch((error) => {
        setLoginError('Invalid username or password. Please try again.');
      });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Welcome back!</h2>
        <p>Enter your credentials to access your account</p>
        <div className="form-group">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(ev) => setUsernameState(ev.target.value)}
            className="input-box"
          />
          {usernameError && <small className="error-text">{usernameError}</small>}
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(ev) => setPasswordState(ev.target.value)}
            className="input-box"
          />
          {passwordError && <small className="error-text">{passwordError}</small>}
        </div>
        <button onClick={onButtonClick} className="login-button">
          Log in
        </button>
        {loginError && <small className="error-text">{loginError}</small>}
        <div className="signup-text" style={{display: 'flex', justifyContent: 'space-between'}}>
          <p >
            Don’t have an account? <a href="/register">Sign up</a> 
          </p>
          <a href="/reset-password" className="reset-link">Reset Password</a>
        </div>
      </div>
      <div className="login-right" style={{backgroundImage: `url('/images/login_batik.jpg')`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center"}}>
        <div style={{ width: "100%", height: "100%", backgroundColor: 'rgba(0,0,0, 0.55)'}}/>
      </div>
    </div>
  );
};

export default Login;
