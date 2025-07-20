// src/App.jsx
import React, { useState } from "react";
import GoalCard from "./components/GoalCard";
import GoalForm from "./components/GoalForm";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import useGoals from "./hooks/useGoals";
import "./App.css";

function App() {
  const { goals, loading, error, createGoal, editGoal, removeGoal, makeDeposit } = useGoals();
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddGoalClick = () => {
    setEditingGoal(null);
    setShowAddGoalForm(true);
  };

  const handleEditGoal = (goalId) => {
    const goalToEdit = goals.find(goal => goal.id === goalId);
    if (goalToEdit) {
      setEditingGoal(goalToEdit);
      setShowAddGoalForm(true);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingGoal) {
        await editGoal(editingGoal.id, formData);
        setEditingGoal(null);
      } else {
        await createGoal(formData);
      }
      setShowAddGoalForm(false);
    } catch (err) {
      console.error("Error during goal form submission:", err);
      alert("Failed to save goal. Please try again.");
    }
  };

  const handleFormCancel = () => {
    setShowAddGoalForm(false);
    setEditingGoal(null);
  };

  if (loading) return <div className="loading-message">Loading goals...</div>;
  if (error) return <div className="error-message">Error: {error.message || "Failed to load goals"}</div>;

  return (
    <div className="App">
      <Navbar />

      <main className="app-main-content"> {/* Changed from app-main to app-main-content for clarity */}
        {/* --- Home Section --- */}
        <section id="home" className="home-section app-section">
          <div className="home-content">
            <h2>Welcome to Your Smart Goal Planner!</h2>
            <p>
              Take control of your financial future. Our Smart Goal Planner helps you set, track, and achieve your savings goals with ease. Whether it's a dream vacation, a new home, or an emergency fund, we've got you covered.
            </p>
            <p>
              Navigate to the Dashboard for an overall summary of your progress, or jump straight to Goals to manage your individual savings targets.
            </p>
            <button className="btn-primary" onClick={() => window.location.href = '#goals'}>Get Started with Goals</button>
          </div>
        </section>

        {/* --- Dashboard Section --- */}
        <section id="dashboard" className="dashboard-section app-section">
          <Dashboard goals={goals} />
        </section>

        {/* --- Goals Management Section --- */}
        <section id="goals" className="goals-section app-section">
          <h2>Your Financial Goals</h2>
          <button className="btn-primary add-goal-btn" onClick={handleAddGoalClick}>
            Add New Goal
          </button>

          {showAddGoalForm && (
            <div className="form-overlay">
              <GoalForm
                onSubmit={handleFormSubmit}
                initialData={editingGoal || {}}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          <div className="goal-list">
            {goals.length === 0 ? (
              <p>No goals yet. Add your first goal to start tracking your savings!</p>
            ) : (
              goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={handleEditGoal}
                  onDelete={removeGoal}
                  onDeposit={makeDeposit}
                />
              ))
            )}
          </div>
        </section>

        {/* --- Additional Content Section (Example to fill more space) --- */}
        <section className="additional-info-section app-section">
            <h3>Why Set Financial Goals?</h3>
            <div className="info-grid">
                <div className="info-card">
                    <h4>Clarity & Focus</h4>
                    <p>Clearly defined goals provide a roadmap for your money, helping you make smarter spending and saving decisions.</p>
                </div>
                <div className="info-card">
                    <h4>Motivation</h4>
                    <p>Seeing your progress towards a specific target keeps you motivated and committed to your financial plan.</p>
                </div>
                <div className="info-card">
                    <h4>Financial Security</h4>
                    <p>Achieving savings goals builds a strong financial foundation, offering peace of mind and security for the future.</p>
                </div>
            </div>
            <p className="call-to-action">Start planning your goals today and watch your savings grow!</p>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default App;