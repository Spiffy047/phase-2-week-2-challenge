import React, { useState, useEffect } from "react";

const GoalForm = ({ onSubmit, initialData = {}, onCancel, onAlert }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    targetAmount: initialData.targetAmount !== undefined ? String(initialData.targetAmount) : "",
    savedAmount: initialData.savedAmount !== undefined ? String(initialData.savedAmount) : "",
    category: initialData.category || "",
    targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : "",
  });

  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      targetAmount: initialData.targetAmount !== undefined ? String(initialData.targetAmount) : "",
      savedAmount: initialData.savedAmount !== undefined ? String(initialData.savedAmount) : "",
      category: initialData.category || "",
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
      onAlert("Validation Error", "Goal Name cannot be empty.");
      return;
    }
    if (isNaN(targetAmount) || targetAmount <= 0) {
      onAlert("Validation Error", "Target Amount must be a number greater than 0.");
      return;
    }
    if (isNaN(savedAmount) || savedAmount < 0) {
      onAlert("Validation Error", "Saved Amount must be a number greater than or equal to 0.");
      return;
    }
    if (new Date(formData.targetDate) < new Date(new Date().toDateString())) {
      onAlert("Validation Error", "Target Date cannot be in the past.");
      return;
    }

    const newGoal = {
      ...formData,
      targetAmount: targetAmount,
      savedAmount: savedAmount,
    };

    onSubmit(newGoal);
  };

  return (
    <div className="goal-form-container">
      <h3>{initialData.id ? "Edit Goal" : "Add a New Goal"}</h3>
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
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} required />
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
