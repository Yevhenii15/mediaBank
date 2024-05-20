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

      // Define a regular expression to match and remove the prefixes
      const prefixPattern = /equipment%2F(?:Oxygen%2Ffiles%2F|Led%2Ffiles%2F|Micro%2Ffiles%2F|Oxygen%2Fimages%2F|Led%2Fimages%2F|Micro%2Fimages%2F)/i;
      const filenameParts = imageUrl.split('/').pop().split('?')[0].replace(prefixPattern, '').split('.');
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


  const handleFileUpload = async (event, equipment) => {
    const files = event.target.files;
    if (!files) return;

    const promises = Array.from(files).map(async (file) => {
      const folderName = equipment ? equipment.equipmentName.replace(/\s+/g, '_') : 'new';
      const storageReference = storageRef(storage, `equipment/${folderName}/files/${file.name}`);
      const snapshot = await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      if (equipment) {
        if (!equipment.equipmentFiles) {
          equipment.equipmentFiles = [];
        }
        equipment.equipmentFiles.push(downloadURL);
        await updateDoc(doc(db, 'equipment', equipment.id), {
          equipmentFiles: equipment.equipmentFiles,
        });
      } else {
        addEquipmentData.value.equipmentFiles.push(downloadURL);
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
    const fileUrl = equipment.equipmentFiles[index];
    const storageReference = storageRef(storage, fileUrl);

    await deleteObject(storageReference);
    equipment.equipmentFiles.splice(index, 1);
    await updateDoc(doc(db, 'equipment', equipment.id), {
      equipmentFiles: equipment.equipmentFiles,
    });
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
  };
};

export default useEquipment;
