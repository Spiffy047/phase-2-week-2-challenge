import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// IMPORTANT: The following variables are automatically provided in the Canvas environment.
// For local development, you should replace the placeholder with your own Firebase project configuration.
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// Your web app's Firebase configuration.
// Replace these with the configuration for your specific project.
const firebaseConfig = {
    apiKey: "AIzaSyDzoILYwextDqGj1gkLmzVMFpvIRVC04lk",
    authDomain: "smart-5321a.firebaseapp.com",
    projectId: "smart-5321a",
    storageBucket: "smart-5321a.firebasestorage.app",
    messagingSenderId: "401027865806",
    appId: "1:401027865806:web:36af1f89c71e1cf84b449f",
    measurementId: "G-JWY4SD5THE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, appId };
