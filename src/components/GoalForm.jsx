import React, { useState, useEffect } from "react";

const GoalForm = ({ onSubmit, initialData = {}, onCancel, onAlert }) => {
  // Initialize form data state, either with initialData for editing or empty for new goals.
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    targetAmount: initialData.targetAmount !== undefined ? String(initialData.targetAmount) : "",
    savedAmount: initialData.savedAmount !== undefined ? String(initialData.savedAmount) : "",
    category: initialData.category || "",
    targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : "",
  });

  // Use an effect to update the form data when initialData changes (for editing goals)
  useEffect(() => {
    setFormData({
      name: initialData.name || "",
      targetAmount: initialData.targetAmount !== undefined ? String(initialData.targetAmount) : "",
      savedAmount: initialData.savedAmount !== undefined ? String(initialData.savedAmount) : "",
      category: initialData.category || "",
      targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : "",
    });
  }, [initialData]);

  // Handle changes in the form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const targetAmount = parseFloat(formData.targetAmount);
    const savedAmount = parseFloat(formData.savedAmount);
    const targetDate = formData.targetDate;

    // Basic validation to ensure required fields are not empty
    if (!formData.name.trim()) {
      onAlert("Validation Error", "Goal Name cannot be empty.");
      return;
    }
    if (isNaN(targetAmount) || targetAmount <= 0) {
      onAlert("Validation Error", "Target Amount must be a positive number.");
      return;
    }
    if (isNaN(savedAmount) || savedAmount < 0) {
      onAlert("Validation Error", "Saved Amount must be a non-negative number.");
      return;
    }
    if (new Date(targetDate) < new Date()) {
        onAlert("Validation Error", "Target Date cannot be in the past.");
        return;
    }

    // Call the onSubmit prop with the goal data
    onSubmit({
      ...formData,
      targetAmount: targetAmount,
      savedAmount: savedAmount || 0, // Default to 0 if savedAmount is not provided
      targetDate: new Date(formData.targetDate).toISOString().split('T')[0],
    });
  };

  return (
    <div className="goal-form-container">
      <h3>{initialData.id ? "Edit Goal" : "Add New Goal"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Goal Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetAmount">Target Amount (KSh):</label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="savedAmount">Current Saved Amount (KSh):</label>
          <input
            type="number"
            id="savedAmount"
            name="savedAmount"
            value={formData.savedAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="targetDate">Target Date:</label>
          <input
            type="date"
            id="targetDate"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            required
          />
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
