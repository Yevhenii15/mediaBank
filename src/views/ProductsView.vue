<!-- ProductView.vue
 --><template>
    <div class="font-futura flex justify-center w-[100%]">
        <div class="w-[60%]">
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
                    <option value="serum-device">Serum Device</option>
                </select>
            </div>
            <div class="flex my-8">
                <input class="w-[48%] border border-main rounded-lg pl-3 pt-1 pb-11 mr-[2%]"
                    v-model="addProductData.productDescription" type="text" placeholder="Product Description">
                <div class="w-[48%] ml-[2%] flex flex-col justify-between">

                    <input
                        class="w-[100%] file:w-[75%] file:bg-white file:text-main file:border file:border-main file:px-[40px] file:py- file:rounded-lg file:mr-5 file:hover:bg-main file:hover:text-white font-futura"
                        type="file" @change="handleImageUpload($event, null)" multiple :data-product="null">
                    <input
                        class="w-[100%] file:w-[75%] file:bg-white file:text-main file:border file:border-main file:px-[40px] file:py- file:rounded-lg file:mr-5 file:hover:bg-main file:hover:text-white font-futura"
                        type="file" @change="handleFileUpload($event, null)" multiple :data-product="null">
                </div>

            </div>
            <div class="flex justify-center w-[100%]">
                <button class="flex w-[40%] justify-center bg-main text-white px-[70px] py-[9px] rounded-lg"
                    @click="firebaseAddSingleItem">Add Product</button>
            </div>
            <!-- Displaying and editing products -->
            <div>
                <!-- Looping through all products -->
                <div v-for="product in products" :key="product.id">
                    <div v-for="(image, index) in product.productImages" :key="index">
                        <img :src="image" alt="Product Image" />
                        <!-- To delete img you need to click delete button and after edit update -->
                        <button @click="deleteImage(product, index)">Delete Image</button>
                    </div>
                    <p>
                        Title: <span>{{ product.productName }}</span>
                    </p>
                </div>
                <div v-for="product in products" :key="product.id">
                    <p>
                        Description: <span>{{ product.productDescription }}</span>
                    </p>

                    <!-- Delete item -->
                    <button @click="firebaseDeleteSingleItem(product.id, product)">Delete item</button>

                    <!-- Update item -->
                    <p>
                        <input v-model="product.productName" type="text" placeholder="New Product Name">
                        <input v-model="product.productDescription" type="text" placeholder="New Product Description">
                        <!-- After you upload img you should click edit update -->
                        <input type="file" @change="handleImageUpload($event, product)" multiple
                            :data-product="product.id">
                        <input type="file" @change="handleFileUpload($event, product)" multiple
                            :data-product="product.id">
                    </p>
                    <div>

                        <!-- Displaying files -->
                        <div v-for="(file, index) in product.productFiles" :key="index">
                            <a :href="file" target="_blank">{{ file }}</a>
                            <!-- Delete file button -->
                            <button @click="deleteFile(product, index)">Delete File</button>
                            <button @click="downloadFile(file)">Download File</button>
                        </div>
                        <!-- Rest of the existing content remains the same... -->
                    </div>

                    <!-- Edit and update, you should it for all changes! -->
                    <button @click="product.isEditing = true">Edit Item</button>
                    <button @click="firebaseUpdateSingleItem(product)" v-if="product.isEditing">Update</button>
                </div>
                <hr>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import useProducts from '../modules/products.js';

const {
    products,
    getProductsData,
    firebaseDeleteSingleItem,
    firebaseAddSingleItem,
    addProductData,
    firebaseUpdateSingleItem,
    deleteImage,
    handleImageUpload,
    deleteFile,        // Add new function
    handleFileUpload, // Add new function
    downloadFile,     // Add new function
} = useProducts();

onMounted(getProductsData);
</script>