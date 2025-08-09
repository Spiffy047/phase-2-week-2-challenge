import React, { useState, useEffect } from 'react';
import GoalList from './GoalList';
import GoalForm from './GoalForm';
import { supabase } from './supabaseClient'; // Corrected import path
import { useAuth } from './AuthContext'; // A new hook to get user data

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Assuming you've set up an auth context

  // Fetch goals from Supabase
  const fetchGoals = async () => {
    if (!user) return;

    setLoading(true);
    const { data: fetchedGoals, error: fetchError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching goals:', fetchError);
      setError('Could not fetch goals.');
    } else {
      setGoals(fetchedGoals);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  // Handle goal creation
  const addGoal = async (newGoal) => {
    if (!user) return;
    const { data, error: insertError } = await supabase
      .from('goals')
      .insert({ ...newGoal, user_id: user.id })
      .select();
    
    if (insertError) {
      console.error('Error adding goal:', insertError);
    } else {
      setGoals([data[0], ...goals]);
    }
  };

  // Handle goal update
  const updateGoal = async (id, updatedGoal) => {
    if (!user) return;
    const { error: updateError } = await supabase
      .from('goals')
      .update(updatedGoal)
      .eq('id', id);

    if (updateError) {
      console.error('Error updating goal:', updateError);
    } else {
      setGoals(goals.map(goal => (goal.id === id ? { ...goal, ...updatedGoal } : goal)));
    }
  };

  // Handle goal deletion
  const deleteGoal = async (id) => {
    if (!user) return;
    const { error: deleteError } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting goal:', deleteError);
    } else {
      setGoals(goals.filter(goal => goal.id !== id));
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading goals...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-8">
        Your Goals
      </h1>
      <GoalForm addGoal={addGoal} />
      <GoalList goals={goals} updateGoal={updateGoal} deleteGoal={deleteGoal} />
    </div>
  );
};

export default Dashboard;
