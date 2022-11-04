// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getEnvironments } from "../helpers/getEnvironments";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//const env = getEnvironments();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnvLWXzhAZUD87vi10FutZis1zwcDq4w4",
  authDomain: "react-journal-d2c9f.firebaseapp.com",
  projectId: "react-journal-d2c9f",
  storageBucket: "react-journal-d2c9f.appspot.com",
  messagingSenderId: "839421215317",
  appId: "1:839421215317:web:1be684273125972058cadc",
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
//esto lo tengo que agregar ****************************************
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getFirestore(FirebaseApp);
