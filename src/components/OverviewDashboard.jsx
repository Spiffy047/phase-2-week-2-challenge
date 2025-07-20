
import React from "react";
import { getDaysRemaining, getGoalStatus } from "../utils/goalUtils";

const OverviewDashboard = ({ goals }) => {
  const totalGoals = goals.length;
  const totalMoneySaved = goals.reduce((acc, goal) => acc + goal.savedAmount, 0);
  const completedGoals = goals.filter((goal) => goal.savedAmount >= goal.targetAmount).length;

  return (
    <div className="overview-dashboard">
      <h3>Overall Savings Overview</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Goals</h4>
          <p>{totalGoals}</p>
        </div>
        <div className="stat-card">
          <h4>Total Money Saved</h4>
          <p>${totalMoneySaved.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Goals Completed</h4>
          <p>{completedGoals}</p>
        </div>
      </div>

      <div className="goal-deadlines">
        <h4>Goal Deadlines & Status</h4>
        {goals.length === 0 ? (
          <p>No goals to display.</p>
        ) : (
          <ul>
            {goals.map((goal) => {
              const daysRemaining = getDaysRemaining(goal.deadline);
              const status = getGoalStatus(goal);
              return (
                <li key={goal.id}>
                  <strong>{goal.name}:</strong>
                  {status === "Completed" && <span className="status-completed"> Completed!</span>}
                  {status === "Overdue" && <span className="status-overdue"> Overdue!</span>}
                  {status === "Warning" && (
                    <span className="status-warning"> {daysRemaining} days left (Warning)</span>
                  )}
                  {status === "On Track" && (
                    <span className="status-on-track"> {daysRemaining} days left</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OverviewDashboard;