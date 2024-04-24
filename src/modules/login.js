// login.js

// Import necessary modules and dependencies
import { nextTick, ref } from 'vue';
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { auth } from '../firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import router from '../router/index.js';
// Define the login function
export function login() {
  const email = ref('');
  const password = ref('');
  const role = ref('user'); // Default role is user
  const isLoggedIn = ref(false);

  // Listen for changes to the user's authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, you can access the custom claims here
      console.log('User:', user);
      // Update isLoggedIn to true when user is logged in
      isLoggedIn.value = true;
    } else {
      // No user is signed in
      console.log('No user signed in.');
      // Update isLoggedIn to false when user is logged out
      isLoggedIn.value = false;
    }
  });
  const signUp = async (selectedRole) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
  
      // Force refresh the user's token to get the latest custom claims
      await user.getIdTokenResult(true);
  
      console.log('User signed up:', user.uid);
      console.log('Role:', selectedRole);
      console.log('User Custom Claims:', user.customClaims);
  
      email.value = '';
      password.value = '';
    } catch (error) {
      console.error('Sign-up error:', error.message);
    }
  };
  
  

  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
  
      // No need to check for admin role here, it should be handled server-side
  
      // Set isLoggedIn to true after successful login
      isLoggedIn.value = true; // Update isLoggedIn value
  
      email.value = '';
      password.value = '';
      console.log(`User logged in as ${role.value}:`, user.uid);
      // send user to the homepage
      nextTick(() => {
        // Redirect the user to the homepage
        router.push('/');
      });

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
        nextTick(() => {
          // Redirect the user to the homepage
          router.push('/login');
        });
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
    logIn,
    isLoggedIn,
  };
}
