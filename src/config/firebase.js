// src/config/firebase.js
// Firebase configuration

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase config - lấy từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDdjO9WSHHSU4MUI-EJIB4Ejkt-V1b4F08",
  authDomain: "fare-50123.firebaseapp.com",
  projectId: "fare-50123",
  storageBucket: "fare-50123.firebasestorage.app",
  messagingSenderId: "821723194841",
  appId: "1:821723194841:web:617d429032b05b4b1425c8",
  measurementId: "G-6LT7YG62T2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;