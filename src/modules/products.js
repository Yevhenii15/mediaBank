// products.js

import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as storageRef, deleteObject, listAll, getMetadata } from 'firebase/storage';
import { getDoc } from 'firebase/firestore';
import { query, orderBy } from 'firebase/firestore';

const storage = getStorage(); // Initialize Firebase Storage

const useProducts = () => {
  const showUpdatePopup = ref(false); // State to show/hide the update popup
  const selectedLanguage = ref('');
  const errorMessage = ref('');
  const getProductById = async (productId) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = docSnap.data();
        productData.productImages = productData.productImages || [];
        productData.productFiles = productData.productFiles || [];
        productData.id = docSnap.id;
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
    const files = event.target.files;
    if (!selectedLanguage.value) {
      errorMessage.value = 'Please select a language before uploading a file.';
      return;
    }

    errorMessage.value = '';

    const promises = Array.from(files).map(async (file) => {
      try {
        const fileRef = storageRef(storage, `products/files/${file.name}`);

        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);

        const newFile = {
          url: downloadURL,
          language: selectedLanguage.value,
        };

        await updateDoc(doc(db, 'products', product.id), {
          productFiles: arrayUnion(newFile),
        });

        product.productFiles.push(newFile);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error uploading files:', error);
      errorMessage.value = 'Failed to upload some files. Please try again.';
    }
  };

  // Function to delete a file from Firebase Storage
  const deleteFile = async (product, index) => {
    console.log('Deleting file:', product, index); // Log the product and index
    if (index >= 0 && product.productFiles && product.productFiles.length > index) {
      const fileUrl = product.productFiles[index].url; // Adjusted to access the URL property
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
  const downloadFile = async (imageUrl) => {
    try {
      const imageRef = storageRef(storage, imageUrl); // Get the reference using the initialized storage
      const downloadUrl = await getDownloadURL(imageRef);

      // Fetch the image data as a blob
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image (${response.status} ${response.statusText})`);
      }

      const blob = await response.blob();

      // Extract filename without query parameters and duplicate extensions
      const filenameParts = imageUrl.split('/').pop().split('?')[0].replace('products%2Ffiles%2F', '').split('.');
      const filename = filenameParts.slice(0, -1).join('.');
      const extension = filenameParts.pop();
      const filenameWithExtension = `${filename}.${extension}`;


      // Create a blob URL for the image
      const blobUrl = URL.createObjectURL(blob);

      // Create a link element
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filenameWithExtension; // Set the filename correctly
      a.style.display = 'none'; // Hide the link
      document.body.appendChild(a);

      // Simulate a click event on the link
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
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
        const imageRef = storageRef(storage, `products/imgs/${file.name}`);
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
    const productsQuery = query(productDataRef, orderBy('createdAt', 'desc'));
    onSnapshot(productsQuery, (snapshot) => {
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
          createdAt: new Date(), // Add createdAt timestamp
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
          createdAt: new Date(), // Add createdAt timestamp
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
        showUpdatePopup.value = true; // Show the popup after successful update
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
    showUpdatePopup,
    selectedLanguage,
    errorMessage,
  };
};

export default useProducts;