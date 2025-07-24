// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import Footer from './components/Footer';
import './App.css';

//Render backend API URL **
const API_BASE_URL = 'https://smart-goal-planner-xzdh.onrender.com';

function App() {
  const [goals, setGoals] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const goalsPerPage = 4; 

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
     
    }
  };

  const handleAddGoal = async (newGoal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newGoal, createdAt: new Date().toISOString() }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      fetchGoals();
      setIsFormOpen(false);
      navigate('/goals');
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleUpdateGoal = async (id, updatedGoal) => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGoal),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      fetchGoals();
      setIsFormOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchGoals();
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleDeposit = async (id, amount) => {
    const goalToUpdate = goals.find(g => g.id === id);
    if (!goalToUpdate) return;

    const newSavedAmount = Number(goalToUpdate.savedAmount) + amount;
    if (newSavedAmount > goalToUpdate.targetAmount) {
      alert("Deposit exceeds target amount. Please deposit exact remaining or less.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ savedAmount: newSavedAmount }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchGoals();
    } catch (error) {
      console.error("Error making deposit:", error);
    }
  };

  const openEditForm = (id) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      setEditingGoal(goal);
      setIsFormOpen(true);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  // Pagination Logic
  const indexOfLastGoal = currentPage * goalsPerPage;
  const indexOfFirstGoal = indexOfLastGoal - goalsPerPage;
  const currentGoals = goals.slice(indexOfFirstGoal, indexOfLastGoal);

  const totalPages = Math.ceil(goals.length / goalsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const PageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={currentPage === i ? 'btn-page active' : 'btn-page'}
        >
          {i}
        </button>
      );
    }
    return <div className="pagination">{pageNumbers}</div>;
  };

  return (
    <div className="App">
      <Navbar onAddGoalClick={() => { setEditingGoal(null); setIsFormOpen(true); }} />

      {isFormOpen && (
        <div className="form-overlay">
          <GoalForm
            onSubmit={editingGoal ? (data) => handleUpdateGoal(editingGoal.id, data) : handleAddGoal}
            initialData={editingGoal || {}}
            onCancel={closeForm}
          />
        </div>
      )}

      <div className="main-content">
        <Routes>
          <Route path="/" element={
            <div className="app-section home-section">
              <h2>Welcome to Smart Goal Planner!</h2>
              <p>Your personal assistant to track and achieve your financial goals. Get started by adding your first goal or view your dashboard.</p>
              <Link to="/goals" className="btn-primary">View My Goals</Link>
            </div>
          } />
          <Route path="/dashboard" element={
            <div className="app-section dashboard-container">
              <Dashboard goals={goals} />
            </div>
          } />
          <Route path="/goals" element={
            <div className="app-section goals-section">
              <h2>Your Financial Goals</h2>
              <button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }} className="add-goal-btn">Add New Goal</button>

              {goals.length === 0 ? (
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
          } />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default function RootApp() {
    return (
        <Router> {}
            <App />
        </Router>
    );
}