<template>
    <div class="flex flex-col items-center">
        <div class="w-[100%] flex items-center flex-col mt-[20px]">
            <h1 class="text-text font-futura font-bold text-p">ADD SOME POST</h1>
            <div class="w-[50%] flex justify-between my-[20px]">
                <input class="file:bg-main w-[50%]  
            file:text-white
            file:border-none
            file:px-[40px]
            file:py-[9px]
            file:rounded-lg
            file:mr-5
            font-futura " type="file" @change="handleImageUpload($event)" multiple :data-product="null">
                <button class=" bg-main text-white px-[70px] py-[9px] rounded-lg" @click="reloadPage">Add
                    Post</button>
            </div>
        </div>
        <div class="w-[60%] flex  flex-row flex-wrap justify-between">
            <div class="w-[21%] flex flex-col" v-for="(imageUrl, index) in imageUrls" :key="index">
                <img class="w-48 h-48 object-cover object-center border border-text" :src="imageUrl" alt="Image">
                <div class="flex justify-between w-[100%]">
                    <button class=" bg-main text-white px-[12px] py-[0.5px] rounded-md my-3"
                        @click="deleteImageHandler(imageUrl)">Delete</button>
                    <button class=" bg-main text-white px-[12px] py-[0.5px] rounded-md my-3"
                        @click="downloadImage(imageUrl)">Download</button>
                </div>
            </div>
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

</script>

<style lang="scss" scoped></style>
