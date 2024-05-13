<!-- ProductView.vue
 --><template>
    <div class="font-futura flex justify-center w-[100%]">
        <div class="w-[60%]">
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
        </div>
            <!-- Displaying and editing products -->
            <div class="w-[100%] flex flex-wrap my-7">
                <!-- Looping through all products -->
                <div class="w-[21%] mx-[2%]  border border-main rounded-3xl my-3" v-for="product in products"
                    :key="product.id">
                    <router-link :to="'/product/' + product.id" class="flex flex-col items-center">
                        <div v-for="(image, index) in product.productImages" :key="index">
                            <img download class="w-48 h-48 object-cover object-center rounded-3xl" :src="image"
                                alt="Product Image" />
                        </div>
                        <h1 class="text-text text-[17px] uppercase relative top-[-10px] font-bold mb-2">
                            {{ product.productName }}
                        </h1>
                    </router-link>
                </div>
                <hr>
            </div>
        </div>
    </div>
</template>

// ProductView.vue
<script setup>
import { onMounted } from 'vue';
import useProducts from '../modules/products.js';
import isAdmin from '../modules/isAdmin.js'; 

const {
  products,
  getProductsData,
  firebaseAddSingleItem,
  addProductData,
  handleImageUpload,
  handleFileUpload,
} = useProducts();

let isAdminUser = false;

// Assuming you have access to the user ID from somewhere (e.g., via Firebase Auth)
import { auth } from '../firebase.js'; // Assuming you have a firebase.js file exporting the auth object
import { onAuthStateChanged } from 'firebase/auth';

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAdmin(user.uid).then((isAdmin) => {
        isAdminUser = isAdmin;
        // Once isAdmin is resolved, you can call getProductsData
        getProductsData();
      }).catch((error) => {
        console.error('Error checking admin role:', error);
      });
    } else {
      isAdminUser = false;
      // Once isAdmin is resolved, you can call getProductsData
      getProductsData();
    }
  });
});
</script>
