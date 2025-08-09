import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: These variables are provided by the hosting environment. Do not modify.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const firebaseConfigFromEnv = typeof __firebase_config !== "undefined" ? JSON.parse(__firebase_config) : null;

// The app will now use the configuration from the environment.
// This is the secure way to handle secrets and prevents them from being exposed on GitHub.
// For local development, you will need to manually provide a firebaseConfig object.
const app = initializeApp(firebaseConfigFromEnv);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, appId };
