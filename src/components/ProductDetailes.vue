<!-- ProductDetailes.vue -->
<template>
    <div v-if="product" class="w-[100%] px-[5%] flex font-futura">

        <div class="pictures w-[50%]">
            <div class="flex flex-col items-center" v-for="(image, index) in product.productImages" :key="index">
                <img class="w-48 h-48 object-cover object-center" :src="image" alt="Product Image" />
                <div class="flex">
                    <input class="hidden" type="file" id="file" name="file" @change="handleImageUpload($event, product)"
                        multiple :data-product="product.id">
                    <input
                        class="bg-white text-main border border-main px-[40px] py- rounded-lg mr-5 hover:bg-main hover:text-white font-futura"
                        type="button" id="loadFileXml" value="Add Photo"
                        onclick="document.getElementById('file').click();" />

                    <button
                        class="bg-white text-main border border-main px-[40px] py- rounded-lg mr-5 hover:bg-main hover:text-white font-futura"
                        @click="deleteImageHandler(product, index)">Delete Image</button>


                </div>
            </div>
        </div>

        <div class="info w-[50%] flex flex-col">
            <input class="w-[100%] uppercase text-[50px] text-text" v-model="newProductName" type="text"
                placeholder="New Product Name">
            <h1 class="text-text uppercase my-3 text-p">Description</h1>
            <textarea class="w-full text-h3 h-28 text-text" v-model="newProductDescription"
                placeholder="New Product Description"></textarea>

            <button @click="firebaseUpdateSingleItem(product, newProductName, newProductDescription)">Update
                Product</button>
            <button @click="deleteProductHandler(product.id)">Delete Product</button>

            <div v-for="(file, index) in product.productFiles" :key="index">
                <a :href="file" target="_blank">{{ getFileName(file) }}</a>
                <button @click="deleteFile(product, index)">Delete File</button>
                <button @click="downloadFile(file)">Download File</button>
            </div>

            <input type="file" @change="handleFileUpload($event, product)" multiple :data-product="product.id">
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
