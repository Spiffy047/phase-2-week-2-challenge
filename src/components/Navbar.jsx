import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Smart Goal Planner</div>
      {user && (
        <button onClick={onLogout} className="btn-primary">
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
