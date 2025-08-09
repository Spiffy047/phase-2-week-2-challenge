import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/AuthPage";
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
  addDoc,
} from "firebase/firestore";

// A custom modal component to display alerts, to avoid using window.alert
const AlertModal = ({ title, message, onClose }) => {
  if (!message) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>{title}</h4>
        <p>{message}</p>
        <button onClick={onClose} className="btn-primary">
          OK
        </button>
      </div>
    </div>
  );
};

function App() {
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);

  // Sign in with custom token or anonymously
  useEffect(() => {
    const signInWithToken = async () => {
      try {
        const initialAuthToken = typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error signing in with custom token:", error);
      }
    };
    signInWithToken();
  }, []);

  // Listen for authentication state changes and fetch goals
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setUserId(currentUser ? currentUser.uid : null);
      if (currentUser) {
        const userId = currentUser.uid;
        // Start listening for goal data
        const goalsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/goals`);
        const unsubscribeGoals = onSnapshot(goalsCollectionRef, (snapshot) => {
          const fetchedGoals = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGoals(fetchedGoals);
          setLoading(false);
        });
        return () => unsubscribeGoals(); // Cleanup goals listener
      } else {
        setGoals([]); // Clear goals if no user is logged in
        setLoading(false);
      }
      setLoading(false);
    });
    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);

  const onShowAlert = (title, message) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent({ title: "", message: "" });
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

  const addGoal = async (newGoal) => {
    try {
      if (userId) {
        await addDoc(collection(db, `artifacts/${appId}/users/${userId}/goals`), newGoal);
        onShowAlert("Success", `Goal "${newGoal.name}" added successfully.`);
      }
    } catch (error) {
      console.error("Error adding goal:", error);
      onShowAlert("Error", "Failed to add new goal.");
    }
  };

  const updateGoal = async (id, updatedGoal) => {
    try {
      if (userId) {
        const goalDocRef = doc(db, `artifacts/${appId}/users/${userId}/goals`, id);
        await updateDoc(goalDocRef, updatedGoal);
        onShowAlert("Success", `Goal "${updatedGoal.name}" updated successfully.`);
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      onShowAlert("Error", "Failed to update goal.");
    }
  };

  const deleteGoal = async (id, name) => {
    try {
      if (userId) {
        const goalDocRef = doc(db, `artifacts/${appId}/users/${userId}/goals`, id);
        await deleteDoc(goalDocRef);
        onShowAlert("Success", `Goal "${name}" deleted successfully.`);
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      onShowAlert("Error", "Failed to delete goal.");
    }
  };

  const depositToGoal = async (goalId, amount) => {
    try {
      if (userId) {
        const goalDocRef = doc(db, `artifacts/${appId}/users/${userId}/goals`, goalId);
        const goalDoc = await getDoc(goalDocRef);
        if (goalDoc.exists()) {
          const currentData = goalDoc.data();
          const updatedSavedAmount = (Number(currentData.savedAmount) || 0) + amount;
          await updateDoc(goalDocRef, {
            savedAmount: updatedSavedAmount,
          });
          onShowAlert("Success", `KSh ${amount} deposited to goal.`);
        } else {
          onShowAlert("Error", "Goal not found.");
        }
      }
    } catch (error) {
      console.error("Error making deposit:", error);
      onShowAlert("Error", "Failed to make deposit.");
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
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="main-content-wrapper">
        {renderContent()}
      </main>
      <AlertModal
        title={modalContent.title}
        message={modalContent.message}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;