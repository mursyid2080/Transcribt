import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setLoggedIn, setUsername }) => {
  const [username, setUsernameState] = useState('');
  const [password, setPasswordState] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = () => {
    // Reset error states
    setUsernameError('');
    setPasswordError('');
    setLoginError('');
  
    // Validate username
    if (!username) {
      setUsernameError('Please enter your username');
      return;
    }
  
    // Validate password
    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }
    if (password.length < 6) {
      setPasswordError('The password must be 6 characters or longer');
      return;
    }
  
    // Send data as URL-encoded
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
  
    // Make the authentication call
    axios.post('http://localhost:8000/api/auth/login', formData, { withCredentials: true },)
      .then(response => {
        console.log('Login successful:', response);
        localStorage.setItem("access_token", response.data.access_token);
        // Update state in the parent component
        setUsername(username);
        setLoggedIn(true);
        
        // Redirect to home page
        navigate('/');
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setLoginError('Invalid username or password. Please try again.');
      });
    
  };

  return (
    <div className="mainContainer">
      <div className="titleContainer">
        <div>Login</div>
      </div>
      <br />
      <div className="inputContainer">
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsernameState(ev.target.value)}
          className="inputBox"
        />
        {usernameError && <label className="errorLabel">{usernameError}</label>}
      </div>
      <br />
      <div className="inputContainer">
        <input
          type="password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPasswordState(ev.target.value)}
          className="inputBox"
        />
        {passwordError && <label className="errorLabel">{passwordError}</label>}
      </div>
      <br />
      <div className="inputContainer">
        <input
          className="inputButton"
          type="button"
          onClick={onButtonClick}
          value="Log in"
        />
      </div>
      {loginError && <div className="errorLabel">{loginError}</div>}
    </div>
  );
};

export default Login;
