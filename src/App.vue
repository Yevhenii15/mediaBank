<template>
  <header v-if="isLoggedIn">
    <div class="wrapper font-futura fixed w-full z-10">
      <h1 class="bg-[#5d88b3] font-futura text-white p-0.5 text-center">Media Bank</h1>
      <nav class="relative lg:px-7 lg:py-5 flex justify-between items-center bg-gradient-main">
        
        <div class="flex">
            <RouterLink to="/"><img src="./images/logo.png" alt="Logo" class="w-[150px]  p-3 lg:p-0"></RouterLink>
            <!-- web menu -->
            <ul class="hidden lg:flex lg:items-center  lg:space-x-6 ml-20">
              <li v-for="link in filteredLinks" :key="link.to">
                <RouterLink :to="link.to" :class="{ active: isActive(link.to) }" class="text-h3 mx-2">
                  {{ link.name }}
                </RouterLink>
              </li>
            </ul>
        </div>

        
        <div class="lg:hidden">
              <button class="navbar-burger flex items-center text-white p-3 lg:p-0" @click="toggleMenu">
                <svg class="block h-7 w-7 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <title>Mobile menu</title>
                  <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                </svg>
              </button>
            </div>
        <div class="relative hidden lg:inline-block dropdown">
          <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 448 512">
            <path fill="#ffffff" d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
          </svg>
          <div class="hidden absolute z-1 dropdown-content bg-white border border-main px-[10px] w-[100px] right-0 text-center py-[10px] text-main text-h3 font-bold">
            <button class="bg-red" @click="logOut">Log Out</button>
          </div>
        </div>

      </nav>
      <div class="navbar-menu relative z-50 hidden">
        <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25" @click="toggleMenu"></div>
        <nav class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm bg-white border-r overflow-y-auto">
          <div class="flex items-center  border-b-border border-b py-6 px-4">
            <RouterLink to="/" class="mr-auto">
              <img src="./images/logo.png" alt="Logo" class="h-9"/>
            </RouterLink>
            <button class="navbar-close" @click="toggleMenu">
              <svg class="h-8 w-8 text-black cursor-pointer hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <ul>
            <li v-for="link in filteredLinks" :key="link.to" class="mb-1 py-3 px-4 border-b-border border-b">
              <RouterLink :to="link.to" :class="{ active: isActive(link.to) }" class="text-p font-futura">
                {{ link.name }}
              </RouterLink>
            </li>
            <li class="text-p py-3 px-4 border-b-border border-b "><button class="uppercase  font-futura " @click="logOut">Log Out</button></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  <RouterView />
  <footer v-if="isLoggedIn">
    <h1 class="bg-[#5d88b3] font-futura fixed w-[100%] bottom-0 text-white p-0.5 text-center">2024</h1>
  </footer>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import login from './modules/login.js';
import useProducts from './modules/products.js';
import isAdmin from './modules/isAdmin.js';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

const { isLoggedIn, logOut } = login();
const { getProductsData } = useProducts();
const isAdminUser = ref(false);
const menuOpen = ref(false);

const route = useRoute();

const links = [
  { name: 'EQUIPMENT', to: '/equipment/4q14YRVaI3XFGN2Wvm5Y' },
  { name: 'PRODUCTS', to: '/products' },
  { name: 'SOME POSTS', to: '/some' },
  { name: 'APP USERS', to: '/app-users', adminOnly: true },
];

const filteredLinks = computed(() => {
  return links.filter(link => !link.adminOnly || isAdminUser.value);
});

const isActive = (linkTo) => {
  if (linkTo.startsWith('/equipment')) {
    return route.path.startsWith('/equipment');
  } else if (linkTo.startsWith('/products')) {
    return route.path.startsWith('/products') || route.path.startsWith('/product/');
  }
  return route.path.startsWith(linkTo);
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  const menu = document.querySelector('.navbar-menu');
  if (menuOpen.value) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAdmin(user.uid).then((isAdmin) => {
        isAdminUser.value = isAdmin;
        getProductsData();
      }).catch((error) => {
        console.error('Error checking admin role:', error);
      });
    } else {
      isAdminUser.value = false;
      getProductsData();
    }
  });
});
// Close the mobile menu when navigating to another page
watch(route, () => {
  if (menuOpen.value) {
    toggleMenu();
  }
});
</script>

<style scoped>

.navbar-admin {
  width: 70%;
}

.navbar-user {
  width: 60%;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.navMenus a {
  color: #000;
  text-decoration: none;
  padding: 10px;
}

.active {
  color: #5d88b3;
}
</style>
