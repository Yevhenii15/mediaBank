// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <- needed for DB
import { getStorage } from 'firebase/storage'; // <- needed for Storage
import { getAuth } from 'firebase/auth'; // <- needed for Authentication

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBl3bx4TX_wakNOpBFLdkmm8ahEgGULLz8",
  authDomain: "mediabank-518fe.firebaseapp.com",
  projectId: "mediabank-518fe",
  storageBucket: "mediabank-518fe.appspot.com",
  messagingSenderId: "388749683018",
  appId: "1:388749683018:web:cade4c7ff981d55ea8b9b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth }; // Export Firebase Functions along with other services