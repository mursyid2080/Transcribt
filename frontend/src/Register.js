import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Make sure to import the CSS file
import API_BASE_URL from './config';

const Register = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [password2Error, setPassword2Error] = useState('');
  const [registerError, setRegisterError] = useState('');

  const navigate = useNavigate();

  const onButtonClick = () => {
    // Set initial error values to empty
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setPassword2Error('');
    setRegisterError('');

    // Check if the user has entered both fields correctly
    if (username === '') {
      setUsernameError('Please enter your username');
      return;
    }

    if (email === '') {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (password === '') {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setPasswordError('The password must be 6 characters or longer');
      return;
    }

    if (password2 === '') {
      setPassword2Error('Please enter a password');
      return;
    }

    if (password2.length < 6) {
      setPassword2Error('The password must be 6 characters or longer');
      return;
    }

    if (password2 !== password) {
      setPassword2Error('The password does not match');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('password2', password2);

    axios.post(`${API_BASE_URL}/api/auth/register`, formData)
      .then(response => {
        console.log('Register successful:', response);
        navigate('/login'); // Redirect to login page after successful registration
      })
      .catch(error => {
        console.error('Error registering:', error);
        setRegisterError(error.response?.data?.errors?.[0] || 'Registration failed'); // Update the error state
      });
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="titleContainer">
          <div>Register</div>
        </div>
        <br />
        <div className="inputContainer">
          <input
            value={username}
            placeholder="Enter your username here"
            onChange={(ev) => setUsername(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{usernameError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input
            value={email}
            placeholder="Enter your email here"
            onChange={(ev) => setEmail(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input
            type="password"
            value={password2}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword2(ev.target.value)}
            className="inputBox"
          />
          <label className="errorLabel">{password2Error}</label>
        </div>
        {registerError && <small className="errorLabel">{registerError}</small>}
        <br />
        <div className="inputContainer">
          <input className="inputButton" type="button" onClick={onButtonClick} value="Register" />
        </div>
        <p className="signup-text">
          Have an account? <a href="/login">Login</a>
        </p>
      </div>

      <div className="register-right" style={{backgroundImage: `url('/images/login_batik.jpg')`}}>
        <div style={{ width: "100%", height: "100%", backgroundColor: 'rgba(0,0,0, 0.55)'}}></div>
      </div>
    </div>
  );
};

export default Register;