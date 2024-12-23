import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaEdit, FaMicrophone, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './Header.css';

const Header = ({ handleNavClick, setLoggedIn, setUsername, setSearchInput }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = () => {
    axios.post('http://localhost:8000/api/auth/logout', {}, {
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

  const toggleProfileDropdown = () => setShowProfileDropdown(!showProfileDropdown);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    setSearchInput(searchValue);
    setSearchValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header>
      <Link to="/" onClick={handleNavClick} className="icon-container">
        <FaHome title="Home" />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="search-container">
          <FaSearch title="Search" onClick={handleSearch} style={{ cursor: 'pointer' }} />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Link to="/editor" onClick={handleNavClick} className="icon-container">
          <FaEdit title="Editor" />
        </Link>
        <Link to="/transcribe" onClick={handleNavClick} className="icon-container">
          <FaMicrophone title="Auto-transcribe" />
        </Link>
      </div>
      <div style={{ position: 'relative' }}>
        <div className="icon-container" onClick={toggleProfileDropdown}>
          <FaUser title="Profile" />
        </div>
        {showProfileDropdown && (
          <div className="profile-dropdown">
            <Link to="/profile" onClick={handleNavClick}>Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;