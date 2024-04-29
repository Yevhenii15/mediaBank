<template>
    <div>
        SoMe
        <input type="file" @change="handleImageUpload($event)" multiple :data-product="null">
        <button @click="reloadPage">Add Image</button>
        <div v-for="(imageUrl, index) in imageUrls" :key="index">
            <img :src="imageUrl" alt="Image">
            <button @click="deleteImageHandler(imageUrl)">Delete Image</button>
            <button @click="downloadImageHandler(imageUrl)">Download Image</button>
        </div>
    </div>
</template>

<script setup>
import SoMePost from '../modules/some.js';
const { handleImageUpload, getImagesFromStorage, deleteImage, downloadImage } = SoMePost();

import { ref, onMounted } from 'vue';

const imageUrls = ref([]);

const handleImageDeletion = (deletedImageUrl) => {
    imageUrls.value = imageUrls.value.filter(url => url !== deletedImageUrl);
};

const deleteImageHandler = (imageUrl) => {
    deleteImage(imageUrl, handleImageDeletion);
};

onMounted(async () => {
    imageUrls.value = await getImagesFromStorage();
});

const reloadPage = () => {
    location.reload();
};

const downloadImageHandler = async (imageUrl) => {
    try {
        const downloadUrl = await downloadImage(imageUrl);
        if (downloadUrl) {
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = ''; // This will prompt the browser to download the file with its original name
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            console.error('Image download failed: Download URL not available.');
        }
    } catch (error) {
        console.error('Image download failed:', error.message);
    }
};






</script>

<style lang="scss" scoped></style>
