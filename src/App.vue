<!-- app.vue -->
<template>
  <header v-if="isLoggedIn">
    <div class="wrapper font-futura fixed w-[100%] z-10">
      <h1 class="bg-[#5d88b3] font-futura text-white p-0.5 text-center">Media Bank</h1>
      <nav class="p-[15px] flex items-center justify-between px-[30px]">
        <div class="w-[52%] flex items-center">
          <RouterLink to="/"><img src="./images/logo.png" alt="Logo" class=" w-[150px]"></RouterLink>
          <!-- Show the admin link only when user is logged in and is admin -->
          <div :class="isAdminUser ? 'navbar-admin' : 'navbar-user'"
            class="navMenus flex justify-between text-text text-h3 ml-[70px]">
            <RouterLink to="/oxyequipment">EQUIPMENT</RouterLink>
            <RouterLink to="/products">PRODUCTS</RouterLink>
            <RouterLink to="/some">SOME POSTS</RouterLink>
            <RouterLink v-if="isAdminUser" to="/app-users">APP USERS</RouterLink>

          </div>
        </div>
        <div class="relative inline-block dropdown">
          <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 448 512">
            <path fill="#ffffff"
              d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
          </svg>
          <div
            class="hidden absolute z-1 dropdown-content bg-white border border-main px-[10px] w-[100px] right-0 text-center py-[10px] text-main text-h3 font-bold">
            <button class="bg-red" @click="logOut">Log Out</button>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
  <footer v-if="isLoggedIn">
    <h1 class="bg-[#5d88b3] font-futura text-white p-0.5 text-center">2024</h1>
  </footer>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
const { isLoggedIn } = login();
import { onMounted, ref } from 'vue'; // Import ref from Vue

import useProducts from './modules/products.js';
import isAdmin from './modules/isAdmin.js';

const {

  getProductsData,

} = useProducts();

// Use ref to make isAdminUser reactive
const isAdminUser = ref(null);

// Assuming you have access to the user ID from somewhere (e.g., via Firebase Auth)
import { auth } from './firebase.js'; // Assuming you have a firebase.js file exporting the auth object
import { onAuthStateChanged } from 'firebase/auth';
import login from './modules/login.js';

const { logOut } = login();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAdmin(user.uid).then((isAdmin) => {
        // Update isAdminUser value using .value with ref
        isAdminUser.value = isAdmin;
        console.log('isAdminUser:', isAdminUser.value);
        getProductsData(); // Move the call inside the isAdmin check
      }).catch((error) => {
        console.error('Error checking admin role:', error);
      });

    } else {
      isAdminUser.value = false; // Update isAdminUser value
      getProductsData();
    }
  });
});
</script>



<style scoped>
nav {
  background: rgb(255, 255, 255);
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(93, 137, 179, 1) 100%);
}

.navbar-admin {
  width: 70%;
}

.navbar-user {
  width: 50%;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>