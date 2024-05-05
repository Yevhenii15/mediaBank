// products.js

import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as storageRef, deleteObject, listAll, getMetadata } from 'firebase/storage';
import { getDoc } from 'firebase/firestore';

const useProducts = () => {
  const getProductById = async (productId) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Initialize product with an empty array for productImages
        const productData = docSnap.data();
        productData.productImages = productData.productImages || [];
        productData.id = docSnap.id; // Assign the document ID to the product object
        console.log('Retrieved product:', productData); // Log the retrieved product object
        return productData;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };



  // Function to upload files to Firebase Storage
  const handleFileUpload = async (event, product) => {
    const storage = getStorage();
    const files = event.target.files;

    if (!files.length) return;

    try {
      const filePromises = Array.from(files).map(async (file) => {
        const fileRef = storageRef(storage, `products/files/${file.name}`);
        await uploadBytes(fileRef, file);
        return getDownloadURL(fileRef);
      });

      const fileUrls = await Promise.all(filePromises);

      if (product) {
        if (!Array.isArray(product.productFiles)) {
          product.productFiles = [];
        }
        product.productFiles.push(...fileUrls);

        await updateProductInFirestore(product);
      } else {
        if (!Array.isArray(addProductData.value.productFiles)) {
          addProductData.value.productFiles = [];
        }
        addProductData.value.productFiles.push(...fileUrls);
      }

      event.target.value = '';
    } catch (error) {
      console.error('Error uploading the files:', error);
    }
  };

  // Function to delete a file from Firebase Storage
  const deleteFile = async (product, index) => {
    console.log('Deleting file:', product, index); // Log the product and index
    if (index >= 0 && product.productFiles && product.productFiles.length > index) {
      const fileUrl = product.productFiles[index];
      try {
        const storage = getStorage();
        const fileRef = storageRef(storage, fileUrl);
        await deleteObject(fileRef);
        product.productFiles.splice(index, 1);
        await updateProductInFirestore(product);
        console.log('File deleted:', fileUrl);
      } catch (error) {
        console.error('Error deleting the file:', error);
      }
    } else {
      console.error('Invalid index or file URLs not found.');
      console.log('Product:', product);
      console.log('Index:', index);
      console.log('Product files:', product.productFiles);
    }
  };


  // Function to download files from Firebase Storage
  const downloadFile = async (fileUrl) => {
    try {
      const storage = getStorage();
      const fileRef = storageRef(storage, fileUrl);

      const url = await getDownloadURL(fileRef);

      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log('File downloaded successfully!');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

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
        const imageRef = storageRef(storage, `products/imgs/${Date.now()}_${file.name}`);
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

        console.log('Image deleted!');
      } catch (error) {
        console.error('Error deleting the image:', error);
        // Handle the error gracefully
        // For example, you can log the error and still proceed with updating the UI
        // Or you can show a user-friendly message to the user
      }
    } else {
      console.error('Invalid index or image URLs not found.');
    }
  };

  const updateProductInFirestore = async (product) => {
    try {
      if (!product.id) {
        throw new Error('Product ID is missing.');
      }

      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, product);
      console.log('Product updated successfully in Firestore');
    } catch (error) {
      console.error('Error updating product in Firestore:', error);
      throw error;
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
    productType: '', // New property to store the selected product type
    productFiles: [],
    productImages: [],

  });



  // Add a product to Firestore
  const firebaseAddSingleItem = async () => {
    if (
      addProductData.value.productName &&
      addProductData.value.productDescription &&
      addProductData.value.productType &&
      addProductData.value.productImages.length > 0 // Only check if images are added
    ) {
      try {
        const productData = {
          productName: addProductData.value.productName,
          productDescription: addProductData.value.productDescription,
          productType: addProductData.value.productType,
          productFiles: addProductData.value.productFiles, // Include product files
          productImages: addProductData.value.productImages, // Include product images
        };

        await addDoc(collection(db, 'products'), productData);

        // Reset fields after adding
        addProductData.value.productName = '';
        addProductData.value.productDescription = '';
        addProductData.value.productType = '';
        addProductData.value.productFiles = [];
        addProductData.value.productImages = [];

        console.log('Product added successfully!');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      try {
        const productData = {
          productName: addProductData.value.productName,
          productDescription: addProductData.value.productDescription,
          productType: addProductData.value.productType,
          productImages: addProductData.value.productImages, // Include product images only
        };

        await addDoc(collection(db, 'products'), productData);

        // Reset fields after adding
        addProductData.value.productName = '';
        addProductData.value.productDescription = '';
        addProductData.value.productType = '';
        addProductData.value.productImages = [];

        console.log('Product added successfully without files!');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  // Update a product in Firestore
  const firebaseUpdateSingleItem = async (product, newProductName, newProductDescription) => {
    if (product.id) {
      try {
        // Update the product object with new name and description
        product.productName = newProductName;
        product.productDescription = newProductDescription;

        // Construct the updateData object with updated values
        const updateData = {
          productName: product.productName,
          productDescription: product.productDescription,
          productType: product.productType,
          productFiles: product.productFiles,
          productImages: product.productImages,
        };

        // Update the document in Firestore with the updated data
        await updateDoc(doc(db, 'products', product.id), updateData);

        console.log('Product updated successfully!');
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      console.error('Product ID is missing.');
    }
  };





  // Delete a product from Firestore and associated images/files from Firebase Storage
  const firebaseDeleteSingleItem = async (id, product) => {
    try {
      // Delete the product from Firestore
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);

      // Delete associated images from Firebase Storage
      if (product && product.productImages) {
        const storage = getStorage();
        for (const imageUrl of product.productImages) {
          const imageRef = storageRef(storage, imageUrl);
          await deleteObject(imageRef);
          console.log('Image deleted:', imageUrl);
        }
      }

      // Delete associated files from Firebase Storage
      if (product && product.productFiles) {
        const storage = getStorage();
        for (const fileUrl of product.productFiles) {
          const fileRef = storageRef(storage, fileUrl);
          await deleteObject(fileRef);
          console.log('File deleted:', fileUrl);
        }
      }

      console.log('Product and associated files deleted successfully!');
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
    downloadFile,
    deleteFile,
    handleFileUpload,
    getProductById,
  };
};

export default useProducts;