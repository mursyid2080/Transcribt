// NavBar.js
import { Link } from 'react-router-dom';
import "./NavBar.css"

const NavBar = ({ show, handleLogout, handleNavClick }) => {
  return (
    <div className={show ? "sidenav active" : "sidenav"}>
      <ul>
        <li>
          <Link to="/" onClick={handleNavClick}>Home</Link>
        </li>
        <li>
          <Link to="/transcribe" onClick={handleNavClick}>Auto-transcribe</Link>
        </li>
        <li>
          <Link to="/editor" onClick={handleNavClick}>Editor</Link>
        </li>
        {/* Logout button */}
        <li className="logout-button">
          <button onClick={() => { handleLogout(); handleNavClick(); }}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
