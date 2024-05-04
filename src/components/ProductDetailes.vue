<template>
    <div v-if="product">
        <div v-for="(image, index) in product.productImages" :key="index">
            <img :src="image" alt="Product Image" />
            <button @click="deleteImage(index)">Delete Image</button>
        </div>
        <p>Title: <span>{{ product.productName }}</span></p>
        <p>Description: <span>{{ product.productDescription }}</span></p>

        <input v-model="newProductName" type="text" placeholder="New Product Name">
        <input v-model="newProductDescription" type="text" placeholder="New Product Description">
        <button @click="updateProduct">Update Product</button>

        <div v-for="(file, index) in product.productFiles" :key="index">
            <a :href="file" target="_blank">{{ file }}</a>
            <button @click="deleteFile(index)">Delete File</button>
            <button @click="downloadFile(file)">Download File</button>
        </div>

        <button @click="deleteProduct">Delete Product</button>
    </div>
    <div v-else>error</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import useProducts from '../modules/products.js';

const route = useRoute();

const { getProductById, deleteImage, deleteFile, downloadFile, updateProduct, deleteProduct } = useProducts();

const productId = ref(route.params.id);
const product = ref(null);

const newProductName = ref('');
const newProductDescription = ref('');

getProductById(productId.value)
    .then((result) => {
        product.value = result;
        newProductName.value = result.productName;
        newProductDescription.value = result.productDescription;
    });
</script>