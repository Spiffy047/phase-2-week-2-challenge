import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { app as firebaseApp } from './components/firebaseConfig';
import './App.css';

const getAuthToken = async () => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken();
    return idToken;
  }
  return null;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const fetchProtectedData = async () => {
    const token = await getAuthToken();
    if (!token) {
      console.error("User not logged in, cannot fetch data.");
      return;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar />}
        <main>
          <Routes>
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage onLogin={handleLogin} onRegister={handleRegister} />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/auth"} />} />
          </Routes>
        </main>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
