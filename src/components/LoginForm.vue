<template>
    <div class="w-full h-screen flex justify-center items-center px-4">
        <div class="w-full max-w-lg px-6 py-10 bg-white rounded-3xl shadow-2xl flex flex-col font-futura items-center">
            <img class="w-32 drop-shadow-md" src="../images/dermaLogo.png" alt="DermaOXY Logo">
            <h1 class="text-text mt-4 mb-6 text-center drop-shadow-md">Sign in to continue to DermaOXY's media bank</h1>

            <!-- Error message display -->
            <div v-if="errorMessage"
                class="w-full max-w-md mb-4 text-red-500 bg-red-100 border border-red-400 rounded-xl p-3">
                {{ errorMessage }}
            </div>
            <!-- Login Form -->
            <div class="w-full max-w-md mb-4 px-3 flex border border-border rounded-2xl items-center">
                <img class="w-5 pr-2 border-r border-border py-2" src="../images/user.svg" alt="User Icon">
                <input class="w-full pl-3 py-2" placeholder="Username" v-model="email" />
            </div>
            <div class="w-full max-w-md mb-4 px-3 flex border border-border rounded-2xl items-center">
                <img class="w-5 pr-2 border-r border-border py-2" src="../images/lock.svg" alt="Lock Icon">
                <input class="w-full pl-3 py-2" placeholder="Password" type="password" v-model="password" />
            </div>
            <label class="w-full max-w-md flex items-center mb-6">
                <input class="w-4 h-4" type="checkbox">
                <h1 class="text-text ml-3">Remember me?</h1>
            </label>
            <button class="w-full max-w-md bg-main text-white py-3 rounded-xl font-bold drop-shadow-md"
                @click="logIn">LOG IN</button>
        </div>


    </div>
</template>

<script setup>
import login from '../modules/login.js';
const { email, password, logIn, errorMessage } = login();
</script>
