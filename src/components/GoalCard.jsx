import React, { useState } from "react";

const GoalCard = ({ goal, onUpdate, onDelete, onDeposit, onAlert }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [showDepositInput, setShowDepositInput] = useState(false);

  const targetAmountNum = Number(goal.targetAmount);
  const savedAmountNum = Number(goal.savedAmount);
  const remainingAmount = targetAmountNum - savedAmountNum;

  const progress = (savedAmountNum / targetAmountNum) * 100;
  const isCompleted = savedAmountNum >= targetAmountNum;

  const targetDateObj = new Date(goal.targetDate);
  const now = new Date();
  const diffTime = targetDateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isWarning = diffDays <= 30 && diffDays > 0 && !isCompleted;
  const isOverdue = targetDateObj < now && !isCompleted;

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
      onAlert("Invalid Deposit", "Please enter a valid deposit amount greater than zero.");
    }
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed!";
    if (isOverdue) return "Past Due";
    if (isWarning) return "On Track (Warning)";
    return "On Track";
  };

  const getStatusClass = () => {
    if (isCompleted) return "status-completed";
    if (isOverdue) return "status-overdue";
    if (isWarning) return "status-warning";
    return "status-on-track";
  };

  const getTimeRemainingText = () => {
    if (isCompleted) {
      return "Goal achieved!";
    }
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
    return "Past due";
  };

  return (
    <div className={`goal-card ${getStatusClass()}`}>
      <h3>{goal.name}</h3>
      <p className="goal-category">Category: {goal.category}</p>
      <p>Target: KSh {Number(goal.targetAmount).toFixed(2)}</p>
      <p>Saved: KSh {Number(goal.savedAmount).toFixed(2)}</p>
      <p className="text-sm font-bold">Remaining: KSh {remainingAmount.toFixed(2)}</p>
      <p>Target Date: {
          new Date(goal.targetDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
          })
        }
      </p>
      <p>Time Left: **{getTimeRemainingText()}**</p>

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
        <button className="btn-danger" onClick={() => onDelete(goal.id, goal.name)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
