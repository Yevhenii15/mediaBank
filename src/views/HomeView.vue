<!-- HomeView.vue -->
<template>
  <div>
    <div>

      <h1 class="text-h1">Sign Up form</h1>
      <input placeholder="Email" v-model="email" />
      <input placeholder="Password" type="password" v-model="password" />
      <label>
        <input type="radio" value="user" v-model="selectedRole" /> User
      </label>
      <label>
        <input type="radio" value="admin" v-model="selectedRole" /> Admin
      </label>
      <button @click="signUp(selectedRole)">Sign Up</button>

      <hr>

      <h1>Log In form</h1>
      <input placeholder="Username" v-model="email" />
      <input placeholder="Password" type="password" v-model="password" />
      <button @click="logIn">Login</button>
      
      <hr>

      <button class="bg-red" @click="logOut">Log Out</button>

    </div>
  </div>

  <div class="icons flex justify-around">
    <a href="/equipment"
      class="equipment w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px]">
      <img src="../images/equipment.svg" alt="">
      <h1 class="flex justify-center p-3 font-futura text-main text-p mt-[25px]">Equipment</h1>
    </a>
    <a href="/products" class="products w-[20%] flex px-[78px] py-5 flex-col border-[1px] border-border rounded-[52px]">
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
</template>

<script setup>
import { login } from '../modules/login.js';
const { email, password, signUp, logOut, logIn } = login();

import { ref } from 'vue';

const selectedRole = ref('user'); // Default role is user
</script>
