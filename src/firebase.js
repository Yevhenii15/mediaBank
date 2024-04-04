// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <- needed for DB
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

export { db };

