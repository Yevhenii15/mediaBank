<template>
  <div
    class="px-5 lg:px-0 flex flex-col justify-center h-[84.5vh] md:px-[10%] lg:p-0 relative top-[12vh] mb-[12vh]">
    <div class="icons flex flex-wrap justify-between lg:justify-around w-[100%]">
      <a href="/equipment/4q14YRVaI3XFGN2Wvm5Y"
        class="icon-link lg:w-[20%] w-[45%] flex px-[40px] lg:px-[78px] lg:py-5 py-4 flex-col border-[1px] border-border rounded-[40px] lg:rounded-[52px] mb-4 lg:mb-0">
        <img src="../images/equipment.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p lg:mt-[25px]">Equipment</h1>
      </a>
      <a href="/products"
      class="icon-link lg:w-[20%] w-[45%] flex px-[40px] lg:px-[78px] lg:py-5 py-4 flex-col border-[1px] border-border rounded-[40px] lg:rounded-[52px] mb-4 lg:mb-0">
        <img src="../images/products.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p lg:mt-[25px]">Products</h1>
      </a>
      <a href="/some"
      class="icon-link lg:w-[20%] w-[45%] flex lg:px-[78px] lg:py-5 py-4 flex-col border-[1px] border-border rounded-[40px] lg:rounded-[52px] mb-4 lg:mb-0">
        <img class="mx-[40px] lg:mx-0" src="../images/some posts.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p lg:mt-[25px]">SoMe posts</h1>
      </a>
      <a v-if="isAdminUser" href="/app-users"
      class="icon-link lg:w-[20%] w-[45%] flex lg:px-[78px] lg:py-5 py-4 flex-col border-[1px] border-border rounded-[40px] lg:rounded-[52px] mb-4 lg:mb-0">
        <img class="mx-[40px] lg:mx-0" src="../images/appusers.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p lg:mt-[25px]">App Users</h1>
      </a>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';
import useProducts from '../modules/products.js';
import isAdmin from '../modules/isAdmin.js';

const { getProductsData } = useProducts();

const isAdminUser = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAdmin(user.uid).then((isAdminStatus) => {
        isAdminUser.value = isAdminStatus;
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
</script>
