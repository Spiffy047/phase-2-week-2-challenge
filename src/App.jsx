import React, { useState, useEffect } from 'react';
import './App.css'
// Use this URL for your deployed backend
const API_BASE_URL = 'https://smart-goal-planner-xzdh.onrender.com'; // IMPORTANT: Change this to your new Render backend URL

// A simple utility to check if the user is an admin
const checkAdmin = (user) => user && user.role === 'admin';

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

  // Fetches goals from the backend
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
        fetchGoals(); // Fetch goals after successful login
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
        throw new Error('Login failed. Check your credentials.');
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
        throw new Error('Registration failed. Username may be taken.');
      }
      await response.json();
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

  // Render the current page based on state
  const renderPage = () => {
    if (page === 'login') return <LoginPage onLogin={login} onTogglePage={() => setPage('register')} error={error} />;
    if (page === 'register') return <RegisterPage onRegister={register} onTogglePage={() => setPage('login')} error={error} />;
    if (page === 'dashboard' && user) return <DashboardPage user={user} onLogout={logout} goals={goals} />;
    return <p>Loading...</p>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
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
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            type="submit"
          >
            Sign In
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
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
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            type="submit"
          >
            Register
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
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

const DashboardPage = ({ user, onLogout, goals }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome, {user.username}!</h2>
      <p className="text-gray-600 mb-6">You are logged in with the **{user.role}** role.</p>

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Financial Goals</h3>
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {goals.map(goal => (
            <div key={goal.id} className="bg-gray-50 rounded-lg p-4 shadow text-left">
              <h4 className="font-bold text-lg">{goal.name}</h4>
              <p>Target: ${goal.targetAmount}</p>
              <p>Saved: ${goal.savedAmount}</p>
              <p>Category: {goal.category}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No goals found. Start adding some!</p>
      )}

      <button
        className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
};

// Main component to be exported
export default function AppWrapper() {
  return <App />;
}
