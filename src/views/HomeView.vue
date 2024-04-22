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
</template>

<script setup>
import { login } from '../modules/login.js';
const { email, password, signUp, logOut, logIn } = login();

import { ref } from 'vue';

const selectedRole = ref('user'); // Default role is user
</script>
