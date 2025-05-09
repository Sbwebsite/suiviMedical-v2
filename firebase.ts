// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQIAynr9vZqngdKYR76-zEUHSkvE3iMM0",
  authDomain: "suivimedical-5d92a.firebaseapp.com",
  projectId: "suivimedical-5d92a",
  storageBucket: "suivimedical-5d92a.firebasestorage.app",
  messagingSenderId: "222526010927",
  appId: "1:222526010927:web:8d96f507da15b662e378da"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };