import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: These variables are provided by the hosting environment. Do not modify.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig = typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};

let app;
let auth;
let db;

// Only initialize Firebase if the config object is not empty
if (Object.keys(firebaseConfig).length > 0) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    // These variables will remain undefined
  }
} else {
  console.warn("Firebase configuration is missing or empty. The app will run without Firebase services. Please ensure the hosting environment provides the __firebase_config variable.");
}

export { app, auth, db, appId };
