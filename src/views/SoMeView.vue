<template>
  <div class="flex flex-col items-center font-futura relative lg:top-[15vh] top-[10vh] mb-[15vh]  px-[5%]">
    <div v-if="isAdminUser" class="w-[100%] flex items-center flex-col mt-[20px]">
      <h1 class="text-text font-futura text-p">ADD SOME POST</h1>
      <div class="lg:w-[50%] w-[90%] flex justify-between  my-[20px]">
        <input :disabled="isLoading" class="file:bg-main w-[70%]  
    file:text-white
    file:border-none
    lg:file:px-[40px]
    file:px-[10%]
    file:py-[9px]
    file:rounded-lg
    file:mr-5
    file:hover:bg-text
    font-futura " type="file" @change="handleMediaUpload($event)" multiple :data-product="null">
<button :disabled="isLoading" class="hover:bg-text w-[30%] bg-main text-white lg:px-[70px] py-[9px] rounded-lg" @click="reloadPage">Add Post</button>
      </div>
      <h1 class="my-4 text-main border border-main rounded-xl p-2 lg:w-[50%] w-[90%]" v-if="isLoading">Loading...</h1>

    </div>

    <!-- Filter Buttons -->
    <div class="lg:flex hidden flex-col w-[11%] fixed left-0">
      <button @click="filterMedia('all')"
        :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7 uppercase my-3 font-bold border-l-0', { 'active-filter': selectedMediaType === 'all' }]">All</button>
      <button @click="filterMedia('image')"
        :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7 uppercase my-3 font-bold border-l-0', { 'active-filter': selectedMediaType === 'image' }]">Images</button>
      <button @click="filterMedia('video')"
        :class="['bg-white flex text-main border border-main rounded-e-3xl p-2 pl-7 uppercase my-3 font-bold border-l-0', { 'active-filter': selectedMediaType === 'video' }]">Videos</button>
    </div>

    <div class="flex justify-between w-[90%] lg:hidden">
    <select @change="filterMedia($event.target.value)" class="bg-white text-main border border-main rounded-xl p-2 uppercase font-bold">
        <option :value="'all'" :selected="selectedMediaType === 'all'">All</option>
        <option :value="'image'" :selected="selectedMediaType === 'image'">Images</option>
        <option :value="'video'" :selected="selectedMediaType === 'video'">Videos</option>
    </select>
</div>


    <div class="lg:w-[60%] w-[90%] my-6 flex flex-row flex-wrap">
      <div class="lg:w-[21%] w-[45%] mx-[2%] flex flex-col" v-for="(media, index) in filteredMediaList" :key="index">
        <img v-if="isImage(media)" class="w-[100%] h-60 object-cover object-center border border-main rounded-3xl"
          :src="media.url" alt="Image">
        <video v-if="!isImage(media)" class="w-[100%] h-60 object-cover object-center border border-main rounded-3xl"
          controls>
          <source :src="media.url" type="video/mp4">
        </video>
        <div :class="isAdminUser ? 'admin' : 'user'" class="flex w-[100%] mb-10">
          <button v-if="isAdminUser" class="bg-main text-white px-[12px] py-[0.5px] rounded-md mt-3"
            @click="deleteMediaHandler(media.url)">Delete</button>
          <button :class="isAdminUser ? 'admin-download' : 'user-download'"
            class="bg-main text-white py-[0.5px] rounded-md mt-3" @click="downloadMedia(media.url)">Download</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import SoMePost from '../modules/some.js';
const { handleImageUpload, handleVideoUpload, getMediaFromStorage, deleteMedia } = SoMePost();

import { ref, onMounted } from 'vue';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

const storage = getStorage(); // Initialize Firebase Storage
const mediaList = ref([]);
const filteredMediaList = ref([]);
const selectedMediaType = ref('all');

const handleMediaDeletion = (deletedMediaUrl) => {
  mediaList.value = mediaList.value.filter(media => media.url !== deletedMediaUrl);
  filterMedia(selectedMediaType.value); // Update filtered list after deletion
};

const deleteMediaHandler = (mediaUrl) => {
  deleteMedia(mediaUrl, handleMediaDeletion);
};

onMounted(async () => {
  mediaList.value = await getMediaFromStorage();
  filterMedia('all'); // Initialize the filtered list
});

const reloadPage = () => {
  location.reload();
};

const isImage = (media) => {
  return media.type === 'image';
};

const filterMedia = (type) => {
  selectedMediaType.value = type;
  if (type === 'all') {
    filteredMediaList.value = mediaList.value;
  } else {
    filteredMediaList.value = mediaList.value.filter(media => media.type === type);
  }
};

import useProducts from '../modules/products.js';
import isAdmin from '../modules/isAdmin.js';
const isLoading = ref(false);

const {
  getProductsData,
} = useProducts();

let isAdminUser = false;

import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAdmin(user.uid).then((isAdmin) => {
        isAdminUser = isAdmin;
        getProductsData();
      }).catch((error) => {
        console.error('Error checking admin role:', error);
      });
    } else {
      isAdminUser = false;
      getProductsData();
    }
  });
});

const downloadMedia = async (mediaUrl) => {
  try {
    const mediaRef = storageRef(storage, mediaUrl); // Get the reference using the initialized storage
    const downloadUrl = await getDownloadURL(mediaRef);

    // Fetch the media data as a blob
    const response = await fetch(downloadUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch media (${response.status} ${response.statusText})`);
    }

    const blob = await response.blob();

    // Extract filename without query parameters and duplicate extensions
    const filenameParts = mediaUrl.split('/').pop().split('?')[0].split('%2F').slice(-1)[0].split('.');
    let filename = filenameParts.slice(0, -1).join('.');
    filename = filename.replace(/%20/g, '-'); // Replace %20 with -
    const extension = filenameParts.pop();
    const filenameWithExtension = `${filename}.${extension}`;

    // Create a blob URL for the media
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filenameWithExtension; // Set the filename correctly
    a.style.display = 'none'; // Hide the link
    document.body.appendChild(a);

    // Simulate a click event on the link
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading media:', error);
  }
};






const handleMediaUpload = async (event) => {
  isLoading.value = true;

  const files = event.target.files;
  const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
  const videoFiles = Array.from(files).filter(file => file.type.startsWith('video/'));

  try {
    const uploadPromises = [];

    if (imageFiles.length) {
      uploadPromises.push(handleImageUpload({ target: { files: imageFiles } }));
    }

    if (videoFiles.length) {
      uploadPromises.push(handleVideoUpload({ target: { files: videoFiles } }));
    }

    await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading media:', error);
  } finally {
    isLoading.value = false;
  }
};

</script>



<style scoped>
.admin {
  justify-content: space-between;
}

.user {
  justify-content: center;
}

.admin-download {
  padding-left: 12px;
  padding-right: 12px;
}

.user-download {
  padding-left: 25px;
  padding-right: 25px;
}

.active-filter {
  background-color: #5d89b3;
  /* Change to your desired active color */
  color: white;
}
</style>
