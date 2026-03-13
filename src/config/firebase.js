// src/config/firebase.js
// Firebase configuration using compat mode for Expo Go compatibility
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDvNpA39AauhKe0TcCs7trSx4S1Yhugb-w",
  authDomain: "fare-7660d.firebaseapp.com",
  projectId: "fare-7660d",
  storageBucket: "fare-7660d.firebasestorage.app",
  messagingSenderId: "913827441701",
  appId: "1:913827441701:web:fa7bd61174e30a0d7423cc",
  measurementId: "G-2Z71HLMQ6L"
};

// Initialize Firebase App (singleton pattern)
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export { auth };
export default firebase;