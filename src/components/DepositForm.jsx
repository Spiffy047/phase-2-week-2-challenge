
import React, { useState } from "react";

const DepositForm = ({ onDeposit, onCancel }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0) {
      onDeposit(Number(amount));
      setAmount("");
    }
  };

  return (
    <div className="deposit-form-container">
      <h4>Make a Deposit</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="depositAmount">Amount:</label>
          <input
            type="number"
            id="depositAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Deposit
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default DepositForm;