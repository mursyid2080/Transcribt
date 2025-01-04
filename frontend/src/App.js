import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home2';
import Login from './Login';
import Register from './Register';
import Transcribe from './TranscribeModule/Transcribe';
import Dashboard from './Dashboard';
import ProfilePage from './pages/ProfilePage';
import SmoosicApp from './TranscribeModule/SmoosicApp';
import Smoosical from './TranscribeModule/Smoosical';
import NavBar from './components/NavBar';
import { GiHamburgerMenu } from 'react-icons/gi';
import './App.css';
import TranscriptionPage from "./components/TranscriptionPage"; // Component to display the transcription details
import axios from 'axios';
import Header from './components/Header';
import ResetPasswordRequest from './ResetPasswordRequest';
import ResetPasswordConfirm from './ResetPasswordConfirm';
import API_BASE_URL from './config';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });
  const [username, setUsername] = useState('');
  const [showNav, setShowNav] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment key to force refresh
    navigate(path);
  };

  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  const handleLogout = () => {
    axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
      withCredentials: true,
    })
    .then(response => {
      console.log('Logout successful:', response.data);
      setLoggedIn(false);
      setUsername('');
      localStorage.removeItem('access_token');
    })
    .catch(error => {
      console.error('Error logging out:', error);
    });
  };


  const handleNavClick = () => setShowNav(false);

  return (
    <>
      {loggedIn ? (
        <>
          <Header handleNavClick={handleNavClick} handleNavigate={handleNavigate} setLoggedIn={setLoggedIn} setUsername={setUsername} setSearchInput={setSearchInput} />
          <NavBar show={showNav} handleLogout={handleLogout} handleNavClick={handleNavClick} />
          <div className="main">
            <Routes key={refreshKey}>
              <Route path="/*" element={<Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} searchInput={searchInput} setSearchInput={setSearchInput}/>} />
              <Route path="/transcribe" element={<Transcribe />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/editor" element={<SmoosicApp />} />
              <Route path="/editor/:id" element={<SmoosicApp />} />
              <Route path="/transcription/:id" element={<TranscriptionPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
          <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
          <Route path="/reset-password" element={<ResetPasswordRequest/>} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm/>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}


export default App;