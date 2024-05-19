<template>

   

    <div v-if="equipment" class="w-[100%] px-[5%] flex font-futura pt-10  relative top-[15vh] mb-[20vh]">
         <!-- Buttons for other equipment pages -->
    <div class="flex flex-wrap mt-10">
      <button v-for="item in allEquipment" :key="item.id"
        class="bg-main text-white border px-4 py-2 rounded-lg m-2 hover:bg-white hover:text-main"
        @click="goToEquipment(item.id)">
        {{ item.equipmentName }}
      </button>
    </div>
      <div class="pictures w-[50%] flex-col flex items-center">
        <!-- Main equipment image -->
        <div class="relative w-[100%] flex justify-center">
          <img class="w-96 h-96 object-cover object-center cursor-pointer border border-main"
            :src="equipment.equipmentImages[0]" alt="Main Equipment Image" @click="toggleDeleteButton(0)" />
        </div>
  
        <!-- Additional equipment images -->
        <div class="w-96">
          <div class="w-[103%] gap-[3%] flex flex-wrap">
            <div v-for="(image, index) in equipment.equipmentImages.slice(1)" :key="index"
              class="relative w-[22%] mt-5">
              <img class="border w-[100%] h-24 border-main object-cover object-center cursor-pointer"
                :src="image" alt="Equipment Image" @click="toggleDeleteButton(index + 1)" />
              <!-- Delete button for additional images -->
            </div>
          </div>
        </div>
  
        <!-- Button to add more images -->
        <div class="w-96 mt-5 flex">
          <div v-if="isAdminUser">
            <input class="hidden" type="file" id="file" name="file" @change="handleImageUpload($event, equipment)"
              multiple :data-equipment="equipment.id">
            <button
              class="bg-white text-main border border-main px-4 py-2 rounded-lg hover:bg-main hover:text-white font-futura"
              @click="openFileInput">Add Photo</button>
          </div>
  
          <!-- Delete button for the selected image -->
          <div v-if="isAdminUser">
            <button v-if="selectedImage !== null" @click="deleteImageHandler(equipment, selectedImage)"
              class="bg-main text-white border ml-4 px-4 py-2 rounded-lg">Delete</button>
          </div>
        </div>
      </div>
  
      <div class="info w-[50%] flex flex-col">
        <input v-if="isAdminUser" class="w-[100%] uppercase text-[50px] text-text" v-model="newEquipmentName"
          type="text" placeholder="New Equipment Name">
        <h1 v-if="!isAdminUser" class="w-[100%] uppercase text-[50px] text-text">{{ newEquipmentName }}</h1>
        <h1 class="text-text uppercase my-3 text-p">Description</h1>
        <textarea v-if="isAdminUser" class="w-[100%] border border-main rounded-xl px-5 pb-[15%] pt-3"
          v-model="newEquipmentDescription" type="text" placeholder="New Equipment Description"></textarea>
        <p v-if="!isAdminUser" class="w-[100%]">{{ newEquipmentDescription }}</p>
        <div class="mt-7 w-[100%]">
          <h1 class="text-text uppercase text-p">Files</h1>
          <ul>
            <li v-for="(file, index) in equipment.equipmentFiles" :key="index" class="flex justify-between">
              <a class="underline text-main hover:text-text" :href="file" download>Document {{ index + 1 }}</a>
              <button v-if="isAdminUser" @click="deleteFileHandler(equipment, index)"
                class="bg-main text-white border ml-4 px-4 py-2 rounded-lg">Delete</button>
            </li>
          </ul>
          <div class="flex flex-col">
            <input v-if="isAdminUser" class="hidden" type="file" id="file" name="file"
              @change="handleFileUpload($event, equipment)" multiple :data-equipment="equipment.id">
            <button v-if="isAdminUser"
              class="bg-white text-main border border-main px-4 py-2 mt-2 rounded-lg hover:bg-main hover:text-white w-52"
              @click="openFileInput">Add Document</button>
          </div>
          <div v-if="isAdminUser" class="flex justify-center w-[100%]">
            <button @click="updateEquipment"
              class="flex w-[40%] justify-center bg-main text-white px-[70px] py-[9px] rounded-lg mt-5">Update
              Equipment</button>
          </div>
        </div>
        <div v-if="isAdminUser" class="flex justify-center w-[100%]">
          <button @click="deleteEquipmentHandler(equipment.id)"
            class="flex w-[40%] justify-center bg-main text-white px-[70px] py-[9px] rounded-lg mt-5">Delete Equipment</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import useEquipment from '../modules/equipment.js';
  import isAdmin from '../modules/isAdmin.js';
  import { auth } from '../firebase.js';
  import { onAuthStateChanged } from 'firebase/auth';
  
  const { getEquipmentById, handleImageUpload, deleteImage, handleFileUpload, deleteFile, updateEquipmentInFirestore, firebaseDeleteSingleItem, getAllEquipment } = useEquipment();
  
  const route = useRoute();
  const router = useRouter();
  const equipmentId = route.params.id;
  const equipment = ref(null);
  const isAdminUser = ref(false);
  const selectedImage = ref(null);
  
  const newEquipmentName = ref('');
  const newEquipmentDescription = ref('');
  const allEquipment = ref([]);
  
  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isAdmin(user.uid).then((isAdmin) => {
          isAdminUser.value = isAdmin;
        }).catch((error) => {
          console.error('Error checking admin role:', error);
        });
      }
    });
  
    getEquipmentById(equipmentId).then((fetchedEquipment) => {
      equipment.value = fetchedEquipment;
      newEquipmentName.value = fetchedEquipment.equipmentName;
      newEquipmentDescription.value = fetchedEquipment.equipmentDescription;
    });
  
    getAllEquipment().then((fetchedAllEquipment) => {
      allEquipment.value = fetchedAllEquipment;
    });
  });
  
  const toggleDeleteButton = (index) => {
    if (selectedImage.value === index) {
      selectedImage.value = null;
    } else {
      selectedImage.value = index;
    }
  };
  
  const deleteImageHandler = (equipment, selectedImage) => {
    deleteImage(equipment, selectedImage);
  };
  
  const deleteFileHandler = (equipment, index) => {
    deleteFile(equipment, index);
  };
  
  const updateEquipment = () => {
    equipment.value.equipmentName = newEquipmentName.value;
    equipment.value.equipmentDescription = newEquipmentDescription.value;
    updateEquipmentInFirestore(equipment.value);
  };
  
  const deleteEquipmentHandler = (id) => {
    firebaseDeleteSingleItem(id, equipment.value);
  };
  
  const openFileInput = () => {
    document.getElementById('file').click();
  };
  
  const goToEquipment = (id) => {
    router.push(`/equipment/${id}`);
  };
  </script>
  