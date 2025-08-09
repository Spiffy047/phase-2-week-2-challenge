// src/Dashboard.jsx
import React from 'react';

const Dashboard = ({ goals }) => {
  const totalGoals = goals.length;
  const totalSavedAmount = goals.reduce((sum, goal) => sum + Number(goal.saved_amount), 0);
  const now = new Date();
  const completedGoals = goals.filter((goal) => Number(goal.saved_amount) >= Number(goal.target_amount)).length;
  const onTrackGoals = goals.filter(goal => {
    const targetDateObj = new Date(goal.target_date);
    const savedAmountNum = Number(goal.saved_amount);
    const targetAmountNum = Number(goal.target_amount);
    return savedAmountNum < targetAmountNum && targetDateObj > now;
  }).length;
  const pastDueGoals = goals.filter(goal => {
    const targetDateObj = new Date(goal.target_date);
    const savedAmountNum = Number(goal.saved_amount);
    const targetAmountNum = Number(goal.target_amount);
    return targetDateObj <= now && savedAmountNum < targetAmountNum;
  }).length;
  return (
    <div className="dashboard-container">
      <h2>Overall Savings Overview</h2>
      <div className="dashboard-metrics">
        <div className="metric-card">
          <h3>Total Goals</h3>
          <p>{totalGoals}</p>
        </div>
        <div className="metric-card">
          <h3>Goals Completed</h3>
          <p className="completed-metric">{completedGoals}</p>
        </div>
        <div className="metric-card">
          <h3>On Track Goals</h3>
          <p className="on-track-metric">{onTrackGoals}</p>
        </div>
        <div className="metric-card">
          <h3>Past Due Goals</h3>
          <p className="past-due-metric">{pastDueGoals}</p>
        </div>
        <div className="metric-card total-saved">
          <h3>Total Saved Across All Goals</h3>
          <p className="currency-amount">KSh {totalSavedAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
