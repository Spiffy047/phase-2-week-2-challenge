/* global __firebase_config, __initial_auth_token */
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithCustomToken, signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
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
  const [firebaseInitError, setFirebaseInitError] = useState(null);

  useEffect(() => {
    let firebaseConfig = null;
    let initialAuthToken = null;

    if (typeof __firebase_config !== 'undefined') {
      try {
        firebaseConfig = JSON.parse(__firebase_config);
        initialAuthToken = __initial_auth_token;
        console.log("Using Canvas environment variables.");
      } catch (e) {
        console.error("Failed to parse __firebase_config from Canvas globals.", e);
        firebaseConfig = {
          apiKey: "placeholder",
          authDomain: "placeholder",
          projectId: "placeholder",
          storageBucket: "placeholder",
          messagingSenderId: "placeholder",
          appId: "placeholder"
        };
        setFirebaseInitError("Using placeholder Firebase config. The provided config was invalid.");
      }
    } else {
      console.log("No Canvas environment variables found. Using placeholder config.");
      firebaseConfig = {
        apiKey: "placeholder",
        authDomain: "placeholder",
        projectId: "placeholder",
        storageBucket: "placeholder",
        messagingSenderId: "placeholder",
        appId: "placeholder"
      };
      setFirebaseInitError("No Firebase configuration found. Using a placeholder config.");
    }
    
    if (!firebaseConfig || typeof firebaseConfig !== 'object' || !firebaseConfig.apiKey) {
      console.error("Firebase config is missing or invalid after all attempts.");
      setFirebaseInitError("Firebase configuration is missing or invalid. Please ensure the environment variable is a correctly formatted JSON string.");
      setIsAuthReady(true);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (user) => {
        console.log("onAuthStateChanged fired. User:", user);
        if (user) {
          console.log("User is authenticated. UID:", user.uid);
          setUserId(user.uid);
        } else {
          console.log("No user found.");
          setUserId(null);
        }
        setIsAuthReady(true);
        console.log("Authentication state is ready.");
      });
      return () => unsubscribeAuth();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setFirebaseInitError(`Firebase initialization failed. Error: ${e.message}`);
      setIsAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthReady && db && userId) {
      const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const goalsColRef = collection(db, 'artifacts', currentAppId, 'users', userId, 'goals');
      const unsubscribe = onSnapshot(goalsColRef, (snapshot) => {
        const goalsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setGoals(goalsData);
      }, (error) => {
        console.error("Error fetching goals from Firestore:", error);
        if (error.code === "permission-denied") {
            setFirebaseInitError("Access to the database was denied. Please check your security rules.");
        } else {
            setFirebaseInitError("Could not connect to Firestore. Check your network connection.");
        }
      });

      return () => unsubscribe();
    }
  }, [isAuthReady, db, userId]);
  
  const handleAnonymousSignIn = async () => {
    if (auth) {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Error during anonymous sign-in:", error);
        setFirebaseInitError(`Anonymous sign-in failed. Error: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
        setGoals([]);
        setUserId(null);
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  const handleAddGoal = async (newGoal) => {
    if (db && userId) {
      try {
        const goalsColRef = collection(db, 'artifacts', 'default-app-id', 'users', userId, 'goals');
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
        const goalDocRef = doc(db, 'artifacts', 'default-app-id', 'users', userId, 'goals', updatedGoal.id);
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
        const goalDocRef = doc(db, 'artifacts', 'default-app-id', 'users', userId, 'goals', goalToDelete.id);
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
          const goalDocRef = doc(db, 'artifacts', 'default-app-id', 'users', userId, 'goals', goalId);
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

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
        <p className="text-gray-600 font-semibold text-lg">Loading...</p>
      </div>
    );
  }

  if (firebaseInitError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
        <p className="text-red-500 font-semibold text-lg">{firebaseInitError}</p>
        <p className="text-gray-500 mt-4">The app may not function correctly without a valid Firebase configuration.</p>
      </div>
    );
  }

  // Render the LandingPage if the user is not authenticated
  if (!userId) {
    return <LandingPage onGetStarted={handleAnonymousSignIn} />;
  }

  return (
    <div className="app-container">
      <Navbar
        onAddGoalClick={() => { setShowGoalForm(true); setEditingGoal(null); }}
        onLogoutClick={handleLogout}
        userId={userId}
      />

      <main className="main-content-wrapper">
        {showGoalForm ? (
          <GoalForm
            onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
            initialData={editingGoal || {}}
            onCancel={handleCancelForm}
          />
        ) : (
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
        )}
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