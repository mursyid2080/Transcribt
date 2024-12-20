// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home2';
import Login from './Login';
import Register from './Register';
import Transcribe from './TranscribeModule/Transcribe';
import Dashboard from './Dashboard';
import ProfilePage from './ProfilePage';
import SmoosicApp from './TranscribeModule/SmoosicApp';
import Smoosical from './TranscribeModule/Smoosical';
import NavBar from './components/NavBar';
import { GiHamburgerMenu } from 'react-icons/gi';
import './App.css';
import TranscriptionPage from "./components/TranscriptionPage"; // Component to display the transcription details
import axios from 'axios';


function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });
  const [username, setUsername] = useState('');
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  // Logout function to reset login state
  const handleLogout = () => {
    // Send logout request to backend
    axios.post('http://localhost:8000/api/auth/logout', {}, {
      withCredentials: true,
    })
    .then(response => {
      console.log('Logout successful:', response.data);
      
      // Clear local storage and update state
      setLoggedIn(false);
      setUsername('');
      localStorage.removeItem('access_token');  // Remove the token after logout
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
  };
  

  // Function to close NavBar when any link is clicked
  const handleNavClick = () => setShowNav(false);

  return (
    <Router>
      {loggedIn ? (
        <>
          <header className='header'>
            <GiHamburgerMenu onClick={() => setShowNav(!showNav)} />
          </header>
          <NavBar show={showNav} handleLogout={handleLogout} handleNavClick={handleNavClick} />
          <div className="main">
            <Routes>
              <Route path="/*" element={<Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
              <Route path="/transcribe" element={<Transcribe />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/editor" element={<SmoosicApp />} />

              <Route path="/transcription/:id" element={<TranscriptionPage />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
          <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
