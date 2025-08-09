// src/components/AuthPage.jsx
import React, { useState } from 'react';

const AuthPage = ({ supabase, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (email, password, isLogin) => {
    setMessage('');
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      console.error(error.message);
      setMessage(error.message);
    } else if (!isLogin) {
      setMessage("Registration successful! Please check your email to confirm your account.");
      console.log("Registration successful! Please check your email to confirm your account.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth(email, password, isLogin);
  };

  return (
    <div className="auth-container">
      <h2 className="text-3xl font-bold">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
        <button onClick={() => {setIsLogin(!isLogin); setMessage('');}} className="text-blue-500">
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
