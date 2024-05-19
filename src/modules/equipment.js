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

  const handleFileUpload = async (event, equipment) => {
    const files = event.target.files;
    if (!files) return;

    const promises = Array.from(files).map(async (file) => {
      const storageReference = storageRef(storage, `equipment/${equipment ? equipment.id : 'new'}/${file.name}`);
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

  const deleteFile = async (equipment, index) => {
    const fileUrl = equipment.equipmentFiles[index];
    const storageReference = storageRef(storage, fileUrl);

    await deleteObject(storageReference);
    equipment.equipmentFiles.splice(index, 1);
    await updateDoc(doc(db, 'equipment', equipment.id), {
      equipmentFiles: equipment.equipmentFiles,
    });
  };

  const handleImageUpload = async (event, equipment) => {
    const images = event.target.files;
    if (!images) return;

    const promises = Array.from(images).map(async (image) => {
      const storageReference = storageRef(storage, `equipment/${equipment ? equipment.id : 'new'}/${image.name}`);
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

  const firebaseAddSingleItem = async () => {
    await addDoc(collection(db, 'equipment'), {
      equipmentName: addEquipmentData.value.equipmentName,
      equipmentType: addEquipmentData.value.equipmentType,
      equipmentDescription: addEquipmentData.value.equipmentDescription,
      equipmentImages: addEquipmentData.value.equipmentImages,
      equipmentFiles: addEquipmentData.value.equipmentFiles,
      createdAt: new Date(),
    });

    addEquipmentData.value = {
      equipmentName: '',
      equipmentType: '',
      equipmentDescription: '',
      equipmentImages: [],
      equipmentFiles: [],
    };
  };

  const firebaseUpdateSingleItem = async (equipment, newEquipmentName, newEquipmentDescription) => {
    await updateDoc(doc(db, 'equipment', equipment.id), {
      equipmentName: newEquipmentName,
      equipmentDescription: newEquipmentDescription,
    });
  };

  const firebaseDeleteSingleItem = async (id) => {
    const equipment = await getEquipmentById(id);
    
    if (equipment) {
      // Delete all files from storage
      if (equipment.equipmentFiles) {
        const fileDeletionPromises = equipment.equipmentFiles.map(async (file) => {
          const storageReference = storageRef(storage, file);
          await deleteObject(storageReference);
        });
        await Promise.all(fileDeletionPromises);
      }
  
      // Delete all images from storage
      if (equipment.equipmentImages) {
        const imageDeletionPromises = equipment.equipmentImages.map(async (image) => {
          const storageReference = storageRef(storage, image);
          await deleteObject(storageReference);
        });
        await Promise.all(imageDeletionPromises);
      }
      
      // Finally, delete the equipment document
      await deleteDoc(doc(db, 'equipment', id));
    }
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
    firebaseAddSingleItem,
    firebaseUpdateSingleItem,
    firebaseDeleteSingleItem,
    getEquipmentData,
    getEquipmentById,
    updateEquipmentInFirestore,
    getAllEquipment
  };
};

export default useEquipment;
