<template>
  <div
    class=" h-[170vh] px-5 lg:px-0 flex flex-col justify-center  sm:h-[84.5vh] lg:h-[84.5vh] relative top-[12vh] mb-[12vh]">
    <div class="icons flex flex-wrap justify-center md:justify-around">
      <a href="/equipment/4q14YRVaI3XFGN2Wvm5Y"
        class="icon-link w-[45%] md:w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px] mb-4 md:mb-0">
        <img src="../images/equipment.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">Equipment</h1>
      </a>
      <a href="/products"
        class="icon-link w-[45%] md:w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px] mb-4 md:mb-0">
        <img src="../images/products.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">Products</h1>
      </a>
      <a href="/some"
        class="icon-link w-[45%] md:w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px] mb-4 md:mb-0">
        <img src="../images/some posts.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">SoMe posts</h1>
      </a>
      <a v-if="isAdminUser" href="/app-users"
        class="icon-link w-[45%] md:w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px] mb-4 md:mb-0">
        <img src="../images/appusers.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">App Users</h1>
      </a>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 800px) {
  .icons {
    flex-direction: column;
    align-items: center;
  }

  .icon-link {
    width: 90%;
  }
}
</style>


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
