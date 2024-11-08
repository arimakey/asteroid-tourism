import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAv87XwXYmQc8_9tmrPs4DcMMWbo_FvmIc",
  authDomain: "intelligent-turism-dc84f.firebaseapp.com",
  projectId: "intelligent-turism-dc84f",
  storageBucket: "intelligent-turism-dc84f.firebasestorage.app",
  messagingSenderId: "378313406327",
  appId: "1:378313406327:web:303d2a938b5ee2b0b69372"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

// Coleccion de datos donde se guardaran los usuarios
const useRef = collection(firestoreDB, "users");

export { app, firebaseAuth, firestoreDB, useRef };
