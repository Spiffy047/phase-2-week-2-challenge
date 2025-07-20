
import { useState, useEffect, useCallback } from 'react';


const API_BASE_URL = 'https://phase-2-week-2-challenge-7rn2.onrender.com'; // Or your Render URL

const useGoals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGoals = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/goals`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGoals(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch goals:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const createGoal = async (newGoal) => {
        try {
            console.log("useGoals - Sending newGoal to API:", newGoal); 
            const response = await fetch(`${API_BASE_URL}/goals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGoal), 
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const createdGoal = await response.json();
            console.log("useGoals - Received createdGoal from API:", createdGoal); 
            setGoals((prevGoals) => [...prevGoals, createdGoal]);
            return createdGoal; 
        } catch (err) {
            console.error("Failed to create goal:", err);
            throw err;
        }
    };

    const editGoal = async (id, updatedGoal) => {
        try {
            console.log("useGoals - Sending updatedGoal to API:", updatedGoal); 
            const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedGoal),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setGoals((prevGoals) =>
                prevGoals.map((goal) => (goal.id === id ? data : goal))
            );
            return data;
        } catch (err) {
            console.error("Failed to update goal:", err);
            throw err;
        }
    };

    const removeGoal = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/goals/${id}`, {
                method: 'DELETE',
            });
            setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
        } catch (err) {
            console.error("Failed to delete goal:", err);
            throw err;
        }
    };

    const makeDeposit = async (goalId, amount) => {
        const goalToUpdate = goals.find(goal => goal.id === goalId);
        if (!goalToUpdate) return;

        
        const currentSaved = Number(goalToUpdate.savedAmount);
        const target = Number(goalToUpdate.targetAmount);

        const newSavedAmount = currentSaved + amount;

        
        const updatedSavedAmount = Math.min(newSavedAmount, target);

        const updatedGoal = {
            ...goalToUpdate,
            savedAmount: updatedSavedAmount,
        };

        try {
           
            const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ savedAmount: updatedSavedAmount }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); 
            setGoals((prevGoals) =>
                prevGoals.map((goal) => (goal.id === goalId ? data : goal))
            );
        } catch (err) {
            console.error("Failed to make deposit:", err);
            throw err;
        }
    };

    return { goals, loading, error, createGoal, editGoal, removeGoal, makeDeposit };
};

export default useGoals;