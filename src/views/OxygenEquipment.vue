<!-- OxygenEquipment.vue -->
<template>

    <body class="font-futura">


        <div>
            You are viewing the OxygenEquipment.vue file
        </div>
        <div class="flex flex-col w-[11%]">
            <a class="bg-main text-white rounded-e-3xl p-2 my-3 pl-6 font-bold" href="/oxyequipment">OXYGEN</a>
            <a class="bg-white text-main border border-main rounded-e-3xl p-2 pl-6  my-3 font-bold border-l-0"
                href="/ledequipment">LED</a>
            <a class="bg-white text-main border border-main rounded-e-3xl p-2 pl-6  my-3 font-bold border-l-0"
                href="/microequipment">MICRO</a>
        </div>

        <div v-if="oxyEquipment" class="w-full px-5 flex font-futura mt-10">
            <pre>{{ oxyEquipment }}</pre>

            <div class="pictures w-1/2 flex-col flex items-center ">
                <!-- Main oxy equipment image -->
                <div class="relative w-full flex justify-center">
                    <img class="w-96 h-96 object-cover object-center cursor-pointer border border-main"
                        :src="oxyEquipment.oxyEquipmentImages[0]" alt="Main Oxy Equipment Image"
                        @click="toggleDeleteButton(0)" />
                </div>

                <!-- Additional oxy equipment images -->
                <div class="w-96">
                    <div class="w-full gap-3 flex flex-wrap">
                        <div v-for="(image, index) in oxyEquipment.oxyEquipmentImages.slice(1)" :key="index"
                            class="relative w-1/5 mt-5">
                            <img class="border border-main object-cover object-center cursor-pointer" :src="image"
                                alt="Oxy Equipment Image" @click="toggleDeleteButton(index + 1)" />
                            <!-- Delete button for additional images -->
                        </div>
                    </div>
                </div>

                <!-- Button to add more images -->
                <div class="w-96 mt-5 flex">
                    <input class="hidden" type="file" id="file" name="file"
                        @change="handleImageUpload($event, oxyEquipment)" multiple :data-oxyEquipment="oxyEquipment.id">
                    <button
                        class="bg-white text-main border border-main px-4 py-2 rounded-lg hover:bg-main hover:text-white font-futura"
                        @click="openFileInput">Add Photo</button>
                    <!-- Delete button for the selected image -->
                    <button v-if="selectedImage !== null" @click="deleteImageHandler(oxyEquipment, selectedImage)"
                        class="bg-main text-white border ml-4 px-4 py-2 rounded-lg">Delete</button>
                </div>
            </div>

            <div class="info w-1/2 flex flex-col">
                <input class="w-full uppercase text-2xl text-text" v-model="newOxyEquipmentName" type="text"
                    placeholder="New Oxy Equipment Name">
                <h1 class="text-text uppercase my-3 text-lg">Description</h1>
                <textarea class="w-full text-lg h-28 text-text" v-model="newOxyEquipmentDescription"
                    placeholder="New Oxy Equipment Description"></textarea>
                <div class="flex gap-2 my-5">
                    <button
                        class="bg-white text-main border border-main px-10 py-2 rounded-lg mr-5 hover:bg-main hover:text-white"
                        @click="firebaseUpdateSingleOxyEquipment(oxyEquipment, newOxyEquipmentName, newOxyEquipmentDescription)">Update
                        Oxy Equipment</button>
                    <button
                        class="bg-white text-main border border-main px-10 py-2 rounded-lg mr-5 hover:bg-main hover:text-white"
                        @click="deleteOxyEquipmentHandler(oxyEquipment.id)">Delete Oxy Equipment</button>
                </div>

                <h1 class="text-lg text-text">Files:</h1>
                <div class="flex w-full justify-between" v-for="(file, index) in oxyEquipment.oxyEquipmentFiles"
                    :key="index">
                    <a class="my-1" :href="file" target="_blank">{{ getFileName(file) }}</a>
                    <div class="my-1">
                        <button class="text-text underline px-4 rounded-lg mr-5"
                            @click="deleteFile(oxyEquipment, index)">Delete
                            File</button>
                        <button
                            class="bg-white text-main border border-main px-10 rounded-lg mr-5 hover:bg-main hover:text-white"
                            @click="downloadFile(file)">Download File</button>
                    </div>
                </div>
                <input
                    class="w-1/3 mb-2 bg-white text-main border border-main px-10 rounded-lg mr-5 hover:bg-main hover:text-white font-futura"
                    type="button" id="loadFileXml" value="Add File" onclick="document.getElementById('img').click();" />

                <input class="hidden" type="file" id="img" name="img" @change="handleFileUpload($event, oxyEquipment)"
                    multiple :data-oxyEquipment="oxyEquipment.id">
            </div>
        </div>
        <div v-else>error </div>

    </body>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useOxyEquipment from '../modules/equipment.js';

const router = useRouter();

const { getOxyEquipmentData, deleteImage, deleteFile, downloadFile, firebaseUpdateSingleOxyEquipment, firebaseDeleteSingleOxyEquipment, handleFileUpload, handleImageUpload } = useOxyEquipment();

const oxyEquipment = ref(null);

const newOxyEquipmentName = ref('');
const newOxyEquipmentDescription = ref('');
const selectedImage = ref(null); // Variable to store the index of selected image

onMounted(() => {
    getOxyEquipmentData();
});

const openFileInput = () => {
    document.getElementById('file').click();
};

const toggleDeleteButton = (index) => {
    // Toggle the selectedImage to show or hide the delete button
    selectedImage.value = selectedImage.value === index ? null : index;
};

const getFileName = (fileUrl) => {
    // Decode the URL
    const decodedUrl = decodeURIComponent(fileUrl);
    // Split the decoded URL by '/' and get the last element
    const parts = decodedUrl.split('/');
    // Get the last part of the URL
    const fileNameWithExtension = parts[parts.length - 1];
    // Split the filename by '.' and get the first part (filename without extension)
    const fileName = fileNameWithExtension.split('.')[0];
    return fileName;
};

const deleteImageHandler = async (oxyEquipment, index) => {
    console.log('Oxy Equipment object:', oxyEquipment); // Log the oxy equipment object
    if (oxyEquipment && oxyEquipment.id) {
        try {
            await deleteImage(oxyEquipment, index); // Call deleteImage with the oxy equipment and index
            // Reset selectedImage to null to hide the delete button
            selectedImage.value = null;
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    } else {
        console.error('Oxy Equipment ID is missing.');
    }
};

const deleteOxyEquipmentHandler = async (oxyEquipmentId) => {
    try {
        await firebaseDeleteSingleOxyEquipment(oxyEquipmentId);
        router.push('/oxyequipment'); // Redirect to Oxy Equipment page after deletion
    } catch (error) {
        console.error('Error deleting oxy equipment:', error);
    }
};
</script>