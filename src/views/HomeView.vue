<script setup>
import useProducts from '../modules/products';

const { products } = useProducts();
</script>

<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <h2>{{ product.name }}</h2>
      <p>{{ product.quanity }}</p>
      <!-- Add more fields as needed -->
    </div>
  </div>
</template>

