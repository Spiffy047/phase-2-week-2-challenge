import React from 'react';

const Navbar = ({ onAddGoalClick, onViewDashboardClick }) => {
  return (
    <nav className="navbar">
      <div onClick={onViewDashboardClick} className="navbar-brand">Smart Goal Planner</div>
      <ul className="navbar-nav"> 
        <li><button onClick={onViewDashboardClick} className="nav-link">Home</button></li>
        <li><button onClick={onViewDashboardClick} className="nav-link">Dashboard</button></li>
        <li><button onClick={onViewDashboardClick} className="nav-link">Goals</button></li>
      </ul>
      <button onClick={onAddGoalClick} className="btn-primary">
        Add New Goal
      </button>
    </nav>
  );
};

export default Navbar;
