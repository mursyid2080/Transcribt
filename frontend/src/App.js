// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './Login';
import Register from './Register';
import Transcribe from './TranscribeModule/Transcribe';
import Dashboard from './Dashboard';
import ProfilePage from './ProfilePage';
import SmoosicApp from './TranscribeModule/SmoosicApp';
import NavBar from './components/NavBar';
import { GiHamburgerMenu } from 'react-icons/gi';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });
  const [email, setEmail] = useState('');
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  // Logout function to reset login state
  const handleLogout = () => {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('loggedIn');
  };

  // Function to close NavBar when any link is clicked
  const handleNavClick = () => setShowNav(false);

  return (
    <Router>
      {loggedIn ? (
        <>
          <header>
            <GiHamburgerMenu onClick={() => setShowNav(!showNav)} />
          </header>
          <NavBar show={showNav} handleLogout={handleLogout} handleNavClick={handleNavClick} />
          <div className="main">
            <Routes>
              <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
              <Route path="/transcribe" element={<Transcribe />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/editor" element={<SmoosicApp />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
