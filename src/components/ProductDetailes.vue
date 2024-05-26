<template>
  <div v-if="product" class="flex flex-col md:flex-row font-futura pt-10 relative top-[10vh] lg:top-[15vh] mb-[15vh] p-5">
    <a href="/products"><img src="../images/right-arrow.png" class="lg:w-[100%] " alt=""></a>
    <!-- Product Images -->
    <div class="w-full md:w-1/2 flex flex-wrap justify-center px-4 md:px-0 mb-8 md:mb-0">
      <!-- Main product image -->
      <div class="relative w-full flex justify-center">
        <img class="w-full md:w-96 h-96 object-cover object-center cursor-pointer border border-main"
          :src="product.productImages[0]" alt="Main Product Image" @click="toggleDeleteButton(0)" />
      </div>

      <!-- Additional product images -->
      <div class="flex md:w-96 w-full flex-wrap mt-3">
        <div class="grid grid-cols-4 gap-3">
          <div v-for="(image, index) in product.productImages.slice(1)" :key="index" class="relative w-full md:w-auto">
            <img class="border w-[100%] h-24 border-main object-cover object-center cursor-pointer" :src="image"
              alt="Product Image" @click="toggleDeleteButton(index + 1)" />
          </div>
        </div>
      </div>

      <!-- Button to add more images -->
      <div class="w-full md:w-96 mt-4 flex justify-between">
        <div v-if="isAdminUser">
          <input class="hidden" type="file" id="imageInput" name="file" @change="handleImageUpload($event, product)"
            multiple :data-product="product.id" />
          <button
            class="bg-white text-main border border-main px-4 py-2 rounded-lg hover:bg-main hover:text-white font-futura"
            @click="openFileInput('imageInput')">Add Photo</button>
        </div>

        <!-- Delete button for the selected image -->
        <div v-if="isAdminUser">
          <button v-if="selectedImage !== null" @click="deleteImageHandler(product, selectedImage)"
            class="bg-main text-white border px-4 py-2 rounded-lg">Delete</button>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="w-full md:w-1/2 px-4">
      <input v-if="isAdminUser" class="w-full uppercase text-[50px] mb-4 text-text" v-model="newProductName" type="text"
        placeholder="New Product Name">
      <h1 v-if="!isAdminUser" class="w-full uppercase text-[50px] mb-4 text-text">{{ newProductName }}</h1>
      <h1 class="text-text uppercase my-3 text-p">Description</h1>
      <textarea v-if="isAdminUser" class="w-full text-h3 h-28 text-text" v-model="newProductDescription"
        placeholder="New Product Description"></textarea>
      <h1 v-if="!isAdminUser" class="w-full text-h3 h-28 text-text">{{ newProductDescription }}</h1>

      <!-- Update and Delete Buttons -->
      <div class="flex gap-4 my-5">
        <button v-if="isAdminUser"
          class="bg-white text-main border border-main px-6 py-2 rounded-lg hover:bg-main hover:text-white"
          @click="firebaseUpdateSingleItem(product, newProductName, newProductDescription)">Update
          Product</button>
        <button v-if="isAdminUser"
          class="bg-white text-main border border-main px-6 py-2 rounded-lg hover:bg-main hover:text-white"
          @click="firebaseDeleteSingleItem(productId, product)">Delete Product</button>
      </div>

      <!-- Files -->
      <div class="mt-7 w-full">
        <h1 class="text-text uppercase text-p">Files</h1>

        <!-- Language Filter Dropdown -->
        <div>
          <select v-model="selectedFilterLanguage" class="border border-main p-2 rounded-lg my-2">
            <option value="">All Languages</option>
            <option value="danish">Danish</option>
            <option value="english">English</option>
            <option value="polish">Polish</option>
            <option value="ukrainian">Ukrainian</option>
          </select>
        </div>
        <!-- Pop-up window for update confirmation -->
        <div v-if="showUpdatePopup"
          class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div class="bg-white p-5 rounded shadow-md flex justify-center items-center gap-10">
            <p class="text-h3">Product updated successfully!</p>
            <button class=" bg-main text-white px-3 py-1 rounded-lg" @click="closeUpdatePopup">OK</button>
          </div>
        </div>

        <!-- File List -->
        <ul>
          <li v-for="(file, index) in filteredFiles" :key="index" class="flex justify-between">
            <a class="my-1" :href="file.url" download>{{ getFileName(file.url) }}</a>
            <div>
              <button v-if="isAdminUser" @click="deleteFileHandler(product, index)"
                class="text-text underline px-4 rounded-lg">Delete File</button>
              <button class="bg-white text-main border border-main px-4 py-2 rounded-lg hover:bg-main hover:text-white"
                @click="downloadFile(file.url)">Download File</button>
            </div>
          </li>
        </ul>

        <!-- Add File Input and Language Selection -->
        <div v-if="isAdminUser" class="w-full my-2">
          <div v-if="errorMessage" class="my-4 text-red-500 bg-red-100 border border-red-400 rounded-xl p-2">
            {{ errorMessage }}
          </div>
          <input class="hidden" type="file" id="fileInput" name="file" @change="handleFileUpload($event, product)"
            multiple :data-product="product.id" />
          <select v-model="selectedLanguage" class="border border-main p-2 rounded-lg">
            <option disabled value="">Select Language</option>
            <option value="danish">Danish</option>
            <option value="english">English</option>
            <option value="polish">Polish</option>
            <option value="ukrainian">Ukrainian</option>
          </select>
          <button
            class="bg-white text-main border border-main px-4 py-2 rounded-lg hover:bg-main hover:text-white font-futura"
            @click="openFileInput('fileInput')">Add File</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>error</div>
</template>



<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useProducts from '../modules/products.js';
import isAdmin from '../modules/isAdmin.js';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

const {
  getProductById,
  handleImageUpload,
  deleteImage,
  handleFileUpload,
  deleteFile,
  downloadFile,
  selectedLanguage,
  errorMessage,
  firebaseUpdateSingleItem,
  firebaseDeleteSingleItem,
  showUpdatePopup
} = useProducts();

const route = useRoute();
const router = useRouter();
const productId = ref(route.params.id);
const product = ref(null);
const isAdminUser = ref(false);
const selectedImage = ref(null);

const newProductName = ref('');
const newProductDescription = ref('');


const selectedFilterLanguage = ref('');

const filteredFiles = computed(() => {
  if (!selectedFilterLanguage.value) {
    return product.value ? product.value.productFiles : [];
  }
  return product.value.productFiles.filter(file => file.language === selectedFilterLanguage.value);
});

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAdmin(user.uid)
        .then((isAdmin) => {
          isAdminUser.value = isAdmin;
        })
        .catch((error) => {
          console.error('Error checking admin role:', error);
        });
    }
  });

  getProductById(productId.value).then((fetchedProduct) => {
    product.value = fetchedProduct;
    newProductName.value = fetchedProduct.productName;
    newProductDescription.value = fetchedProduct.productDescription;
  }).catch((error) => {
    console.error('Error fetching product:', error);
  });
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      productId.value = newId;
      getProductById(newId).then((fetchedProduct) => {
        product.value = fetchedProduct;
        newProductName.value = fetchedProduct.productName;
        newProductDescription.value = fetchedProduct.productDescription;
      }).catch((error) => {
        console.error('Error fetching product:', error);
      });
    }
  }
);

const toggleDeleteButton = (index) => {
  if (selectedImage.value === index) {
    selectedImage.value = null;
  } else {
    selectedImage.value = index;
  }
};

const deleteImageHandler = (product, selectedImage) => {
  deleteImage(product, selectedImage);
};

const deleteFileHandler = (product, index) => {
  deleteFile(product, index).catch(error => {
    console.error('Error in deleteFileHandler:', error);
  });
};

const openFileInput = (inputId) => {
  document.getElementById(inputId).click();
};
const closeUpdatePopup = () => {
  showUpdatePopup.value = false;
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
</script>
