// equipment.js

import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as storageRef, deleteObject } from 'firebase/storage';
import { getDoc } from 'firebase/firestore';

const useOxyEquipment = () => {
    const getOxyEquipmentById = async (oxyEquipmentId) => {
        try {
            const docRef = doc(db, 'oxyequipment', oxyEquipmentId);
            console.log('Document Reference:', docRef); // Add this line for debugging
            const docSnap = await getDoc(docRef);
            console.log('Document Snapshot:', docSnap); // Add this line for debugging

            if (docSnap.exists()) {
                const oxyEquipmentData = docSnap.data();
                oxyEquipmentData.oxyEquipmentImages = oxyEquipmentData.oxyEquipmentImages || [];
                oxyEquipmentData.id = docSnap.id;
                console.log('Retrieved oxy equipment:', oxyEquipmentData);
                return oxyEquipmentData;
            } else {
                throw new Error('Oxy equipment not found');
            }
        } catch (error) {
            console.error('Error fetching oxy equipment:', error);
            throw error;
        }
    };


    const handleFileUpload = async (event, oxyEquipment) => {
        const storage = getStorage();
        const files = event.target.files;

        if (!files.length) return;

        try {
            const filePromises = Array.from(files).map(async (file) => {
                const fileRef = storageRef(storage, `oxyequipment/files/${file.name}`);
                await uploadBytes(fileRef, file);
                return getDownloadURL(fileRef);
            });

            const fileUrls = await Promise.all(filePromises);

            if (oxyEquipment) {
                if (!Array.isArray(oxyEquipment.oxyEquipmentFiles)) {
                    oxyEquipment.oxyEquipmentFiles = [];
                }
                oxyEquipment.oxyEquipmentFiles.push(...fileUrls);

                await updateOxyEquipmentInFirestore(oxyEquipment);
            } else {
                if (!Array.isArray(addOxyEquipmentData.value.oxyEquipmentFiles)) {
                    addOxyEquipmentData.value.oxyEquipmentFiles = [];
                }
                addOxyEquipmentData.value.oxyEquipmentFiles.push(...fileUrls);
            }

            event.target.value = '';
        } catch (error) {
            console.error('Error uploading the files:', error);
        }
    };

    const deleteFile = async (oxyEquipment, index) => {
        console.log('Deleting file:', oxyEquipment, index);
        if (index >= 0 && oxyEquipment.oxyEquipmentFiles && oxyEquipment.oxyEquipmentFiles.length > index) {
            const fileUrl = oxyEquipment.oxyEquipmentFiles[index];
            try {
                const storage = getStorage();
                const fileRef = storageRef(storage, fileUrl);
                await deleteObject(fileRef);
                oxyEquipment.oxyEquipmentFiles.splice(index, 1);
                await updateOxyEquipmentInFirestore(oxyEquipment);
                console.log('File deleted:', fileUrl);
            } catch (error) {
                console.error('Error deleting the file:', error);
            }
        } else {
            console.error('Invalid index or file URLs not found.');
        }
    };

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

    const handleImageUpload = async (event, oxyEquipment) => {
        const storage = getStorage();
        const files = event.target.files;

        if (!files.length) return;

        try {
            const imagePromises = Array.from(files).map(async (file) => {
                const imageRef = storageRef(storage, `oxyequipment/images/${Date.now()}_${file.name}`);
                await uploadBytes(imageRef, file);
                return getDownloadURL(imageRef);
            });

            const imageUrls = await Promise.all(imagePromises);

            if (oxyEquipment) {
                if (!Array.isArray(oxyEquipment.oxyEquipmentImages)) {
                    oxyEquipment.oxyEquipmentImages = [];
                }
                oxyEquipment.oxyEquipmentImages.push(...imageUrls);

                await updateOxyEquipmentInFirestore(oxyEquipment);
            } else {
                if (!Array.isArray(addOxyEquipmentData.value.oxyEquipmentImages)) {
                    addOxyEquipmentData.value.oxyEquipmentImages = [];
                }
                addOxyEquipmentData.value.oxyEquipmentImages.push(...imageUrls);
            }

            event.target.value = '';
        } catch (error) {
            console.error('Error uploading the images:', error);
        }
    };

    const deleteImage = async (oxyEquipment, index) => {
        if (index >= 0 && oxyEquipment.oxyEquipmentImages && oxyEquipment.oxyEquipmentImages.length > index) {
            const imageUrl = oxyEquipment.oxyEquipmentImages[index];

            try {
                const storage = getStorage();
                const imageRef = storageRef(storage, imageUrl);
                await deleteObject(imageRef);
                oxyEquipment.oxyEquipmentImages.splice(index, 1);
                await updateOxyEquipmentInFirestore(oxyEquipment);
                console.log('Image deleted:', imageUrl);
            } catch (error) {
                console.error('Error deleting the image:', error);
            }
        } else {
            console.error('Invalid index or image URLs not found.');
        }
    };

    const updateOxyEquipmentInFirestore = async (oxyEquipment) => {
        try {
            if (!oxyEquipment.id) {
                throw new Error('Oxy equipment ID is missing.');
            }

            const docRef = doc(db, 'oxyequipment', oxyEquipment.id);
            await updateDoc(docRef, oxyEquipment);
            console.log('Oxy equipment updated successfully in Firestore');
        } catch (error) {
            console.error('Error updating oxy equipment in Firestore:', error);
            throw error;
        }
    };

    const oxyEquipment = ref([]);
    const oxyEquipmentDataRef = collection(db, 'oxyequipment');
    const getOxyEquipmentData = () => {
        console.log('Fetching oxy equipment data...');
        onSnapshot(oxyEquipmentDataRef, (snapshot) => {
            console.log('Snapshot:', snapshot.docs);
            oxyEquipment.value = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    isEditing: false,
                };
            });
        });
    };


    const addOxyEquipmentData = ref({
        oxyEquipmentName: '',
        oxyEquipmentDescription: '',
        oxyEquipmentFiles: [],
        oxyEquipmentImages: [],
    });

    const firebaseAddSingleOxyEquipment = async () => {
        if (
            addOxyEquipmentData.value.oxyEquipmentName &&
            addOxyEquipmentData.value.oxyEquipmentDescription &&
            addOxyEquipmentData.value.oxyEquipmentImages.length > 0
        ) {
            try {
                const oxyEquipmentData = {
                    oxyEquipmentName: addOxyEquipmentData.value.oxyEquipmentName,
                    oxyEquipmentDescription: addOxyEquipmentData.value.oxyEquipmentDescription,
                    oxyEquipmentFiles: addOxyEquipmentData.value.oxyEquipmentFiles,
                    oxyEquipmentImages: addOxyEquipmentData.value.oxyEquipmentImages,
                };

                await addDoc(collection(db, 'oxyequipment'), oxyEquipmentData);

                addOxyEquipmentData.value.oxyEquipmentName = '';
                addOxyEquipmentData.value.oxyEquipmentDescription = '';
                addOxyEquipmentData.value.oxyEquipmentFiles = [];
                addOxyEquipmentData.value.oxyEquipmentImages = [];

                console.log('Oxy equipment added successfully!');
            } catch (error) {
                console.error('Error adding oxy equipment:', error);
            }
        } else {
            console.error('Oxy equipment name, description, or images are missing.');
        }
    };

    const firebaseUpdateSingleOxyEquipment = async (oxyEquipment, newName, newDescription) => {
        if (oxyEquipment.id) {
            try {
                oxyEquipment.oxyEquipmentName = newName;
                oxyEquipment.oxyEquipmentDescription = newDescription;

                const updateData = {
                    oxyEquipmentName: oxyEquipment.oxyEquipmentName,
                    oxyEquipmentDescription: oxyEquipment.oxyEquipmentDescription,
                    oxyEquipmentFiles: oxyEquipment.oxyEquipmentFiles,
                    oxyEquipmentImages: oxyEquipment.oxyEquipmentImages,
                };

                await updateDoc(doc(db, 'oxyequipment', oxyEquipment.id), updateData);

                console.log('Oxy equipment updated successfully!');
            } catch (error) {
                console.error('Error updating oxy equipment:', error);
            }
        } else {
            console.error('Oxy equipment ID is missing.');
        }
    };

    const firebaseDeleteSingleOxyEquipment = async (id, oxyEquipment) => {
        try {
            const docRef = doc(db, 'oxyequipment', id);
            await deleteDoc(docRef);

            if (oxyEquipment && oxyEquipment.oxyEquipmentImages) {
                const storage = getStorage();
                for (const imageUrl of oxyEquipment.oxyEquipmentImages) {
                    const imageRef = storageRef(storage, imageUrl);
                    await deleteObject(imageRef);
                    console.log('Image deleted:', imageUrl);
                }
            }

            if (oxyEquipment && oxyEquipment.oxyEquipmentFiles) {
                const storage = getStorage();
                for (const fileUrl of oxyEquipment.oxyEquipmentFiles) {
                    const fileRef = storageRef(storage, fileUrl);
                    await deleteObject(fileRef);
                    console.log('File deleted:', fileUrl);
                }
            }

            console.log('Oxy equipment and associated files deleted successfully!');
        } catch (error) {
            console.error('Error deleting oxy equipment:', error);
        }
    };

    return {
        getOxyEquipmentData,
        oxyEquipment,
        firebaseDeleteSingleOxyEquipment,
        firebaseAddSingleOxyEquipment,
        addOxyEquipmentData,
        firebaseUpdateSingleOxyEquipment,
        deleteImage,
        handleImageUpload,
        downloadFile,
        deleteFile,
        handleFileUpload,
        getOxyEquipmentById,
        getOxyEquipmentData
    };
};

export default useOxyEquipment;
