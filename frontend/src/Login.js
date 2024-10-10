import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setLoggedIn, setEmail }) => {
  const [email, setEmailState] = useState('');
  const [password, setPasswordState] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = () => {
    // Reset error states
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    // Validate email
    if (!email) {
      setEmailError('Please enter your email');
      return;
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
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

    // Make the authentication call
    axios.post('http://127.0.0.1:8000/api/auth/login', { email, password })
      .then(response => {
        console.log('Login successful:', response.data);
        
        // Update state in the parent component
        setEmail(email);
        setLoggedIn(true);
        
        // Redirect to home page
        navigate('/');
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setLoginError('Invalid email or password. Please try again.');
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
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmailState(ev.target.value)}
          className="inputBox"
        />
        {emailError && <label className="errorLabel">{emailError}</label>}
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
