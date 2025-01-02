import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaEdit, FaMicrophone, FaUser } from 'react-icons/fa';
import axios from 'axios';
import './Header.css';
import API_BASE_URL from '../config';

const Header = ({ handleNavClick, handleNavigate, setLoggedIn, setUsername, setSearchInput }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleLogout = () => {
    axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
      withCredentials: true,
    })
    .then(response => {
      console.log('Logout successful:', response.data);
      setLoggedIn(false);
      setUsername('');
      setShowProfileDropdown(false);
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
      <Link to="/" onClick={handleNavClick} className="icon-container" onMouseEnter={() => setHoveredIcon('home')} onMouseLeave={() => setHoveredIcon(null)}>
        <FaHome title="Home" style={{marginRight: "5px"}}/>
        {hoveredIcon === 'home' && <span className="icon-title">Home</span>}
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="search-container">
          <FaSearch title="Search" onClick={handleSearch} style={{ cursor: 'pointer'}} />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="icon-container" onClick={() => handleNavigate('/editor')} onMouseEnter={() => setHoveredIcon('editor')} onMouseLeave={() => setHoveredIcon(null)}>
          <FaEdit title="Editor" style={{marginRight: "5px"}}/>
          {hoveredIcon === 'editor' && <span className="icon-title">Editor</span>}
        </div>
        <Link to="/transcribe" onClick={handleNavClick} className="icon-container" onMouseEnter={() => setHoveredIcon('transcribe')} onMouseLeave={() => setHoveredIcon(null)}>
          <FaMicrophone title="Generate" style={{marginRight: "5px"}}/>
          {hoveredIcon === 'transcribe' && <span className="icon-title">Generate</span>}
        </Link>
        {/* <div className="icon-container" onClick={() => handleNavigate('/transcribe')} onMouseEnter={() => setHoveredIcon('transcribe')} onMouseLeave={() => setHoveredIcon(null)}>
          <FaMicrophone title="Generate Notation" style={{marginRight: "5px"}}/>
          {hoveredIcon === 'transcribe' && <span className="icon-title">Generate</span>}
        </div> */}
      </div>
      <div style={{ position: 'relative' }}>
        <div className="icon-container" onClick={toggleProfileDropdown} onMouseEnter={() => setHoveredIcon('profile')} onMouseLeave={() => setHoveredIcon(null)}>
          <FaUser title="Profile" style={{marginRight: "5px"}}/>
          {hoveredIcon === 'profile' && <span className="icon-title">Profile</span>}
        </div>
        {showProfileDropdown && (
          <div className="profile-dropdown">
            <Link to="/profile" onClick={() => { handleNavClick(); setShowProfileDropdown(false); }}>Profile</Link>
            {/* <button onClick={handleNavClick}>Profile</button> */}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;