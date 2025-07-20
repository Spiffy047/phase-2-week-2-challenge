// src/api.js
const API_BASE_URL = "https://phase-2-week-2-challenge.onrender.com";

export const fetchGoals = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const addGoal = async (newGoal) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newGoal),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const updateGoal = async (id, updatedFields) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH", // Use PATCH for partial updates
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const deleteGoal = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};