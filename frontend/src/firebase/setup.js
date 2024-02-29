import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAr71UJGqiDjZz0dAbkgCXJ0W9724hn3eo",
  authDomain: "esposito-6af25.firebaseapp.com",
  projectId: "esposito-6af25",
  storageBucket: "esposito-6af25.appspot.com",
  messagingSenderId: "686045524952",
  appId: "1:686045524952:web:d2fe939462b11dfbd3f8ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);