<!-- ProductDetailes.vue -->
<template>
    <div v-if="product" class="w-[100%] px-[5%] flex font-futura mt-10">

        <div class="pictures w-[50%] flex-col flex items-center ">
            <!-- Main product image -->
            <div class="relative w-[100%] flex justify-center">
                <img class="w-96 h-96 object-cover object-center cursor-pointer border border-main"
                    :src="product.productImages[0]" alt="Main Product Image" @click="toggleDeleteButton(0)" />
            </div>

            <!-- Additional product images -->
            <div class="w-96">
                <div class="w-[103%] gap-[3%] flex flex-wrap">
                    <div v-for="(image, index) in product.productImages.slice(1)" :key="index"
                        class="relative  w-[22%] mt-5">
                        <img class=" border border-main object-cover object-center cursor-pointer" :src="image"
                            alt="Product Image" @click="toggleDeleteButton(index + 1)" />
                        <!-- Delete button for additional images -->
                    </div>
                </div>

            </div>
            <!-- Button to add more images -->
            <div class="w-96 mt-5 flex">
                <input class="hidden" type="file" id="file" name="file" @change="handleImageUpload($event, product)"
                    multiple :data-product="product.id">
                <button
                    class="bg-white text-main border border-main px-4 py-2 rounded-lg hover:bg-main hover:text-white font-futura"
                    @click="openFileInput">Add Photo</button>
                <!-- Delete button for the selected image -->
                <button v-if="selectedImage !== null" @click="deleteImageHandler(product, selectedImage)"
                    class="bg-main text-white border ml-4 px-4 py-2 rounded-lg">Delete</button>
            </div>

        </div>

        <div class="info w-[50%] flex flex-col">
            <input class="w-[100%] uppercase text-[50px] text-text" v-model="newProductName" type="text"
                placeholder="New Product Name">
            <h1 class="text-text uppercase my-3 text-p">Description</h1>
            <textarea class="w-full text-h3 h-28 text-text" v-model="newProductDescription"
                placeholder="New Product Description"></textarea>
            <div class="flex gap-2 my-5">
                <button
                    class="bg-white text-main border border-main px-[40px] py- rounded-lg mr-5 hover:bg-main hover:text-white"
                    @click="firebaseUpdateSingleItem(product, newProductName, newProductDescription)">Update
                    Product</button>
                <button
                    class="bg-white text-main border border-main px-[40px] py- rounded-lg mr-5 hover:bg-main hover:text-white"
                    @click="deleteProductHandler(product.id)">Delete Product</button>
            </div>

            <h1 class="text-p text-text">Files:</h1>
            <div class="flex w-[100%] justify-between" v-for="(file, index) in product.productFiles" :key="index">
                <a class="my-1" :href="file" target="_blank">{{ getFileName(file) }}</a>
                <div class="  my-1">
                    <button class="text-text underline px-[20px] rounded-lg mr-5"
                        @click="deleteFile(product, index)">Delete File</button>
                    <button
                        class="bg-white text-main border border-main px-[40px] rounded-lg mr-5 hover:bg-main hover:text-white"
                        @click="downloadFile(file)">Download File</button>
                </div>

            </div>
            <input
                class="w-[30%] mb-2 bg-white text-main border border-main px-[40px] rounded-lg mr-5 hover:bg-main hover:text-white font-futura"
                type="button" id="loadFileXml" value="Add File" onclick="document.getElementById('img').click();" />

            <input class="hidden" type="file" id="img" name="img" @change="handleFileUpload($event, product)" multiple
                :data-product="product.id">
        </div>






    </div>
    <div v-else>error</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import useProducts from '../modules/products.js';

const route = useRoute();
const router = useRouter();

const { getProductById, deleteImage, deleteFile, downloadFile, firebaseUpdateSingleItem, firebaseDeleteSingleItem, handleFileUpload, handleImageUpload } = useProducts();

const productId = ref(route.params.id);
const product = ref(null);

const newProductName = ref('');
const newProductDescription = ref('');
const selectedImage = ref(null); // Variable to store the index of selected image

onMounted(async () => {
    try {
        const result = await getProductById(productId.value);
        product.value = result;
        newProductName.value = result.productName;
        newProductDescription.value = result.productDescription;
    } catch (error) {
        console.error('Error fetching product:', error);
    }
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


const deleteImageHandler = async (product, index) => {
    console.log('Product object:', product); // Log the product object
    if (product && product.id) {
        try {
            await deleteImage(product, index); // Call deleteImage with the product and index
            // Reset selectedImage to null to hide the delete button
            selectedImage.value = null;
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    } else {
        console.error('Product ID is missing.');
    }
};


const deleteProductHandler = async (productId) => {
    try {
        await firebaseDeleteSingleItem(productId, product.value);
        router.push('/products'); // Redirect to Products page after deletion
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};
</script>
