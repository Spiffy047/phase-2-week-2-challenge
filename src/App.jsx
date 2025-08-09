import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/AuthPage";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import { auth, db, appId } from "./components/firebaseConfig";
import { onAuthStateChanged, signInWithCustomToken, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  const [loading, setLoading] = useState(true);

  // Function to show custom alert modal
  const onShowAlert = (title, message, onConfirm = null, onCancel = null) => {
    setModalContent({ title, message, onConfirm, onCancel });
    setIsModalOpen(true);
  };

  // Function to close custom alert modal
  const onHandleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent({ title: "", message: "", onConfirm: null, onCancel: null });
  };
  
  // Set up auth state listener and sign in with custom token
  useEffect(() => {
    // Check if auth is defined before attempting any auth operations
    if (!auth) {
      console.warn("Firebase authentication is not available. Skipping auth setup.");
      setLoading(false);
      return;
    }

    const signInUser = async () => {
      try {
        if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error signing in with custom token:", error);
        onShowAlert("Error", error.message);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserId(currentUser.uid);
      } else {
        setUser(null);
        setUserId(null);
      }
      setLoading(false);
    });
    
    signInUser();

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Fetch goals when user is authenticated
  useEffect(() => {
    // Check if db and userId are defined before attempting to fetch goals
    if (!db || !userId) {
      setGoals([]);
      return;
    }

    const goalsCollectionRef = collection(db, "artifacts", appId, "users", userId, "goals");
    const q = query(goalsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const goalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsData);
    }, (error) => {
      console.error("Error fetching goals:", error);
      onShowAlert("Error", "Failed to fetch goals. Please try again.");
    });

    return () => unsubscribe();
  }, [userId]);

  const handleLogin = async (email, password) => {
    if (!auth) {
      onShowAlert("Error", "Firebase services are not available.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onShowAlert("Success", "Logged in successfully!");
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (email, password) => {
    if (!auth) {
      onShowAlert("Error", "Firebase services are not available.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onShowAlert("Success", "Account created successfully!");
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    if (!auth) {
      onShowAlert("Error", "Firebase services are not available.");
      return;
    }
    try {
      await signOut(auth);
      onShowAlert("Signed Out", "You have been logged out.");
    } catch (error) {
      console.error("Error signing out:", error);
      onShowAlert("Error", "Failed to sign out.");
    }
  };

  // CRUD Operations
  const addGoal = async (goalData) => {
    if (!db || !userId) {
      onShowAlert("Error", "You must be signed in to add goals.");
      return;
    }
    try {
      const goalsCollectionRef = collection(db, "artifacts", appId, "users", userId, "goals");
      await setDoc(doc(goalsCollectionRef), {
        ...goalData,
        savedAmount: parseFloat(goalData.savedAmount) || 0,
        targetAmount: parseFloat(goalData.targetAmount),
      });
      onShowAlert("Success", `Goal "${goalData.name}" added successfully.`);
    } catch (e) {
      console.error("Error adding document: ", e);
      onShowAlert("Error", "Failed to add goal. Please try again.");
    }
  };

  const updateGoal = async (id, updatedGoalData) => {
    if (!db || !userId) {
      onShowAlert("Error", "You must be signed in to update goals.");
      return;
    }
    try {
      const goalDocRef = doc(db, "artifacts", appId, "users", userId, "goals", id);
      await updateDoc(goalDocRef, {
        ...updatedGoalData,
        savedAmount: parseFloat(updatedGoalData.savedAmount),
        targetAmount: parseFloat(updatedGoalData.targetAmount),
      });
      onShowAlert("Success", "Goal updated successfully.");
    } catch (e) {
      console.error("Error updating document: ", e);
      onShowAlert("Error", "Failed to update goal. Please try again.");
    }
  };

  const deleteGoal = async (id) => {
    if (!db || !userId) {
      onShowAlert("Error", "You must be signed in to delete goals.");
      return;
    }
    try {
      await deleteDoc(doc(db, "artifacts", appId, "users", userId, "goals", id));
      onShowAlert("Success", "Goal deleted successfully.");
    } catch (e) {
      console.error("Error deleting document: ", e);
      onShowAlert("Error", "Failed to delete goal. Please try again.");
    }
  };

  const depositToGoal = async (id, amount) => {
    if (!db || !userId) {
      onShowAlert("Error", "You must be signed in to make a deposit.");
      return;
    }
    try {
      const goalDocRef = doc(db, "artifacts", appId, "users", userId, "goals", id);
      const goalDocSnap = await getDoc(goalDocRef);

      if (goalDocSnap.exists()) {
        const currentSavedAmount = parseFloat(goalDocSnap.data().savedAmount);
        const newSavedAmount = currentSavedAmount + parseFloat(amount);
        await updateDoc(goalDocRef, { savedAmount: newSavedAmount });
        onShowAlert("Success", `KSh ${amount} deposited to goal.`);
      }
    } catch (e) {
      console.error("Error making deposit: ", e);
      onShowAlert("Error", "Failed to deposit. Please try again.");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      );
    }
    
    return user ? (
      <Dashboard
        goals={goals}
        addGoal={addGoal}
        updateGoal={updateGoal}
        deleteGoal={deleteGoal}
        depositToGoal={depositToGoal}
        userId={userId}
        onAlert={onShowAlert}
      />
    ) : (
      <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
    );
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="main-content-wrapper">
        {renderContent()}
      </div>
      {isModalOpen && (
        <AuthModal
          title={modalContent.title}
          message={modalContent.message}
          onClose={onHandleCloseModal}
          onConfirm={modalContent.onConfirm}
          onCancel={modalContent.onCancel}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
