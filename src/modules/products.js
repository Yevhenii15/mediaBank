// Import the functions you need from the SDKs you need
import { ref, onMounted } from 'vue';
import { db } from '../firebase';
import { collection, onSnapshot } from "firebase/firestore";


const useProducts = () => {
    
  const products = ref([]);

  const getProductsDate = () => {
    const productDataRef = collection(db, 'products');
    onSnapshot(productDataRef, (snapshot) => {
      products.value = snapshot.docs.map(doc => { 
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      console.log("test", products.value);
    });
  };

  onMounted(getProductsDate);

  return {
    products
  };
};

export default useProducts;
