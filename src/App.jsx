import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// The import paths are relative to the current file's location.
// Assuming both these files are now in the 'src/components' directory
import { supabase } from './components/supabaseClient';
import { AuthProvider, useAuth } from './components/AuthContext';

import './App.css';

// The MainApp component is wrapped by AuthProvider in App
const MainApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow p-4 sm:p-8">
        <Routes>
          {/* If the user is logged in, redirect from the auth page to the dashboard */}
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
          {/* If the user is not logged in, redirect from the dashboard to the auth page */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          {/* Default route redirects to the dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// The root App component that wraps the MainApp with the AuthProvider and Router
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
};

export default App;
