import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: These variables are provided by the hosting environment. Do not modify.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfig = typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : {};

// Initialize Firebase with the config from the environment
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, appId };