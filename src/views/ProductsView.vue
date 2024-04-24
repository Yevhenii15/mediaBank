<!-- ProductView.vue
 --><template>
    <div>
        <div>
            <!-- Title for section -->
            <h1>Add new product</h1>
            <!-- Form for adding new product -->
            <div>
                <input v-model="addProductData.productName" type="text" placeholder="Product Name">
                <input v-model="addProductData.productDescription" type="text" placeholder="Product Description">
                <input type="file" @change="handleImageUpload($event, null)" multiple :data-product="null">
                <button @click="firebaseAddSingleItem">Add Item</button>
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
                    <button @click="firebaseDeleteSingleItem(product.id)">Delete item</button>
                    <!-- Update item -->
                    <p>
                        <input v-model="product.productName" type="text" placeholder="New Product Name">
                        <input v-model="product.productDescription" type="text" placeholder="New Product Description">
                        <!-- After you upload img you should click edit update -->
                        <input type="file" @change="handleImageUpload($event, product)" multiple
                            :data-product="product.id">
                    </p>
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

const { products, getProductsData, firebaseDeleteSingleItem, firebaseAddSingleItem, addProductData, firebaseUpdateSingleItem, deleteImage, handleImageUpload, addItemToArray, deleteItemFromArray } = useProducts();

onMounted(getProductsData);
</script>