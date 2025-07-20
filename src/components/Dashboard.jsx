// src/components/Dashboard.jsx
import React from 'react';

const Dashboard = ({ goals }) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length;
  const inProgressGoals = totalGoals - completedGoals;

  const totalTargetAmount = goals.reduce((sum, goal) => sum + Number(goal.targetAmount), 0);
  const totalSavedAmount = goals.reduce((sum, goal) => sum + Number(goal.savedAmount), 0);

  return (
    <section className="dashboard-overview">
      <h3>Dashboard Overview</h3>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Total Goals</h4>
          <p>{totalGoals}</p>
        </div>
        <div className="stat-card">
          <h4>Completed Goals</h4>
          <p>{completedGoals}</p>
        </div>
        <div className="stat-card">
          <h4>In Progress</h4>
          <p>{inProgressGoals}</p>
        </div>
        <div className="stat-card">
          <h4>Total Target</h4>
          <p>KSh {totalTargetAmount.toFixed(2)}</p> {/* Changed here */}
        </div>
        <div className="stat-card">
          <h4>Total Saved</h4>
          <p>KSh {totalSavedAmount.toFixed(2)}</p> {/* Changed here */}
        </div>
      </div>
      {totalGoals === 0 && (
        <p className="no-goals-dashboard">Start adding goals to see your progress here!</p>
      )}
    </section>
  );
};

export default Dashboard;