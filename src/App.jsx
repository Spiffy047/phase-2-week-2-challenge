import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, addDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage'; // Make sure this is the updated AuthPage
import './App.css';

const App = () => {
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [firebaseInitError, setFirebaseInitError] = useState(null);

  // State for the custom modal
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    isDestructive: false,
  });

  // Effect to handle Firebase initialization and authentication state changes
  useEffect(() => {
    let firebaseConfig = null;

    // Check for Canvas environment variables first
    if (typeof __firebase_config !== 'undefined') {
      try {
        firebaseConfig = JSON.parse(__firebase_config);
        console.log("Using Canvas environment variables.");
      } catch (e) {
        console.error("Failed to parse __firebase_config from Canvas globals.", e);
        setFirebaseInitError("The provided Firebase config from the Canvas environment is invalid.");
      }
    } else if (process.env.REACT_APP_FIREBASE_CONFIG) {
      // If not in Canvas, check for a user-provided environment variable (e.g., from Render)
      try {
        firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
        console.log("Using user-provided REACT_APP_FIREBASE_CONFIG.");
      } catch (e) {
        console.error("Failed to parse REACT_APP_FIREBASE_CONFIG from environment variables.", e);
        setFirebaseInitError("The Firebase config environment variable is not valid JSON.");
      }
    } else {
      // If neither is found, we cannot initialize Firebase.
      console.log("No Firebase configuration found.");
      setFirebaseInitError("No Firebase configuration found. Please set the REACT_APP_FIREBASE_CONFIG environment variable.");
      setIsAuthReady(true);
      return;
    }

    // If we have a configuration, attempt to initialize the app
    if (firebaseConfig && typeof firebaseConfig === 'object' && firebaseConfig.apiKey) {
      try {
        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const firebaseAuth = getAuth(app);
        setDb(firestore);
        setAuth(firebaseAuth);

        const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (user) => {
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
    } else {
      setFirebaseInitError("Firebase configuration is incomplete or invalid.");
      setIsAuthReady(true);
    }
  }, []);

  // Effect to handle real-time data fetching from Firestore once authenticated
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

  // Handler for login, passed to AuthPage
  const handleLogin = async (email, password) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
    }
  };

  // Handler for registration, passed to AuthPage
  const handleRegister = async (email, password) => {
    if (auth) {
      await createUserWithEmailAndPassword(auth, email, password);
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
        const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const goalsColRef = collection(db, 'artifacts', currentAppId, 'users', userId, 'goals');
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
        const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const goalDocRef = doc(db, 'artifacts', currentAppId, 'users', userId, 'goals', updatedGoal.id);
        await setDoc(goalDocRef, updatedGoal);
        setShowGoalForm(false);
        setEditingGoal(null);
      } catch (error) {
        console.error("Error updating goal:", error);
      }
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (db && userId && goalId) {
      try {
        const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const goalDocRef = doc(db, 'artifacts', currentAppId, 'users', userId, 'goals', goalId);
        await deleteDoc(goalDocRef);
        setShowModal(false);
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
          const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
          const goalDocRef = doc(db, 'artifacts', currentAppId, 'users', userId, 'goals', goalId);
          await setDoc(goalDocRef, { ...goalToUpdate, savedAmount: newSavedAmount });
        }
      } catch (error) {
        console.error("Error depositing into goal:", error);
      }
    }
  };

  // Function to show a custom confirmation modal
  const showConfirmationModal = (goalId, goalName) => {
    setModalContent({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the goal: ${goalName}? This action cannot be undone.`,
      onConfirm: () => handleDeleteGoal(goalId),
      onCancel: () => setShowModal(false),
      isDestructive: true,
    });
    setShowModal(true);
  };

  // Function to show a custom info/alert modal
  const showInfoModal = (title, message) => {
    setModalContent({
      title,
      message,
      onConfirm: () => setShowModal(false),
      onCancel: null,
      isDestructive: false,
    });
    setShowModal(true);
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

  // Custom Modal Component
  const CustomModal = () => {
    if (!showModal) return null;
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
        <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3 text-center">
            <h3 className={`text-lg leading-6 font-medium ${modalContent.isDestructive ? 'text-red-600' : 'text-gray-900'}`}>
              {modalContent.title}
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">
                {modalContent.message}
              </p>
            </div>
            <div className="items-center px-4 py-3">
              {modalContent.onConfirm && (
                <button
                  onClick={modalContent.onConfirm}
                  className={`px-4 py-2 ${modalContent.isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${modalContent.isDestructive ? 'red-500' : 'blue-500'}`}
                >
                  {modalContent.isDestructive ? 'Delete' : 'OK'}
                </button>
              )}
              {modalContent.onCancel && (
                <button
                  onClick={modalContent.onCancel}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="app-container">
      {!userId ? (
        <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <>
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
                onAlert={showInfoModal}
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
                        onDelete={showConfirmationModal}
                        onDeposit={handleDeposit}
                        onAlert={showInfoModal}
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
          <CustomModal />
        </>
      )}
    </div>
  );
};

export default App;
