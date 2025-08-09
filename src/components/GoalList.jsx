import React from 'react';
import GoalCard from './GoalCard'; // This path is now correct

const GoalList = ({ goals, updateGoal, deleteGoal }) => {
  if (!goals || goals.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">You don't have any goals yet. Add one to get started!</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onUpdate={updateGoal}
          onDelete={deleteGoal}
        />
      ))}
    </div>
  );
};

export default GoalList;
