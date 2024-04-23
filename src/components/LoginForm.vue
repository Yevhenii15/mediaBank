<!-- LoginForm.vue -->
<template>

    <body class="w-[100%] h-[100vh] flex justify-center items-center">
        <div class=" px-3 py-10 big-border flex flex-col font-futura items-center  w-[50%] rounded-3xl shadow-2xl">
            <img class="w-[130px] drop-shadow-md" src="../images/dermaLogo.png" alt="">
            <h1 class="text-text mt-2 mb-5 drop-shadow-md">Sign in to continue to DermaOXY's media bank</h1>
            <div class="username  w-[65%] px-3  flex border border-border rounded-2xl">
                <img class="w-[7%] pr-2 border-r border-border py-2" src="../images/user.svg" alt="">
                <input class="w-[93%] pl-2" placeholder="Username" v-model="email" />
            </div>
            <div class="password my-4 w-[65%] px-3  flex border border-border rounded-2xl">
                <img class="w-[7%] pr-2 border-r border-border py-2" src="../images/lock.svg" alt="">
                <input class="w-[93%] pl-2" placeholder="Password" type="password" v-model="password" />
            </div>
            <label class="checkbox-container w-[65%] flex justify-start">
                <input class="w-[20px]" type="checkbox">
                <h1 class="text-text ml-3">Remember me?</h1>
            </label>
            <button class="drop-shadow-md bg-main text-white py-2 px-10 rounded-xl font-bold mt-8" @click="logIn">LOG
                IN</button>
        </div>
    </body>

</template>

<script setup>
import { login } from '../modules/login.js';
const { email, password, logIn } = login();

</script>

<style scoped></style>