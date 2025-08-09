// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Import local components from the 'components' directory
import AuthPage from './components/AuthPage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import Footer from './components/Footer';

// IMPORTANT: Ensure your CSS is imported
import './App.css';

// ** Supabase Client Initialization **
const SUPABASE_URL = "https://kerwkbonotdgfvxwyymk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlcndrYm9udGRnZnZ4d3lpeW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTE2MzIsImV4cCI6MjA3MDMyNzYzMn0.JgxdknaoVtH9QEMqeX5aKeIjM4UGeDUJgpxPdVSdj2k";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ** This is your correct Render backend API URL **
const API_BASE_URL = 'https://smart-goal-planner-xzdh.onrender.com';

// ** Utility functions for converting between naming conventions **
const toSnakeCase = obj => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeCaseKey] = obj[key];
    return acc;
  }, {});
};

const toCamelCase = obj => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const camelCaseKey = key.replace(/(_\w)/g, match => match[1].toUpperCase());
    acc[camelCaseKey] = obj[key];
    return acc;
  }, {});
};

// Main App component
const App = () => {
  const [session, setSession] = useState(null);
  const [goals, setGoals] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const goalsPerPage = 4;
  const navigate = useNavigate();

  // Function to fetch goals from the backend
  const fetchGoals = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Convert all received goal objects to camelCase
      const camelCaseData = data.map(toCamelCase);
      setGoals(camelCaseData);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  }, []);

  // Effect to listen for Supabase auth state changes and fetch goals
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_OUT') {
        setSession(null);
        setGoals([]);
      } else {
        setSession(session);
        if (session) {
          fetchGoals(session.access_token);
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchGoals(session.access_token);
      }
    }).catch(error => {
      console.error("Error getting session:", error);
      setSession(null);
    });

    return () => authListener.subscription.unsubscribe();
  }, [fetchGoals]);

  // Handler for adding a new goal
  const handleAddGoal = async (newGoal) => {
    try {
      const token = session.access_token;
      // Convert new goal object to snake_case before sending
      const goalToSend = toSnakeCase(newGoal);
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goalToSend),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdGoal = await response.json();
      // Convert received goal back to camelCase
      setGoals((prevGoals) => [...prevGoals, toCamelCase(createdGoal)]);
      setIsFormOpen(false);
      navigate('/goals');
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  // Handler for updating an existing goal
  const handleUpdateGoal = async (updatedGoal) => {
    try {
      const token = session.access_token;
      // Convert updated goal to snake_case before sending
      const goalToSend = toSnakeCase(updatedGoal);
      const response = await fetch(`${API_BASE_URL}/goals/${updatedGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goalToSend),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Convert received data back to camelCase
      const camelCaseData = toCamelCase(data);
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === camelCaseData.id ? camelCaseData : goal))
      );
      setIsFormOpen(false);
      setEditingGoal(null);
      navigate('/goals');
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // Handler for deleting a goal
  const handleDeleteGoal = async (id, name) => {
    console.log(`User confirmed deletion of goal: "${name}"`);
    try {
      const token = session.access_token;
      const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
      if (goals.length - 1 <= goalsPerPage * (currentPage - 1) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      console.log("Goal deleted successfully.");
    } catch (error) {
      console.error("Error deleting goal:", error);
      console.error("Failed to delete goal.");
    }
  };

  // Handler for making a deposit to a goal
  const handleDeposit = async (id, amount) => {
    try {
      const token = session.access_token;
      const goalToUpdate = goals.find(g => g.id === id);
      const newSavedAmount = Math.min(Number(goalToUpdate.savedAmount) + amount, Number(goalToUpdate.targetAmount));
  
      const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // The key 'saved_amount' is in snake_case to match the database
        body: JSON.stringify({ saved_amount: newSavedAmount }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedGoal = await response.json();
      // Convert received goal back to camelCase before updating state
      const camelCaseGoal = toCamelCase(updatedGoal);
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === camelCaseGoal.id ? camelCaseGoal : goal))
      );
    } catch (error) {
      console.error("Error depositing to goal:", error);
      console.error("Failed to make deposit.");
    }
  };

  // Function to open the goal edit form
  const openEditForm = (goalId) => {
    const goalToEdit = goals.find((goal) => goal.id === goalId);
    setEditingGoal(goalToEdit);
    setIsFormOpen(true);
  };

  // Pagination logic
  const totalPages = Math.ceil(goals.length / goalsPerPage);
  const indexOfLastGoal = currentPage * goalsPerPage;
  const indexOfFirstGoal = indexOfLastGoal - goalsPerPage;
  const currentGoals = goals.slice(indexOfFirstGoal, indexOfLastGoal);

  const PageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => setCurrentPage(number)}>{number}</button>
          </li>
        ))}
      </ul>
    );
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout failed. Please try again.");
    } else {
      setGoals([]);
      setSession(null);
      navigate('/login');
    }
  };

  return (
    <div className="App">
      {session && <Navbar onLogout={handleLogout} onAddGoalClick={() => { setEditingGoal(null); setIsFormOpen(true); navigate('/goals'); }} />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/" /> : <AuthPage supabase={supabase} />} />
          <Route path="/" element={
            session ? (
              <div className="app-section home-section">
                <h2 className="text-3xl font-bold">Welcome!</h2>
                <p>Start planning your financial future today.</p>
                <Link to="/goals" className="btn-primary mt-4">View Your Goals</Link>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/dashboard" element={
            session ? (
              <div className="app-section dashboard-container">
                <Dashboard goals={goals} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/goals" element={
            session ? (
              <div className="app-section goals-section">
                <h2>Your Financial Goals</h2>
                <button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }} className="add-goal-btn">Add New Goal</button>

                {isFormOpen && (
                  <GoalForm
                    onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
                    initialData={editingGoal || {}}
                    onCancel={() => setIsFormOpen(false)}
                  />
                )}
                {goals.length === 0 && !isFormOpen ? (
                  <p className="no-goals-message">No goals set yet. Start by adding a new goal!</p>
                ) : (
                  <>
                    <div className="goal-list-container">
                      {currentGoals.map(goal => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          onUpdate={openEditForm}
                          onDelete={handleDeleteGoal}
                          onDeposit={handleDeposit}
                        />
                      ))}
                    </div>
                    {totalPages > 1 && <PageNumbers />}
                  </>
                )}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

// This is the new RootApp component which wraps the main App in the Router.
// This is the file you would export in your main entry point file, e.g., index.js or main.jsx.
export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
