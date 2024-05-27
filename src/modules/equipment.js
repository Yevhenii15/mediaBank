/* equipment.js */
import { ref } from 'vue';
import { db } from '../firebase.js';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc, getDoc, query, orderBy, getDocs } from 'firebase/firestore'; // Added getDocs
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const storage = getStorage();

const useEquipment = () => {
  const showUpdatePopup = ref(false);
  const equipment = ref([]);
  const addEquipmentData = ref({
    equipmentName: '',
    equipmentType: '',
    equipmentDescription: '',
    equipmentImages: [],
    equipmentFiles: [],
  });
  const selectedLanguage = ref(''); // Make sure this is defined
  const errorMessage = ref(''); // Add error message reactive variable


  const getEquipmentById = async (equipmentId) => {
    const docRef = doc(db, 'equipment', equipmentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const equipmentData = docSnap.data();
      if (!equipmentData.equipmentImages) {
        equipmentData.equipmentImages = [];
      }
      if (!equipmentData.equipmentFiles) {
        equipmentData.equipmentFiles = [];
      }
      return { id: docSnap.id, ...equipmentData };
    }
    return null;
  };
  const downloadFile = async (mediaUrl) => {
    try {
      const mediaRef = storageRef(storage, mediaUrl); // Get the reference using the initialized storage
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



  const handleFileUpload = async (event, equipment) => {
    const files = event.target.files;
    if (!selectedLanguage.value) {
      errorMessage.value = 'Please select a language before uploading a file.';
      return;
    }

    errorMessage.value = ''; // Clear the error message if everything is fine

    const promises = Array.from(files).map(async (file) => {
      const folderName = equipment ? equipment.equipmentName.replace(/\s+/g, '_') : 'new';
      const storageReference = storageRef(storage, `equipment/${folderName}/files/${file.name}`);
      const snapshot = await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const fileData = {
        url: downloadURL,
        language: selectedLanguage.value
      };

      if (equipment) {
        if (!equipment.equipmentFiles) {
          equipment.equipmentFiles = [];
        }
        equipment.equipmentFiles.push(fileData);
        await updateDoc(doc(db, 'equipment', equipment.id), {
          equipmentFiles: equipment.equipmentFiles,
        });
      } else {
        addEquipmentData.value.equipmentFiles.push(fileData);
      }
    });

    await Promise.all(promises);
  };
  
  

  const handleImageUpload = async (event, equipment) => {
    const images = event.target.files;
    if (!images) return;

    const promises = Array.from(images).map(async (image) => {
      const folderName = equipment ? equipment.equipmentName.replace(/\s+/g, '_') : 'new';
      const storageReference = storageRef(storage, `equipment/${folderName}/images/${image.name}`);
      const snapshot = await uploadBytes(storageReference, image);
      const downloadURL = await getDownloadURL(snapshot.ref);

      if (equipment) {
        if (!equipment.equipmentImages) {
          equipment.equipmentImages = [];
        }
        equipment.equipmentImages.push(downloadURL);
        await updateDoc(doc(db, 'equipment', equipment.id), {
          equipmentImages: equipment.equipmentImages,
        });
      } else {
        addEquipmentData.value.equipmentImages.push(downloadURL);
      }
    });

    await Promise.all(promises);
  };


  const deleteFile = async (equipment, index) => {
    try {
      // Check if the file exists in the array
      if (!equipment.equipmentFiles || !equipment.equipmentFiles[index]) {
        throw new Error('File not found in equipment files array.');
      }
  
      const fileUrl = equipment.equipmentFiles[index].url; // Ensure this is correct
      console.log('Deleting file with URL:', fileUrl);
  
      // Validate that fileUrl is a string
      if (typeof fileUrl !== 'string') {
        throw new TypeError('File URL is not a string.');
      }
  
      // Create storage reference
      const storageReference = storageRef(storage, fileUrl);
      console.log('Storage reference created:', storageReference);
  
      // Delete the file from Firebase Storage
      await deleteObject(storageReference);
      console.log('File deleted successfully from storage.');
  
      // Remove the file from the equipment files array
      equipment.equipmentFiles.splice(index, 1);
      await updateDoc(doc(db, 'equipment', equipment.id), {
        equipmentFiles: equipment.equipmentFiles,
      });
      console.log('File entry removed from Firestore.');
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };
  


  const deleteImage = async (equipment, index) => {
    const imageUrl = equipment.equipmentImages[index];
    const storageReference = storageRef(storage, imageUrl);

    await deleteObject(storageReference);
    equipment.equipmentImages.splice(index, 1);
    await updateDoc(doc(db, 'equipment', equipment.id), {
      equipmentImages: equipment.equipmentImages,
    });
  };

  const updateEquipmentInFirestore = async (equipment) => {
    await updateDoc(doc(db, 'equipment', equipment.id), equipment);
  };

  const getEquipmentData = () => {
    const q = query(collection(db, 'equipment'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (querySnapshot) => {
      const equipmentArray = [];
      querySnapshot.forEach((doc) => {
        equipmentArray.push({ id: doc.id, ...doc.data() });
      });
      equipment.value = equipmentArray;
    });
  };


  const getAllEquipment = async () => {
    const equipmentList = [];
    const querySnapshot = await getDocs(collection(db, 'equipment')); // Use getDocs to fetch all documents
    querySnapshot.forEach((doc) => {
      equipmentList.push({ id: doc.id, ...doc.data() });
    });
    return equipmentList;
  };

  return {
    equipment,
    showUpdatePopup,
    addEquipmentData,
    handleFileUpload,
    deleteFile,
    handleImageUpload,
    deleteImage,
    getEquipmentData,
    getEquipmentById,
    updateEquipmentInFirestore,
    getAllEquipment,
    downloadFile,
    selectedLanguage, // Make sure this is included if needed in other parts
    errorMessage
  };
};

export default useEquipment;
