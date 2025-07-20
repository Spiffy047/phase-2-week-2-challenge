// src/components/GoalCard.jsx
import React, { useState } from "react"; // <--- FIXED THIS LINE

const GoalCard = ({ goal, onUpdate, onDelete, onDeposit }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositInput, setShowDepositInput] = useState(false);

  // Ensure these are treated as numbers from the start
  const targetAmountNum = Number(goal.targetAmount);
  const savedAmountNum = Number(goal.savedAmount);

  // Use the numeric versions for calculations
  const progress = (savedAmountNum / targetAmountNum) * 100;
  const isCompleted = savedAmountNum >= targetAmountNum;
  const isWarning = progress > 75 && !isCompleted;

  // Ensure targetDate is a valid Date object for comparison
  const isOverdue = new Date(goal.targetDate) < new Date() && !isCompleted;

  const handleDepositChange = (e) => {
    setDepositAmount(e.target.value);
  };

  const handleMakeDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      onDeposit(goal.id, amount);
      setDepositAmount("");
      setShowDepositInput(false);
    } else {
      alert("Please enter a valid deposit amount.");
    }
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed!";
    if (isOverdue) return "Overdue!";
    if (isWarning) return "Close to Target!";
    return "On Track";
  };

  const getStatusClass = () => {
    if (isCompleted) return "status-completed";
    if (isOverdue) return "status-overdue";
    if (isWarning) return "status-warning";
    return "status-on-track";
  };

  return (
    <div className="goal-card">
      <h4>{goal.name}</h4>
      <p>
        Target: <span className="currency-amount">KSh {targetAmountNum.toFixed(2)}</span>
      </p>
      <p>
        Saved: <span className="currency-amount">KSh {savedAmountNum.toFixed(2)}</span>
      </p>
      <p>
        Target Date: {
          // Robust date display: check if goal.targetDate exists before converting
          goal.targetDate
            ? new Date(goal.targetDate).toLocaleDateString("en-KE", {
                year: 'numeric', month: 'long', day: 'numeric'
              })
            : 'N/A' // Or provide a placeholder
        }
      </p>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${Math.min(100, isNaN(progress) ? 0 : progress)}%` }}></div>
      </div>
      <p className="progress-text">{(isNaN(progress) ? 0 : progress).toFixed(2)}% Saved</p>
      <p className={`status-text ${getStatusClass()}`}>Status: {getStatusText()}</p>

      <div className="goal-actions">
        {!isCompleted && !showDepositInput && (
          <button className="btn-primary" onClick={() => setShowDepositInput(true)}>
            Deposit
          </button>
        )}
        {showDepositInput && (
          <div className="deposit-form-container">
            <input
              type="number"
              value={depositAmount}
              onChange={handleDepositChange}
              placeholder="Amount to deposit"
              min="0"
            />
            <button className="btn-primary" onClick={handleMakeDeposit}>
              Confirm
            </button>
            <button className="btn-secondary" onClick={() => setShowDepositInput(false)}>
              Cancel
            </button>
          </div>
        )}
        <button className="btn-secondary" onClick={() => onUpdate(goal.id)}>
          Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(goal.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;