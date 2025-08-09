import React from 'react';

const GoalCard = ({ goal, onUpdate, onDelete }) => {
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  const isCompleted = goal.savedAmount >= goal.targetAmount;
  
  const getStatusText = () => {
    if (isCompleted) return 'Completed!';
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const timeLeft = targetDate - now;
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'Overdue';
    if (daysLeft <= 30) return `${daysLeft} days left (Warning)`;
    return `${daysLeft} days left`;
  };

  const getStatusClass = () => {
    if (isCompleted) return 'text-green-500';
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const timeLeft = targetDate - now;
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return 'text-red-500';
    if (daysLeft <= 30) return 'text-yellow-500';
    return 'text-blue-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{goal.name}</h3>
        <p className="text-gray-600 mb-1">
          Target: KSh {goal.targetAmount.toFixed(2)}
        </p>
        <p className="text-gray-600 mb-1">
          Saved: KSh {goal.savedAmount.toFixed(2)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${Math.min(100, progress)}%` }}
          ></div>
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-4">
          {progress.toFixed(2)}% Saved
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className={`text-sm font-semibold ${getStatusClass()}`}>
          {getStatusText()}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdate(goal)}
            className="text-sm bg-blue-500 text-white py-1 px-3 rounded-full hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-sm bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
