import React, { useState } from 'react';

const AuthModal = ({ mode, onSubmit, onClose, onSwitchMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onSubmit(email, password, mode);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>{mode === 'login' ? 'Log In' : 'Sign Up'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
        <p className="switch-mode">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <span className="link" onClick={onSwitchMode}>
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="link" onClick={onSwitchMode}>
                Log In
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
