<template>
    <div class="about">
      <h1>This is an about page</h1>
  
      <button class="btn-add" @click="firebaseAddSingleItem()">Add Item</button>
  
      <div>
        <input v-model="addProductData.productName" type="text" placeholder="Product Name">
        <input v-model="addProductData.productPrice" type="text" placeholder="Product Price">
      </div>
  
      <div v-for="product in products" :key="product">
        <p> 
          Title: {{ product.productName }} 
        </p>
        <p> 
          Price: {{ product.productPrice }}
        </p>
        <button class="btn-delete" @click="firebaseDeleteSingleItem(product.id)">Delete item</button>
       
        <p>
          <input v-model="product.productName" type="text" placeholder="New Product Name" >
          <input v-model="product.productPrice" type="text" placeholder="New Product Price">
        </p>
  
        <button class="btn-edit" @click="firebaseUpdateSingleItem(product.id)">Edit Item</button>
        <hr>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import useProducts from '../modules/products'
  import { onMounted } from 'vue'
  
  const { products, getProductsData, firebaseDeleteSingleItem, firebaseAddSingleItem, addProductData, firebaseUpdateSingleItem, /* updateProductData */ } = useProducts()
  
  
  onMounted(getProductsData)
  
  
  
  </script>
  
  <style>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
  </style>