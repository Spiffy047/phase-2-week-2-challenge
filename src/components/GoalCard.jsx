
import React, { useState } from "react";

const GoalCard = ({ goal, onUpdate, onDelete, onDeposit }) => {
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
      alert("Please enter a valid deposit amount.");
    }
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed!";
    if (isOverdue) return "Overdue!";
    if (isWarning) return "Close to Deadline!"; 
    return "On Track";
  };

  const getStatusClass = () => {
    if (isCompleted) return "status-completed";
    if (isOverdue) return "status-overdue";
    if (isWarning) return "status-warning";
    return "status-on-track";
  };

  
  const getTimeRemainingText = () => {
    if (isCompleted) return "Goal Completed!";
    if (isOverdue) return "Deadline Passed!";
    if (!goal.targetDate) return "No deadline set."; 

    
    if (diffDays === 0) return "Due Today!";
    if (diffDays === 1) return "1 day left!";
    if (diffDays > 0 && diffDays <= 30) return `${diffDays} days left - Urgent!`;
    if (diffDays > 30 && diffDays < 365) return `${diffDays} days left`; 
    if (diffDays >= 365) {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      return `${years} year${years > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''} left`;
    }
    return ""; 
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
        Remaining: <span className="currency-amount">KSh {remainingAmount.toFixed(2)}</span> 
      </p>
      <p>
        Category: **{goal.category || "N/A"}** 
      </p>
      <p>
        Target Date: {
          goal.targetDate
            ? new Date(goal.targetDate).toLocaleDateString("en-KE", {
                year: 'numeric', month: 'long', day: 'numeric'
              })
            : 'N/A'
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
        <button className="btn-danger" onClick={() => onDelete(goal.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;