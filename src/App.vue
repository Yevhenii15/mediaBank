<!-- AppView.vue -->
<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <!-- Show the admin link only when user is logged in -->
        <RouterLink v-if="isLoggedIn" to="/admin">Admin</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged function
import { auth } from './firebase'; // Import auth object from firebase.js
import { ref } from 'vue'; // Import ref function from Vue

const isLoggedIn = ref(false); // Reactive variable to track login status

// Check if user is logged in whenever authentication state changes
onAuthStateChanged(auth, (user) => {
  isLoggedIn.value = !!user; // Update isLoggedIn based on whether user is logged in
});

</script>

<style scoped>

</style>
