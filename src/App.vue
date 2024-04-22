<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <!-- Show the admin link only when user is logged in and is admin -->
        <RouterLink  to="/admin">Admin</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';


</script>


<style scoped>

</style>
