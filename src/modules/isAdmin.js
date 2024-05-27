import { getFirestore, doc, getDoc } from 'firebase/firestore';

const isAdmin = async (uid) => {
  try {
    const firestore = getFirestore();
    const userDocRef = doc(firestore, 'users', uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData.role === 'admin';
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

export default isAdmin;
