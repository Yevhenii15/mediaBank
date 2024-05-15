<!-- AppUsersView.vue -->

<template>

  <body class="font-futura flex flex-col items-center w-[100%] py-5 relative top-[15vh] mb-[15vh]">
    <div class="h1text flex justify-start w-[70%]">
      <h1 class="text-[25px] text-main">User Info:</h1>
    </div>
    <div class="info flex justify-between w-[70%] mt-3 mb-5">
      <div class="emailcl w-[45%]">
        <h1 class="text-text">Email</h1>
        <input class="border rounded-lg border-text w-[100%]" v-model="email" />
      </div>
      <div class="passwordcl w-[45%]">
        <h1>Password</h1>
        <input class="border rounded-lg border-text w-[100%]" type="password" v-model="password" />
      </div>
    </div>
    <div class="flex justify-between w-[70%]">
      <div class="w-[20%] flex justify-between text-h3">
        <label>
          <input type="radio" value="user" v-model="selectedRole" /> User
        </label>
        <label>
          <input type="radio" value="admin" v-model="selectedRole" /> Admin
        </label>
      </div>
      <button class="bg-main text-white px-[60px] rounded-2xl" @click="handleSignUp">Save</button>
    </div>
  </body>
</template>


<script setup>
import { ref } from 'vue';
import login from '../modules/login.js'; // Remove curly braces
const { signUp } = login();

const email = ref('');
const password = ref('');
const selectedRole = ref('user'); // Default role is user

const handleSignUp = async () => {
  await signUp(email.value, password.value, selectedRole.value);
  email.value = '';
  password.value = '';
};
</script>