<!-- HomeView.vue -->
<template>
  <div class="flex flex-col justify-center h-[84.2vh]">
    <div>


      <button class="bg-red" @click="logOut">Log Out</button>

    </div>

    <div class="icons flex justify-around">
      <a href="/equipment"
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
      <a href="/app-users"
        class="app-users w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px]">
        <img src="../images/appusers.svg" alt="">
        <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">App Users</h1>
      </a>
    </div>
  </div>
</template>

<script setup>

import { login } from '../modules/login.js';
const { logOut } = login();
</script>
