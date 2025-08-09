import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import './App.css'; // Import the new CSS file

// This URL is a placeholder and should be updated with your Render backend URL
const API_BASE_URL = 'https://smart-goal-planner-xzdh.onrender.com';

// The main App component handles routing and state
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [page, setPage] = useState('login');
  const [error, setError] = useState('');

  // Effect to validate the token and fetch user on component mount
  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  // Fetches goals from the backend for the logged-in user
  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      setGoals(data);
    } catch (err) {
      setError(err.message);
      setGoals([]);
    }
  };

  const validateToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsLoggedIn(true);
        setPage('dashboard');
        // Fetch goals or render admin dashboard based on user role
        if (userData.user.role === 'user') {
          fetchGoals();
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error('Token validation failed:', err);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      // The server is not expected to return a JSON body on successful registration,
      // so we will skip the JSON parsing to avoid an error.
      // await response.json(); // This line was causing the error
      setError('');
      setPage('login'); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsLoggedIn(false);
    setPage('login');
  };

  // Render the current page based on state and user role
  const renderPage = () => {
    if (page === 'login') return <LoginPage onLogin={login} onTogglePage={() => setPage('register')} error={error} />;
    if (page === 'register') return <RegisterPage onRegister={register} onTogglePage={() => setPage('login')} error={error} />;
    if (page === 'dashboard' && user) {
      if (user.role === 'admin') {
        return <AdminDashboardPage user={user} onLogout={logout} />;
      } else {
        return <UserDashboardPage user={user} onLogout={logout} goals={goals} fetchGoals={fetchGoals} token={token} />;
      }
    }
    return <p>Loading...</p>;
  };

  return (
    <div className="app-container">
      <div className="main-content-wrapper">
        {renderPage()}
      </div>
    </div>
  );
};

// --- Authentication Components (Login/Register/Dashboard) ---

const LoginPage = ({ onLogin, onTogglePage, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="auth-form-container">
      <h2 className="section-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            className="form-input"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button
            className="btn-primary"
            type="submit"
          >
            Sign In
          </button>
          <button
            className="text-link"
            type="button"
            onClick={onTogglePage}
          >
            Don't have an account? Register
          </button>
        </div>
      </form>
    </div>
  );
};

const RegisterPage = ({ onRegister, onTogglePage, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ username, password, role });
  };

  return (
    <div className="auth-form-container">
      <h2 className="section-title">Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            className="form-input"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            className="form-input"
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="role">
            Role
          </label>
          <select
            className="form-input"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-actions">
          <button
            className="btn-primary"
            type="submit"
          >
            Register
          </button>
          <button
            className="text-link"
            type="button"
            onClick={onTogglePage}
          >
            Already have an account? Login
          </button>
        </div>
      </form>
    </div>
  );
};

const UserDashboardPage = ({ user, onLogout, goals, fetchGoals, token }) => {
  const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', savedAmount: '', category: '' });
  const [editingGoal, setEditingGoal] = useState(null);
  const [error, setError] = useState('');

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGoal)
      });
      if (!response.ok) {
        throw new Error('Failed to create goal');
      }
      setNewGoal({ name: '', targetAmount: '', savedAmount: '', category: '' });
      fetchGoals(); // Refresh the goals list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${editingGoal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingGoal)
      });
      if (!response.ok) {
        throw new Error('Failed to update goal');
      }
      setEditingGoal(null); // Exit editing mode
      fetchGoals(); // Refresh the goals list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete goal');
        }
        fetchGoals(); // Refresh the goals list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [token]);

  return (
    <div className="dashboard-page">
      <h2 className="section-title">Welcome, {user.username}!</h2>
      <p className="user-role-text">You are logged in with the **{user.role}** role.</p>
      <button
        className="btn-logout"
        onClick={onLogout}
      >
        Logout
      </button>

      {error && <p className="error-message">{error}</p>}

      {/* Form for Creating/Editing Goals */}
      <div className="goal-form-section">
        <h3 className="goal-form-title">
          {editingGoal ? 'Edit Goal' : 'Create New Goal'}
        </h3>
        <form onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal} className="goal-form">
          <div className="goal-form-fields">
            <input
              className="form-input"
              type="text"
              placeholder="Goal Name"
              value={editingGoal ? editingGoal.name : newGoal.name}
              onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, name: e.target.value }) : setNewGoal({ ...newGoal, name: e.target.value })}
            />
            <input
              className="form-input"
              type="number"
              placeholder="Target Amount"
              value={editingGoal ? editingGoal.targetAmount : newGoal.targetAmount}
              onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, targetAmount: e.target.value }) : setNewGoal({ ...newGoal, targetAmount: e.target.value })}
            />
            <input
              className="form-input"
              type="number"
              placeholder="Saved Amount"
              value={editingGoal ? editingGoal.savedAmount : newGoal.savedAmount}
              onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, savedAmount: e.target.value }) : setNewGoal({ ...newGoal, savedAmount: e.target.value })}
            />
            <input
              className="form-input"
              type="text"
              placeholder="Category"
              value={editingGoal ? editingGoal.category : newGoal.category}
              onChange={(e) => editingGoal ? setEditingGoal({ ...editingGoal, category: e.target.value }) : setNewGoal({ ...newGoal, category: e.target.value })}
            />
          </div>
          <div className="goal-form-buttons">
            <button
              className="btn-primary"
              type="submit"
            >
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </button>
            {editingGoal && (
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setEditingGoal(null)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="goals-list-title">Your Financial Goals</h3>
      {goals.length > 0 ? (
        <div className="goal-list-container">
          {goals.map(goal => (
            <div key={goal.id} className="goal-card">
              <div>
                <h4 className="goal-card-title">{goal.name}</h4>
                <p>Target: ${goal.targetAmount}</p>
                <p>Saved: ${goal.savedAmount}</p>
                <p>Category: {goal.category}</p>
              </div>
              <div className="goal-actions">
                <button onClick={() => setEditingGoal(goal)} className="btn-icon">
                  <PencilSquareIcon className="icon-edit" />
                </button>
                <button onClick={() => handleDeleteGoal(goal.id)} className="btn-icon">
                  <TrashIcon className="icon-delete" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No goals found. Start adding some!</p>
      )}
    </div>
  );
};

const AdminDashboardPage = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user and all their goals?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
        fetchUsers(); // Refresh the user list
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return (
    <div className="dashboard-page">
      <h2 className="section-title">Admin Dashboard</h2>
      <p className="user-role-text">Welcome, {user.username}! You are logged in with the **{user.role}** role.</p>
      <button
        className="btn-logout"
        onClick={onLogout}
      >
        Logout
      </button>

      {error && <p className="error-message">{error}</p>}
      
      <h3 className="stats-title">Total Users: {totalUsers}</h3>
      
      <div className="users-list-container">
        {users.length > 0 ? (
          <div className="users-list">
            {users.map(u => (
              <div key={u.id} className="user-card">
                <div>
                  <h4 className="user-card-title">{u.username}</h4>
                  <p>Role: {u.role}</p>
                </div>
                {u.id !== user.id && (
                  <button onClick={() => handleDeleteUser(u.id)} className="btn-icon">
                    <TrashIcon className="icon-delete" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

// Main component to be exported
export default function AppWrapper() {
  return (
    <>
      <App />
    </>
  );
}
