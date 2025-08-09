import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
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
  const [currentView, setCurrentView] = useState("landing");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  const [loading, setLoading] = useState(true);

  // Set up auth state listener and sign in with custom token
  useEffect(() => {
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
        setCurrentView("dashboard");
      } else {
        setUser(null);
        setUserId(null);
        setCurrentView("landing");
      }
      setLoading(false);
    });
    
    // Check if the auth instance is ready before attempting sign in
    if (auth) {
        signInUser();
    }

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  // Fetch goals when user is authenticated
  useEffect(() => {
    if (userId) {
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
    } else {
      setGoals([]);
    }
  }, [userId]);

  const onShowAlert = (title, message, onConfirm = null, onCancel = null) => {
    setModalContent({ title, message, onConfirm, onCancel });
    setIsModalOpen(true);
  };

  const onHandleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent({ title: "", message: "", onConfirm: null, onCancel: null });
  };

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onShowAlert("Success", "Logged in successfully!");
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

  // CRUD Operations
  const addGoal = async (goalData) => {
    if (userId) {
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
    } else {
      onShowAlert("Error", "You must be signed in to add goals.");
    }
  };

  const updateGoal = async (id, updatedGoalData) => {
    if (userId) {
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
    } else {
      onShowAlert("Error", "You must be signed in to update goals.");
    }
  };

  const deleteGoal = async (id) => {
    if (userId) {
      try {
        await deleteDoc(doc(db, "artifacts", appId, "users", userId, "goals", id));
        onShowAlert("Success", "Goal deleted successfully.");
      } catch (e) {
        console.error("Error deleting document: ", e);
        onShowAlert("Error", "Failed to delete goal. Please try again.");
      }
    } else {
      onShowAlert("Error", "You must be signed in to delete goals.");
    }
  };

  const depositToGoal = async (id, amount) => {
    if (userId) {
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
    } else {
      onShowAlert("Error", "You must be signed in to make a deposit.");
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
