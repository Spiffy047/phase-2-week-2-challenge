// src/components/GoalForm.jsx - Verify this EXACTLY
import React, { useState, useEffect } from "react";

const GoalForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    targetAmount: initialData.targetAmount !== undefined ? String(initialData.targetAmount) : "",
    savedAmount: initialData.savedAmount !== undefined ? String(initialData.savedAmount) : "",
    targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : "",
  });

  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      targetAmount: initialData.targetAmount !== undefined ? String(initialData.targetAmount) : "",
      savedAmount: initialData.savedAmount !== undefined ? String(initialData.savedAmount) : "",
      targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : "",
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

    const targetAmount = parseFloat(formData.targetAmount);
    const savedAmount = parseFloat(formData.savedAmount);

    if (!formData.name.trim()) {
      alert("Goal Name cannot be empty.");
      return;
    }
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert("Target Amount must be a positive number.");
      return;
    }
    if (!formData.targetDate) {
      alert("Target Date cannot be empty.");
      return;
    }
    if (isNaN(savedAmount) || savedAmount < 0) {
      alert("Saved Amount must be a non-negative number.");
      return;
    }
    if (savedAmount > targetAmount) {
      alert("Saved Amount cannot exceed Target Amount.");
      return;
    }

    // THE CRITICAL PART: Ensure this object is constructed correctly
    const dataToSubmit = {
      name: formData.name,
      targetAmount: targetAmount,
      savedAmount: isNaN(savedAmount) ? 0 : savedAmount,
      targetDate: formData.targetDate
    };

    console.log("GoalForm - dataToSubmit:", dataToSubmit); // <-- ADD THIS LOG
    onSubmit(dataToSubmit);
  };

  return (
    <div className="goal-form-container">
      <h3>{initialData.id ? "Edit Goal" : "Add New Goal"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Goal Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount (KSh):</label>
          <input type="number" id="targetAmount" name="targetAmount" value={formData.targetAmount} onChange={handleChange} min="0" step="0.01" required />
        </div>
        <div className="form-group">
          <label htmlFor="savedAmount">Current Saved Amount (KSh):</label>
          <input type="number" id="savedAmount" name="savedAmount" value={formData.savedAmount} onChange={handleChange} min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label htmlFor="targetDate">Target Date:</label>
          <input type="date" id="targetDate" name="targetDate" value={formData.targetDate} onChange={handleChange} required />
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