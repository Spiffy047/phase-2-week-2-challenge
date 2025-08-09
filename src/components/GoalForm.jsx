// src/GoalForm.jsx
import React, { useState, useEffect } from 'react';

const GoalForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    target_amount: initialData.target_amount !== undefined ? String(initialData.target_amount) : "",
    saved_amount: initialData.saved_amount !== undefined ? String(initialData.saved_amount) : "",
    category: initialData.category || "",
    target_date: initialData.target_date ? new Date(initialData.target_date).toISOString().split('T')[0] : "",
  });
  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      target_amount: initialData.target_amount !== undefined ? String(initialData.target_amount) : "",
      saved_amount: initialData.saved_amount !== undefined ? String(initialData.saved_amount) : "",
      category: initialData.category || "",
      target_date: initialData.target_date ? new Date(initialData.target_date).toISOString().split('T')[0] : "",
    });
  }, [initialData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const targetAmount = parseFloat(formData.target_amount);
    const savedAmount = parseFloat(formData.saved_amount);
    if (!formData.name.trim()) {
      // Implement a custom modal here instead of using window.alert
      console.error("Goal Name cannot be empty.");
      return;
    }
    if (isNaN(targetAmount) || targetAmount <= 0) {
      // Implement a custom modal here instead of using window.alert
      console.error("Target Amount must be a positive number.");
      return;
    }
    if (isNaN(savedAmount) || savedAmount < 0) {
      // Implement a custom modal here instead of using window.alert
      console.error("Saved Amount must be a non-negative number.");
      return;
    }
    if (savedAmount > targetAmount) {
      // Implement a custom modal here instead of using window.alert
      console.error("Saved Amount cannot be greater than Target Amount.");
      return;
    }
    const goalToSubmit = {
      ...formData,
      target_amount: targetAmount,
      saved_amount: savedAmount,
    };
    onSubmit(goalToSubmit);
  };
  return (
    <div className="goal-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Goal Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="target_amount">Target Amount (KSh):</label>
          <input type="number" id="target_amount" name="target_amount" value={formData.target_amount} onChange={handleChange} min="0" step="0.01" required />
        </div>
        <div className="form-group">
          <label htmlFor="saved_amount">Current Saved Amount (KSh):</label>
          <input type="number" id="saved_amount" name="saved_amount" value={formData.saved_amount} onChange={handleChange} min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="target_date">Target Date:</label>
          <input type="date" id="target_date" name="target_date" value={formData.target_date} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData.id ? "Update Goal" : "Add Goal"}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
