<template>

  <body class="font-futura flex flex-col items-center w-[100%] py-5 relative top-[15vh] mb-[15vh]">
    <div class="h1text flex justify-start w-[70%]">
      <h1 class="text-[25px] text-main">Add New User:</h1>
    </div>
    <!-- Error message display -->
    <div v-if="errorMessage" class="w-[70%] mb-4 text-red-500 bg-red-100 border border-red-400 rounded-xl p-2">
      {{ errorMessage }}
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

    <!-- Display users -->
    <div class="w-[70%] mt-5">
      <h2 class="text-[25px] text-main mb-4">All Users:</h2>
      <div class="flex flex-col bg-white">
        <div class="flex py-2 border-b border-main font-bold justify-between">
          <div class="w-1/3 pl-4">Email</div> <!-- Adjusted alignment -->
          <div class="w-1/3 flex">
            <div class="w-1/2 justify-end flex pr-6">User</div> <!-- Justify between -->
            <div class="w-1/2 justify-end flex pr-5">Admin</div> <!-- Justify end -->
          </div>
        </div>
        <div v-for="user in users" :key="user.email" class="flex justify-between py-2 border-b">
          <div class="w-1/3 pl-4">{{ user.email }}</div> <!-- Adjusted alignment -->
          <div class="flex w-1/3 ">
            <div class="w-1/2 flex justify-end pr-7 ">
              <input class="checkbox-blue" type="checkbox" disabled :checked="user.role === 'user'" />
            </div>
            <div class="w-1/2 flex justify-end pr-8">
              <input class="checkbox-blue" type="checkbox" disabled :checked="user.role === 'admin'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import login from '../modules/login.js';

const { signUp, errorMessage, fetchAllUsers } = login();

const email = ref('');
const password = ref('');
const selectedRole = ref('user'); // Default role is user
const users = ref([]);

const handleSignUp = async () => {
  await signUp(email.value, password.value, selectedRole.value);
  email.value = '';
  password.value = '';
  loadUsers(); // Reload users after signup
};

const loadUsers = async () => {
  try {
    users.value = await fetchAllUsers();
  } catch (error) {
    console.error('Failed to load users:', error);
  }
};

onMounted(() => {
  loadUsers(); // Load users on component mount
});
</script>

<style scoped>
.checkbox-blue {
  position: relative;
  width: 20px;
  height: 20px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

.checkbox-blue:checked {
  background-color: #5d89b3;
  /* DodgerBlue color */
  border-color: #5d89b3;
}

.checkbox-blue:checked::before {
  content: '✔';
  display: block;
  text-align: center;
  color: white;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  line-height: 20px;
}
</style>
