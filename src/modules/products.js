import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as storageRef, deleteObject } from 'firebase/storage';

const useProducts = () => {

  // Function to upload images to Firebase Storage
  const handleImageUpload = async (event, product) => {
    // Get the file and storage references
    const storage = getStorage();
    const files = event.target.files;
    // Check if there are any files
    if (!files.length) return;

    try {
      // Upload all the images to Firebase Storage and get their download URLs
      const imagePromises = Array.from(files).map(async (file) => {
        const imageRef = storageRef(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      });
      // Wait for all the image uploads to complete
      const imageUrls = await Promise.all(imagePromises);
      // Add the image URLs to the product or addProductData
      if (product) {
        // If a product is provided, add images to the product
        if (!Array.isArray(product.productImages)) {
          product.productImages = [];
        }
        // Add the image URLs to the product
        product.productImages.push(...imageUrls);

        // Update the product in Firestore with the new images
        await updateDoc(doc(db, 'products', product.id), {
          productImages: product.productImages, // Updated array of image URLs
        });
      } else {
        // If no product is provided, update the addProductData
        if (!Array.isArray(addProductData.value.productImages)) {
          addProductData.value.productImages = [];
        }
        addProductData.value.productImages.push(...imageUrls);
      }

      // Reset the input field
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading the images:', error);
    }
  };

  // Function to delete an image from Firebase Storage
  const deleteImage = async (product, index) => {
    // Check if the index is valid
    if (index >= 0 && product.productImages && product.productImages.length > index) {
      // Get the URL of the image to be deleted
      const imageUrl = product.productImages[index];

      try {
        // Delete the image from Firestore
        const storage = getStorage();
        const imageRef = storageRef(storage, imageUrl);

        // Attempt to delete the image from storage
        await deleteObject(imageRef);

        // Remove the image URL from the product's array
        product.productImages.splice(index, 1);

        // Update the product in Firestore to reflect the changes
        await updateProductInFirestore(product);

        // console.log('Image deleted!');
      } catch (error) {
        console.error('Error deleting the image:', error);
      }
    } else {
      console.error('Invalid index or image URLs not found.');
    }
  };
  const updateProductInFirestore = async (product) => {
    try {
      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, product);
      console.log('Product updated successfully in Firestore');
    } catch (error) {
      console.error('Error updating product in Firestore:', error);
      throw error; // Rethrow the error to handle it in the calling function if necessary
    }
  };


  // Get the products data from Firestore
  const products = ref([]);
  const productDataRef = collection(db, 'products');
  const getProductsData = () => {
    onSnapshot(productDataRef, (snapshot) => {
      products.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          isEditing: false,
        };
      });
    });
  };
  // Add product data
  const addProductData = ref({
    productName: '',
    productDescription: '',
    productImages: [], // Initialize as an empty array
  });

  // Add a product to Firestore
  const firebaseAddSingleItem = async () => {
    // Check if the product name, price, and in stock fields are not empty
    if (addProductData.value) {
      // Add the product to Firestore
      await addDoc(collection(db, 'products'), {
        productName: addProductData.value.productName,
        productDescription: addProductData.value.productDescription,
        productImages: addProductData.value.productImages, // Use the array of image URLs
      }).then(() => {
        // Reset other fields and the image URLs
        addProductData.value.productName = '';
        addProductData.value.productDescription = '';
        addProductData.value.productImages = []; // Reset the image URLs

        // Reset the input field
        const inputElement = document.getElementById('imageInput');
        if (inputElement) {
          inputElement.value = '';
        }
      });
      // console.log('Item added!');
    }
  };

  // Update a product in Firestore
  const firebaseUpdateSingleItem = async (product) => {
    if (addProductData && addProductData.value) {
      const updateData = {
        productName: product.productName,
        productDescription: product.productDescription,
      };

      // Check if the productImages array is empty or undefined
      if (Array.isArray(product.productImages) && product.productImages.length > 0) {
        updateData.productImages = product.productImages; // Use the array of image URLs
      }
      // Update the product in Firestore
      await updateDoc(doc(productDataRef, product.id), updateData).then(() => {
        product.isEditing = false;
        const inputElement = document.getElementById('imageInputUpdate');
        if (inputElement) {
          inputElement.value = '';
        }
      });
    }
  };

  // Delete a product from Firestore
  const firebaseDeleteSingleItem = async (id) => {
    try {
      // Get the product from the products array
      const product = products.value.find((item) => item.id === id);
      if (!product) {
        console.error('Product not found.');
        return;
      }

      // Delete the product images from Firebase Storage
      const storage = getStorage();
      // Loop through the image URLs and delete them
      for (const imageUrl of product.productImages) {
        const imageRef = storageRef(storage, imageUrl);
        await deleteObject(imageRef);
      }

      // Delete the product document from Firestore
      await deleteDoc(doc(db, 'products', id));
      // console.log('Item deleted!');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  return {
    getProductsData,
    products,
    firebaseDeleteSingleItem,
    firebaseAddSingleItem,
    addProductData,
    firebaseUpdateSingleItem,
    deleteImage,
    handleImageUpload,
  };
};

export default useProducts;