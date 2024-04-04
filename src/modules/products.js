import { db } from '../firebase.js'
import { ref } from 'vue'
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore'

const useProducts = () => {
  const products = ref([])  // to store data from Firebase
  const productDataRef = collection(db, 'products')

  const addProductData = ref({
    productName: '',
    productPrice: ''
  })

  const updateProductData = ref({
    productName: '',
    productPrice: ''
  });
  
/*   const initializeProductUpdateData = (product) => {
    product.updateProductData = {
      productName: '',
      productPrice: ''
    }
  } */

  const getProductsData = () => {
    onSnapshot(productDataRef, (snapshot) => {
      products.value = snapshot.docs.map(doc => {
        const product = {
          id: doc.id,
          ...doc.data()
        }
        // initializeProductUpdateData(product) // Initialize updateProductData for each product
        return product
      })
    })
  }

  const firebaseDeleteSingleItem = async (id) => {
    await deleteDoc(doc(db, 'products', id))
    console.log('Item deleted!', id)
  }

  const firebaseAddSingleItem = async () => {
    await addDoc(collection(db, 'products'), {
      productName: addProductData.value.productName,
      productPrice: addProductData.value.productPrice,
    }).then(() => {
      addProductData.value.productName = ''
      addProductData.value.productPrice = ''
    })
    console.log('Item added!')
  }

  const firebaseUpdateSingleItem = async (product) => {
    await updateDoc(doc(productDataRef, product), {
      productName: products.value.find(product => product.id === product.id).productName,
      productPrice: products.value.find(product => product.id === product.id).productPrice
     // productName: product.updateProductData.productName,
     // productPrice: product.updateProductData.productPrice,
    }).then(() => {
    //  product.updateProductData.productName = ''
  //product.updateProductData.productPrice = ''
  updateProductData.value.productName = '';
  updateProductData.value.productPrice = '';
    })
  }

  return {
    getProductsData,
    products,
    firebaseDeleteSingleItem,
    firebaseAddSingleItem,
    addProductData,
    firebaseUpdateSingleItem,
    updateProductData
    /* initializeProductUpdateData */
  }
}

export default useProducts