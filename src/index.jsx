// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Or whatever your global CSS file is
import RootApp from './App'; // Import the new RootApp component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootApp /> {/* Render RootApp directly */}
  </React.StrictMode>
);