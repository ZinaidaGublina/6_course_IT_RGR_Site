<template>
  <Navbar />
  <main>
    <router-view />
  </main>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
/* Глобальные стили, если нужно */
main {
  min-height: 100vh;
}
</style>
