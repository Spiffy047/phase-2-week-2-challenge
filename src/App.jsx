/* global __firebase_config, __initial_auth_token, __app_id */
import React, { useState, useEffect } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import './App.css';

const App = () => {
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  useEffect(() => {
    if (typeof __firebase_config !== 'undefined') {
      const firebaseConfig = JSON.parse(__firebase_config);
      if (firebaseConfig.projectId) {
        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestore);
        setAuth(firebaseAuth);

        const unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            setUserId(user.uid);
            setShowAuthModal(false);
          } else {
            setUserId(null);
            setShowAuthModal(true);
            try {
              if (typeof __initial_auth_token !== 'undefined') {
                await signInWithCustomToken(firebaseAuth, __initial_auth_token);
              } else {
                await signInAnonymously(firebaseAuth);
              }
            } catch (error) {
              console.error("Error during anonymous authentication:", error);
            }
          }
          setIsAuthReady(true);
        });
        return () => unsubscribeAuth();
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthReady && db && userId) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const goalsColRef = collection(db, 'artifacts', appId, 'users', userId, 'goals');
      const unsubscribe = onSnapshot(goalsColRef, (snapshot) => {
        const goalsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setGoals(goalsData);
      });

      return () => unsubscribe();
    }
  }, [isAuthReady, db, userId]);

  const handleAuthSubmit = async (email, password, mode) => {
    if (auth) {
      try {
        if (mode === 'signup') {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
        setShowAuthModal(false);
      } catch (error) {
        console.error("Authentication error:", error);
        // Implement custom modal for error messages
      }
    }
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        setGoals([]);
        setShowAuthModal(true);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  const handleAddGoal = async (newGoal) => {
    if (db && userId) {
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const goalsColRef = collection(db, 'artifacts', appId, 'users', userId, 'goals');
        await addDoc(goalsColRef, newGoal);
        setShowGoalForm(false);
      } catch (error) {
        console.error("Error adding goal:", error);
      }
    }
  };

  const handleUpdateGoal = async (updatedGoal) => {
    if (db && userId && updatedGoal.id) {
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const goalDocRef = doc(db, 'artifacts', appId, 'users', userId, 'goals', updatedGoal.id);
        await setDoc(goalDocRef, updatedGoal);
        setShowGoalForm(false);
        setEditingGoal(null);
      } catch (error) {
        console.error("Error updating goal:", error);
      }
    }
  };

  const handleDeleteGoal = async () => {
    if (db && userId && goalToDelete) {
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const goalDocRef = doc(db, 'artifacts', appId, 'users', userId, 'goals', goalToDelete.id);
        await deleteDoc(goalDocRef);
        setShowDeleteModal(false);
        setGoalToDelete(null);
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleDeposit = async (goalId, amount) => {
    if (db && userId) {
      try {
        const goalToUpdate = goals.find(goal => goal.id === goalId);
        if (goalToUpdate) {
          const newSavedAmount = Number(goalToUpdate.savedAmount) + Number(amount);
          const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
          const goalDocRef = doc(db, 'artifacts', appId, 'users', userId, 'goals', goalId);
          await setDoc(goalDocRef, { ...goalToUpdate, savedAmount: newSavedAmount });
        }
      } catch (error) {
        console.error("Error depositing into goal:", error);
      }
    }
  };

  const handleEditGoalClick = (goalId) => {
    const goalToEdit = goals.find(goal => goal.id === goalId);
    setEditingGoal(goalToEdit);
    setShowGoalForm(true);
  };

  const handleCancelForm = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleViewDashboardClick = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
  };
  
  if (!isAuthReady) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="app-container">
      <Navbar
        onAddGoalClick={() => { setShowGoalForm(true); setEditingGoal(null); }}
        onViewDashboardClick={handleViewDashboardClick}
        onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
        onSignupClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
        onLogoutClick={handleLogout}
        userId={userId}
      />

      <main className="main-content-wrapper">
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onSubmit={handleAuthSubmit}
            onClose={() => setShowAuthModal(false)}
            onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          />
        )}

        {userId && !showGoalForm && !showAuthModal ? (
          <>
            <Dashboard goals={goals} />
            <div className="goals-list">
              {goals.length > 0 ? (
                goals.map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onUpdate={handleEditGoalClick}
                    onDelete={() => { setGoalToDelete(goal); setShowDeleteModal(true); }}
                    onDeposit={handleDeposit}
                  />
                ))
              ) : (
                <p className="no-goals-message">No goals set yet. Add a new goal to get started!</p>
              )}
            </div>
          </>
        ) : userId && showGoalForm && !showAuthModal ? (
          <GoalForm
            onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
            initialData={editingGoal || {}}
            onCancel={handleCancelForm}
          />
        ) : null}
      </main>

      <Footer />

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete the goal: **{goalToDelete?.name}**?</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleDeleteGoal}>Delete</button>
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
