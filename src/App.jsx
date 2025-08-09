import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { supabase } from './components/supabaseClient';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Initial check on load
    const initialCheck = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    initialCheck();

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchGoals = async () => {
    if (!user) return [];
    const { data: goals, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    return goals;
  };

  const addGoal = async (newGoal) => {
    if (!user) return;
    const { error } = await supabase
      .from('goals')
      .insert({ ...newGoal, user_id: user.id });

    if (error) {
      console.error('Error adding goal:', error);
    }
  };

  const updateGoal = async (id, updatedGoal) => {
    if (!user) return;
    const { error } = await supabase
      .from('goals')
      .update(updatedGoal)
      .eq('id', id);

    if (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (id) => {
    if (!user) return;
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const handleRegister = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar onLogout={handleLogout} />}
        <main>
          <Routes>
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage onLogin={handleLogin} onRegister={handleRegister} />} />
            <Route path="/dashboard" element={user ? <Dashboard fetchGoals={fetchGoals} addGoal={addGoal} updateGoal={updateGoal} deleteGoal={deleteGoal} /> : <Navigate to="/auth" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;