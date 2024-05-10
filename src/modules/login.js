//login.js
// Import the necessary functions from Firebase Authentication
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, nextTick } from 'vue';
import router from '../router'; // Import router from your Vue router setup

// Define the login function
export function login() {
  const email = ref('');
  const password = ref('');
  const isLoggedIn = ref(false);

  // Get the Auth instance
  const auth = getAuth();

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

  // Define the signUp function
  // Define the signUp function
/* const signUp = async (selectedRole) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Force refresh the user's token to ensure custom claims are updated
    await user.getIdToken(true);

    // Set custom claims based on the selected role
    await setCustomUserClaims(auth, user.uid, { admin: selectedRole === 'admin' });

    // Other sign-up logic, if any

    console.log('User signed up successfully:', user.uid);
  } catch (error) {
    console.error('Sign-up error:', error.message);
    // Handle Firebase Authentication errors
  }
}; */


  // Function to log in the user
  const logIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;

      // Set isLoggedIn to true after successful login
      isLoggedIn.value = true; // Update isLoggedIn value

      email.value = '';
      password.value = '';
      console.log('User logged in:', user.uid);
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
    
    logIn,
    isLoggedIn,
  };
}
