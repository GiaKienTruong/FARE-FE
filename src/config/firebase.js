// src/config/firebase.js
// Firebase configuration using compat mode for Expo Go compatibility
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDdjO9WSHHSU4MUI-EJIB4Ejkt-V1b4F08",
  authDomain: "fare-50123.firebaseapp.com",
  projectId: "fare-50123",
  storageBucket: "fare-50123.firebasestorage.app",
  messagingSenderId: "821723194841",
  appId: "1:821723194841:web:617d429032b05b4b1425c8",
  measurementId: "G-6LT7YG62T2"
};

// Initialize Firebase App (singleton pattern)
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
export default firebase;