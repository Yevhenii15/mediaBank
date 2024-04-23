<!-- LoginForm.vue -->
<template>
    <div>
        <h1>Log In form</h1>
        <input placeholder="Username" v-model="email" />
        <input placeholder="Password" type="password" v-model="password" />
        <button @click="logIn">Login</button>
    </div>
</template>

<script setup>
import { login } from '../modules/login.js';
const { email, password, logIn } = login();

</script>

<style scoped>

</style>