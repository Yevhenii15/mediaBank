<template>
  <div class="flex flex-col justify-center h-[84.2vh]">


    <div class="icons flex justify-around">
      <a href="/oxyequipment"
        class="equipment w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px]">
        <img src="../images/equipment.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">Equipment</h1>
      </a>
      <a href="/products"
        class="products w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px]">
        <img src="../images/products.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">Products</h1>
      </a>
      <a href="/some" class="some-posts w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px]">
        <img src="../images/some posts.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">SoMe posts</h1>
      </a>
      <a v-if="isAdminUser" href="/app-users"
        class="app-users w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px]">
        <img src="../images/appusers.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">App Users</h1>
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
