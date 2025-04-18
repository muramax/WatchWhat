// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTegJ0nbuaCqAx9_FAGkc4DH_N5D3Q738",
  authDomain: "watchwhat-2190512.firebaseapp.com",
  projectId: "watchwhat-2190512",
  storageBucket: "watchwhat-2190512.firebasestorage.app",
  messagingSenderId: "281641424310",
  appId: "1:281641424310:web:e295575de09b6f33e85d17",
  measurementId: "G-DQ6FNVYG3Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const moviesRef = collection(db, "movies");
