<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-link" active-class="router-link-active">ГЛАВНАЯ</router-link>
      <router-link to="/rooms" class="nav-link" active-class="router-link-active">НОМЕРА И ЦЕНЫ</router-link>
      <router-link to="/booking" class="nav-link" active-class="router-link-active">БРОНИРОВАНИЕ</router-link>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
/* Стили уже в main.css */
</style>