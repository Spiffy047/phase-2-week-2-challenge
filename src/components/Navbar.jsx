// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Smart Goal Planner</div>
      <ul className="navbar-nav">
        <li><a href="#home">Home</a></li>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#goals">Goals</a></li>
        {/* You can add more links here later */}
      </ul>
    </nav>
  );
};

export default Navbar;