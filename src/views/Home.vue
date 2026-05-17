<template>
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="ghost-mascot">
        <img :src="ghostImg" alt="Ghost Cat">
      </div>
      <div class="hero-text-strip">
        <h1 class="hero-title">Cat's ghostly aura</h1>
        <hr class="divider-line">
        <p class="hero-subtitle">Лучший выбор для отдыха</p>
      </div>
      <router-link to="/booking" class="btn-primary">Забронировать номер</router-link>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ghostImg from '@/assets/ghost-cat.png'
</script>

<style scoped>
.hero {
    position: relative;
    height: 100vh;
    background: url('/images/hotel-room-bg.PNG') center/cover no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.1);
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.ghost-mascot img {
    width: 250px;
    height: auto;
    margin-bottom: 1rem;
}

.hero-text-strip {
    background-color: rgba(255, 255, 255, 0.4);
    width: 100%;
    border-radius: 0;
    padding: 40px 10%;
    margin-bottom: 2rem;
}

.hero-title {
    font-family: 'Playfair Display', serif;
    font-size: 5rem;
    margin-bottom: 0.5rem;
    color: #000000;
}

.hero-subtitle {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 300;
    margin-bottom: 1.5rem;
    color: #000000;
}

.divider-line {
    border: none;
    height: 2px;
    background-color: #000;
    width: 100%;
    margin: 12px auto;
}
</style>