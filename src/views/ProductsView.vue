<!-- ProductView.vue -->
<template>
    <div
        class="font-futura flex justify-center flex-wrap w-[100%] relative lg:top-[15vh] top-[13vh] mb-[15vh]  px-[5%]">

        <!-- Buttons to filter products -->
        <div class="lg:flex hidden flex-col w-[11%] fixed left-0">
            <button @click="filterProducts('all')"
                :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7 uppercase  my-3 font-bold border-l-0', { 'active-filter': selectedProductType === 'all' }]">All</button>
            <button @click="filterProducts('face')"
                :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7 uppercase  my-3 font-bold border-l-0', { 'active-filter': selectedProductType === 'face' }]">Face</button>
            <button @click="filterProducts('eye')"
                :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7  uppercase my-3 font-bold border-l-0', { 'active-filter': selectedProductType === 'eye' }]">Eye</button>
            <button @click="filterProducts('hair')"
                :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7 uppercase my-3 font-bold border-l-0', { 'active-filter': selectedProductType === 'hair' }]">Hair</button>
            <button @click="filterProducts('serum')"
                :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7 uppercase  my-3 font-bold border-l-0', { 'active-filter': selectedProductType === 'serum' }]">Serum</button>
            <button @click="filterProducts('serum-device')"
                :class="['bg-white flex text-main border border-main rounded-e-3xl uppercase p-2 pl-7 my-3 font-bold border-l-0', { 'active-filter': selectedProductType === 'serum-device' }]">Serum
                Device</button>
        </div>


        <div class="lg:w-[60%] w-[90%]">
            <div v-if="isAdminUser"> <!-- Use v-if instead of v-show -->
                <!-- Title for section -->
                <h1 class="w-[100%] text-p text-text flex justify-center my-5">ADD NEW PRODUCT</h1>
                <!-- Form for adding new product -->
                <div class="flex w-[100%]">
                    <input class="w-[48%] border border-main rounded-lg pl-3 py-1 mr-[2%]"
                        v-model="addProductData.productName" type="text" placeholder="Product Name">
                    <select class="w-[48%] pl-3 border border-main rounded-lg ml-[2%] text-text"
                        v-model="addProductData.productType">
                        <option value="">Select Product Type</option>
                        <option value="face">Face</option>
                        <option value="eye">Eye</option>
                        <option value="hair">Hair</option>
                        <option value="serum">Serum</option>
                    </select>
                </div>
                <div class="flex my-4 lg:my-8 flex-wrap">
                    <textarea
                        class="lg:w-[48%] w-[100%] pt-1 border border-main rounded-lg pl-3  h-16 mr-[2%] mb-4 lg:mb-0"
                        v-model="addProductData.productDescription" type="text"
                        placeholder="Product Description"></textarea>
                    <div class="lg:w-[48%] w-[100%] lg:ml-[2%] flex flex-col justify-between">
                        <input
                            class="w-[100%] file:h-16 file:w-[50%] file:bg-white file:text-main file:border file:border-main  file:rounded-lg file:mr-5 file:hover:bg-main file:hover:text-white font-futura"
                            type="file" @change="handleImageUpload($event, null)" multiple :data-product="null">

                    </div>
                </div>
                <div class="flex justify-center w-[100%]">
                    <button
                        class="flex w-[100%] lg:w-[40%] justify-center bg-main text-white px-[70px] py-[9px] rounded-lg"
                        @click="firebaseAddSingleItem">Add Product</button>
                </div>
            </div>

            <!-- Mobile filtering -->
            <div class="flex justify-between w-[90%] mt-5 lg:hidden">
                <select @change="filterProducts($event.target.value)"
                    class="bg-white text-main border border-main rounded-xl p-2 uppercase font-bold">
                    <option :value="'all'" :selected="selectedProductType === 'all'">All</option>
                    <option :value="'face'" :selected="selectedProductType === 'face'">Face</option>
                    <option :value="'eye'" :selected="selectedProductType === 'eye'">Eye</option>
                    <option :value="'hair'" :selected="selectedProductType === 'hair'">Hair</option>
                    <option :value="'serum'" :selected="selectedProductType === 'serum'">Serum</option>
                </select>
            </div>

            <!-- Displaying and editing products -->
            <div class="w-[100%] flex flex-wrap my-7">
                <!-- Looping through all products -->
                <div class="lg:w-[21%] w-[45%] mx-[2%]  border border-main rounded-3xl my-3"
                    v-for="product in filteredProducts" :key="product.id">
                    <router-link :to="'/product/' + product.id" class="flex flex-col items-center">
                        <div v-if="product.productImages && product.productImages.length > 0">
                            <img download class="w-48 h-48 object-cover object-center rounded-3xl"
                                :src="product.productImages[0]" alt="Product Image" />
                        </div>
                        <h1 class="text-text text-[17px] uppercase relative text-center top-[-10px] font-bold mb-2">
                            {{ product.productName }}
                        </h1>
                    </router-link>
                </div>
                <hr>
            </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref, computed } from 'vue';
import useProducts from '../modules/products.js';
import isAdmin from '../modules/isAdmin.js';

const {
    products,
    getProductsData,
    firebaseAddSingleItem,
    addProductData,
    handleImageUpload,
} = useProducts();

let isAdminUser = ref(false);
let selectedProductType = ref('all');

// Assuming you have access to the user ID from somewhere (e.g., via Firebase Auth)
import { auth } from '../firebase.js'; // Assuming you have a firebase.js file exporting the auth object
import { onAuthStateChanged } from 'firebase/auth';

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            isAdmin(user.uid).then((isAdmin) => {
                isAdminUser.value = isAdmin;
                // Once isAdmin is resolved, you can call getProductsData
                getProductsData();
            }).catch((error) => {
                console.error('Error checking admin role:', error);
            });
        } else {
            isAdminUser.value = false;
            // Once isAdmin is resolved, you can call getProductsData
            getProductsData();
        }
    });
});

const filterProducts = (type) => {
    selectedProductType.value = type;
};

const filteredProducts = computed(() => {
    if (selectedProductType.value === 'all') {
        return products.value;
    }
    return products.value.filter(product => product.productType === selectedProductType.value);
});
</script>

<style scoped>
.active-filter {
    background-color: #5d89b3;
    /* Change to your desired active color */
    color: white;
}
</style>
