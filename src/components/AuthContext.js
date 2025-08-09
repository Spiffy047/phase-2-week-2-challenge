import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Corrected import path

// Create a context for authentication
const AuthContext = createContext();

// Create a provider component that will be used to wrap the application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener will update the user state whenever the authentication state changes (e.g., login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Perform an initial check to get the user's session on component mount
    const initialCheck = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    initialCheck();

    // Clean up the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Provide the user and loading state to the children components
  const value = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only after the initial loading check is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
