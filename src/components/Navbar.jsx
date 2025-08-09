import React from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-indigo-600">Smart Goals</div>
      {user && (
        <button
          onClick={handleLogout}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;