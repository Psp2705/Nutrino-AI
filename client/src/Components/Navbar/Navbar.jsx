import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="nav">
      {/* Logo Section */}
      <div className="nav-logo">NutriAI</div>
      
      {/* Menu Links */}
      <ul className="nav-menu">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">About Us</Link>
        </li>
        <li>
          <Link to="/login" className="nav-link">Login</Link>
        </li>
      </ul>

      {/* Contact Button */}
      {/* <div className='contact-nav-container'>
        <Link to="/contact" className="nav-contact">Contact Us</Link>
      </div> */}
    </nav>
  );
};

export default Navbar;
