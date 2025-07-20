
import React from 'react';
import { Link } from 'react-router-dom'; 

const Navbar = ({ onAddGoalClick }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Smart Goal Planner</Link> 
      <ul className="navbar-nav"> 
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
        <li><Link to="/goals" className="nav-link">Goals</Link></li>
      </ul>
      <button onClick={onAddGoalClick} className="btn-primary">
        Add New Goal
      </button>
    </nav>
  );
};

export default Navbar;