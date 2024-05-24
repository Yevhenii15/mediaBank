/* login.js */
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, nextTick } from 'vue';
import router from '../router';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { deleteUser as deleteAuthUser } from 'firebase/auth';

export default function login() {
  const email = ref('');
  const password = ref('');
  const isLoggedIn = ref(false);
  const errorMessage = ref('');

  const auth = getAuth();
  const firestore = getFirestore();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User:', user);
      isLoggedIn.value = true;
    } else {
      console.log('No user signed in.');
      isLoggedIn.value = false;
    }
  });

  const signUp = async (email, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const usersCollection = collection(firestore, 'users');

      await setDoc(doc(usersCollection, user.uid), {
        email: user.email,
        role: role,
      });

      console.log('User signed up and data stored in Firestore');
    } catch (error) {
      errorMessage.value = 'Try another email or password!';
      console.error('Error signing up:', error);
    }
  };
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
      errorMessage.value = 'Incorrect password or email. Please try again.';
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
  const deleteUser = async (uid) => {
    try {
      const user = auth.currentUser;
      
      // Delete user from Firebase Authentication
      await deleteAuthUser(user);
  
      // Delete user document from Firestore
      await deleteDoc(doc(collection(firestore, 'users'), uid));
      
      console.log('User deleted successfully from Firebase Authentication and Firestore.');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Error deleting user');
    }
  };
  
  

  const fetchAllUsers = async () => {
    try {
      const usersCollection = collection(firestore, 'users');
      const userDocs = await getDocs(usersCollection);
      const users = [];
      userDocs.forEach((doc) => {
        users.push(doc.data());
      });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    }
  };

  return {
    signUp,
    logIn,
    logOut,
    fetchAllUsers,
    email,
    password,
    isLoggedIn,
    errorMessage,
    deleteUser
  };
}
