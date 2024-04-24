<!-- AppView.vue -->
<template>

  <body class="font-futura flex items-center flex-col w-[100%]">
    <div class="h1text">
      <h1 class="text-p text-main">User Info:</h1>
    </div>
    <div class="info flex justify-between w-[100%]">
      <div class="emailcl">
        <h1 class="text-text">Email</h1>
        <input class="border rounded-lg border-text" v-model="email" />
      </div>
      <div class="passwordcl">
        <h1>Password</h1>
        <input placeholder="" type="password" v-model="password" />
      </div>
    </div>
    <div>
      <label>
        <input type="radio" value="user" v-model="selectedRole" /> User
      </label>
      <label>
        <input type="radio" value="admin" v-model="selectedRole" /> Admin
      </label>
      <button @click="signUp(selectedRole)">Sign Up</button>
    </div>
  </body>
</template>

<script setup>
import { login } from '../modules/login.js';
const { email, password, signUp } = login();

import { ref } from 'vue';

const selectedRole = ref('user'); // Default role is user
</script>