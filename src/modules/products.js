import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { getDoc } from 'firebase/firestore';
import { query, orderBy } from 'firebase/firestore';
import { useRouter } from 'vue-router';


const storage = getStorage();

const useProducts = () => {

  const router = useRouter();

  const showUpdatePopup = ref(false);
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


  const downloadFile = async (mediaUrl) => {
    try {
      const mediaRef = storageRef(storage, mediaUrl);
      const downloadUrl = await getDownloadURL(mediaRef);

      // Fetch the media data as a blob
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch media (${response.status} ${response.statusText})`);
      }

      const blob = await response.blob();

      // Extract filename without query parameters and duplicate extensions
      const filenameParts = mediaUrl.split('/').pop().split('?')[0].split('%2F').slice(-1)[0].split('.');
      let filename = filenameParts.slice(0, -1).join('.');
      filename = filename.replace(/%20/g, '-'); // Replace %20 with -
      const extension = filenameParts.pop();
      const filenameWithExtension = `${filename}.${extension}`;

      // Create a blob URL for the media
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
      console.error('Error downloading media:', error);
    }
  };


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


  const handleImageUpload = async (event, product) => {
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

      event.target.value = '';
    } catch (error) {
      console.error('Error uploading the images:', error);
    }
  };


  const deleteImage = async (product, index) => {
    if (index >= 0 && product.productImages && product.productImages.length > index) {
      const imageUrl = product.productImages[index];
      try {
        const storage = getStorage();
        if (typeof imageUrl === 'string') {
          const imageRef = storageRef(storage, imageUrl);
          await deleteObject(imageRef);
          product.productImages.splice(index, 1);
          await updateProductInFirestore(product);
          console.log('Image deleted:', imageUrl);
        } else {
          console.error('Invalid imageUrl:', imageUrl);
        }
      } catch (error) {
        console.error('Error deleting the image:', error);
      }
    } else {
      console.error('Invalid index or image URLs not found.');
    }
  };


  const deleteFile = async (product, index) => {
    if (index >= 0 && product.productFiles && product.productFiles.length > index) {
      const fileUrl = product.productFiles[index].url;
      try {
        const storage = getStorage();
        if (typeof fileUrl === 'string') {
          const fileRef = storageRef(storage, fileUrl);
          await deleteObject(fileRef);
          product.productFiles.splice(index, 1);
          await updateProductInFirestore(product);
          console.log('File deleted:', fileUrl);
        } else {
          console.error('Invalid fileUrl:', fileUrl);
        }
      } catch (error) {
        console.error('Error deleting the file:', error);
      }
    } else {
      console.error('Invalid index or file URLs not found.');
    }
  };


  const updateProductInFirestore = async (product) => {
    try {
      if (!product.id) {
        throw new Error('Product ID is missing.');
      }

      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, product);
      // console.log('Product updated successfully in Firestore');
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


  const addProductData = ref({
    productName: '',
    productDescription: '',
    productType: '',
    productFiles: [],
    productImages: [],

  });




  const firebaseAddSingleItem = async () => {
    if (
      addProductData.value.productName &&
      addProductData.value.productDescription &&
      addProductData.value.productType &&
      addProductData.value.productImages.length > 0
    ) {
      try {
        const productData = {
          productName: addProductData.value.productName,
          productDescription: addProductData.value.productDescription,
          productType: addProductData.value.productType,
          productFiles: addProductData.value.productFiles,
          productImages: addProductData.value.productImages,
          createdAt: new Date(),
        };

        await addDoc(collection(db, 'products'), productData);


        addProductData.value.productName = '';
        addProductData.value.productDescription = '';
        addProductData.value.productType = '';
        addProductData.value.productFiles = [];
        addProductData.value.productImages = [];

        // console.log('Product added successfully!');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      try {
        const productData = {
          productName: addProductData.value.productName,
          productDescription: addProductData.value.productDescription,
          productType: addProductData.value.productType,
          productImages: addProductData.value.productImages,
          createdAt: new Date(),
        };

        await addDoc(collection(db, 'products'), productData);


        addProductData.value.productName = '';
        addProductData.value.productDescription = '';
        addProductData.value.productType = '';
        addProductData.value.productImages = [];

        // console.log('Product added successfully without files!');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };


  const firebaseUpdateSingleItem = async (product, newProductName, newProductDescription) => {
    if (product.id) {
      try {
        product.productName = newProductName;
        product.productDescription = newProductDescription;

        const updateData = {
          productName: product.productName,
          productDescription: product.productDescription,
          productType: product.productType,
          productFiles: product.productFiles,
          productImages: product.productImages,
        };

        await updateDoc(doc(db, 'products', product.id), updateData);

        // console.log('Product updated successfully!');
        showUpdatePopup.value = true;
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      console.error('Product ID is missing.');
    }
  };



  const firebaseDeleteSingleItem = async (id, product) => {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);

      if (product && product.productImages) {
        const storage = getStorage();
        for (const imageUrl of product.productImages) {
          if (typeof imageUrl === 'string') {
            const imageRef = storageRef(storage, imageUrl);
            await deleteObject(imageRef);
            console.log('Image deleted:', imageUrl);
          } else {
            console.error('Invalid imageUrl:', imageUrl);
          }
        }
      }

      if (product && product.productFiles) {
        const storage = getStorage();
        for (const file of product.productFiles) {
          const fileUrl = file.url;
          if (typeof fileUrl === 'string') {
            const fileRef = storageRef(storage, fileUrl);
            await deleteObject(fileRef);
            console.log('File deleted:', fileUrl);
          } else {
            console.error('Invalid fileUrl:', fileUrl);
          }
        }
      }

      // console.log('Product and associated files deleted successfully!');

      router.push('/products');

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