import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/AuthPage";
import AuthModal from "./components/AuthModal";
import { auth, db, appId } from "./components/firebaseConfig"; // <-- Updated import
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
  const [currentView, setCurrentView] = useState("landing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  const [loading, setLoading] = useState(true);

  // Sign in with custom token provided by the environment
  useEffect(() => {
    const signInWithToken = async () => {
      try {
        if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      } finally {
        setLoading(false);
      }
    };

    signInWithToken();
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserId(currentUser.uid);
        setCurrentView("dashboard");
      } else {
        setUserId(null);
        setCurrentView("landing");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // Firestore listener for goals
  useEffect(() => {
    if (userId) {
      const q = query(collection(db, "artifacts", appId, "users", userId, "goals"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const goalsArray = [];
        querySnapshot.forEach((doc) => {
          goalsArray.push({ id: doc.id, ...doc.data() });
        });
        setGoals(goalsArray);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const onShowAlert = (title, message) => {
    setModalContent({
      title,
      message,
      onConfirm: () => setIsModalOpen(false),
      onCancel: null,
    });
    setIsModalOpen(true);
  };

  const onShowConfirm = (title, message, onConfirm) => {
    setModalContent({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setIsModalOpen(false);
      },
      onCancel: () => setIsModalOpen(false),
    });
    setIsModalOpen(true);
  };

  const addGoal = async (newGoal) => {
    if (!userId) {
      onShowAlert("Authentication Error", "You must be signed in to add goals.");
      return;
    }
    try {
      await setDoc(doc(db, "artifacts", appId, "users", userId, "goals", crypto.randomUUID()), newGoal);
      onShowAlert("Success", "Goal added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      onShowAlert("Error", "Failed to add goal.");
    }
  };

  const updateGoal = async (id, updatedGoal) => {
    if (!userId) {
      onShowAlert("Authentication Error", "You must be signed in to update goals.");
      return;
    }
    try {
      const goalRef = doc(db, "artifacts", appId, "users", userId, "goals", id);
      await updateDoc(goalRef, updatedGoal);
      onShowAlert("Success", "Goal updated successfully!");
    } catch (e) {
      console.error("Error updating document: ", e);
      onShowAlert("Error", "Failed to update goal.");
    }
  };

  const deleteGoal = (id, name) => {
    if (!userId) {
      onShowAlert("Authentication Error", "You must be signed in to delete goals.");
      return;
    }
    onShowConfirm(
      "Confirm Deletion",
      `Are you sure you want to delete the goal "${name}"? This action cannot be undone.`,
      async () => {
        try {
          await deleteDoc(doc(db, "artifacts", appId, "users", userId, "goals", id));
          onShowAlert("Success", "Goal deleted successfully!");
        } catch (e) {
          console.error("Error deleting document: ", e);
          onShowAlert("Error", "Failed to delete goal.");
        }
      }
    );
  };

  const depositToGoal = async (id, amount) => {
    if (!userId) {
      onShowAlert("Authentication Error", "You must be signed in to make a deposit.");
      return;
    }
    try {
      const goalRef = doc(db, "artifacts", appId, "users", userId, "goals", id);
      const goalSnap = await getDoc(goalRef);

      if (goalSnap.exists()) {
        const currentSaved = goalSnap.data().savedAmount || 0;
        const newSavedAmount = parseFloat(currentSaved) + parseFloat(amount);
        await updateDoc(goalRef, { savedAmount: newSavedAmount });
        onShowAlert("Success", `KSh ${newSavedAmount.toFixed(2)} deposited to goal.`);
      }
    } catch (e) {
      console.error("Error depositing to goal: ", e);
      onShowAlert("Error", "Failed to make deposit.");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onShowAlert("Success", "You have successfully logged in!");
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onShowAlert("Success", "Account created successfully!");
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onShowAlert("Signed Out", "You have been logged out.");
    } catch (error) {
      console.error("Error signing out:", error);
      onShowAlert("Error", "Failed to sign out.");
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
    if (user) {
      return (
        <Dashboard
          goals={goals}
          addGoal={addGoal}
          updateGoal={updateGoal}
          deleteGoal={deleteGoal}
          depositToGoal={depositToGoal}
          userId={userId}
          onAlert={onShowAlert}
          onDelete={deleteGoal}
        />
      );
    }
    if (currentView === "landing") {
      return <LandingPage onSignInClick={() => setCurrentView("auth")} onSignUpClick={() => setCurrentView("auth")} />;
    }
    if (currentView === "auth") {
      return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
    }
    return null;
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} onHomeClick={() => setCurrentView("landing")} />
      {renderContent()}
      {isModalOpen && <AuthModal {...modalContent} />}
    </div>
  );
}

export default App;
