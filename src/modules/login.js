/* login.js */
// Import necessary modules and dependencies
import { ref } from 'vue';
import {  signOut } from 'firebase/auth'; // Import functions for logging in and out
import { auth } from '../firebase.js'; // Import both auth and db
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Define the login function
export function login() {

  // Define reactive variables for user input
  const email = ref(''); 
  const password = ref('');


  // Function to sign up the user
  let signUp = async () => {
    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
      // Reset input fields
      email.value = '';
      password.value = '';
      console.log('User signed up:', user.uid);
      // Success
    } catch (error) {
      console.error('Sign-up error:', error.message);
    }
  };
  

  
  // Function to log in the user
    const logIn = async () => {
        try {
        // Attempt to sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        // Reset input fields
        email.value = '';
        password.value = '';
        console.log('User logged in:', user.uid);
        // Success
        } catch (error) {
        console.error('Sign-in error:', error.message);
        }
    };

  // Function to log out the user
  const logOut = async () => {
    try {
      if (auth.currentUser) {
        // Attempt to sign out the user
        await signOut(auth);
        console.log('User logged out.');
      } else {
        console.error('No user is authenticated. Unable to log out.');
      }
    } catch (error) {
      console.error('Firestore operation error:', error);
      // Handle the error or log additional information as needed
    }
  };



  // Return the reactive variables and functions for use in the Vue component
  return {
    logOut,
    email,
    password,
    signUp,
    logIn
  };
}
