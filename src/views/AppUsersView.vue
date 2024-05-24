<template>
  <div
    class="px-5 lg:px-0 font-futura flex flex-col items-center w-full py-5 relative top-[10vh] lg:top-[15vh] mb-[10vh]">
    <div class="h1text flex justify-start w-full md:w-3/4 px-4 md:px-0">
      <h1 class="text-2xl text-main">Add New User:</h1>
    </div>
    <!-- Error message display -->
    <div v-if="errorMessage"
      class="w-full md:w-3/4 px-4 md:px-4 lg:px-3 mb-4 text-red-500 bg-red-100 border border-red-400 rounded-xl p-2">
      {{ errorMessage }}
    </div>
    <div class="info flex flex-col md:flex-row justify-between w-full md:w-3/4 px-4 md:px-0 mt-3 mb-5">
      <div class="emailcl w-full md:w-2/5 mb-4 md:mb-0">
        <h1 class="text-text">Email</h1>
        <input class="border rounded-lg border-text w-full p-2" v-model="email" />
      </div>
      <div class="passwordcl w-full md:w-2/5">
        <h1>Password</h1>
        <input class="border rounded-lg border-text w-full p-2" type="password" v-model="password" />
      </div>
    </div>
    <div class="flex flex-col md:flex-row justify-between w-full md:w-3/4 px-4 md:px-0">
      <div class="w-full md:w-1/4 flex justify-between mb-4 md:mb-0 text-lg">
        <label class="flex items-center">
          <input type="radio" value="user" v-model="selectedRole" class="mr-2" /> User
        </label>
        <label class="flex items-center">
          <input type="radio" value="admin" v-model="selectedRole" class="mr-2" /> Admin
        </label>
      </div>
      <button class="bg-main text-white px-6 py-2 rounded-2xl" @click="handleSignUp">Save</button>
    </div>

    <!-- Display users -->
    <div class="w-full md:w-3/4 px-4 md:px-0 mt-5">
      <h2 class="text-2xl text-main mb-4">All Users:</h2>
      <div class="flex flex-col bg-white">
        <div class="flex py-2 border-b border-main font-bold justify-between">
          <div class="w-1/3 pl-4">Email</div>
          <div class="w-1/3 flex justify-end pr-4">
            <div class="w-1/2 flex justify-end">User</div>
            <div class="w-1/2 flex justify-end">Admin</div>
          </div>
        </div>
        <div v-for="user in users" :key="user.email" class="flex justify-between py-2 border-b">
          <div class="w-1/3 pl-4">{{ user.email }}</div>
          <div class="w-1/3 flex justify-end pr-4">
            <div class="w-1/2 flex justify-end">
              <input class="checkbox-blue" type="checkbox" disabled :checked="user.role === 'user'" />
            </div>
            <div class="w-1/2 flex justify-end">
              <input class="checkbox-blue" type="checkbox" disabled :checked="user.role === 'admin'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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