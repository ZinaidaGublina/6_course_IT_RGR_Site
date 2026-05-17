<template>
  <section class="rooms-section">
    <h1 class="page-title">Номера и цены</h1>
    
    <div class="rooms-container">
      <div 
        v-for="(room, index) in rooms" 
        :key="room.id" 
        :class="['room-card', { reverse: index % 2 === 1 }]"
      >
        <div class="room-info">
          <h3 class="room-name">{{ room.name }}</h3>
          <p class="room-description">{{ room.description }}</p>
        </div>
        <div class="room-image">
          <img :src="room.image" :alt="room.name">
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const rooms = ref([
  {
    id: 1,
    name: 'Эконом от 2500 руб.',
    description: '16 м.кв. Современная мебель, сан.узел, холодильник, Телевизор ЖК, кондиционер, фен, тапочки, халаты, душевые принадлежности, в сан.узле полы с подогревом, повышенная звукоизоляция, бесплатный WiFi.',
    image: '/images/room-econom.PNG'
  },
  {
    id: 2,
    name: 'Комфорт от 3500 руб.',
    description: '16 м.кв. Современная мебель, сан.узел, холодильник, Телевизор ЖК, кондиционер, фен, тапочки, халаты, душевые принадлежности, в сан.узле полы с подогревом, повышенная звукоизоляция, бесплатный WiFi.',
    image: '/images/room-comfort.PNG'
  },
  {
    id: 3,
    name: 'Бизнес от 5500 руб.',
    description: 'Современная мебель, сан.узел 15 кв.м.(джакузи, душ.кабина, туалет, биде, телевизор, шезлонги), холодильник, Телевизор ЖК, кондиционер, фен, тапочки, халаты, душевые принадлежности, в сан.узле полы с подогревом, повышенная звукоизоляция, бесплатный WiFi.',
    image: '/images/room-business.PNG'
  }
])
</script>

<style scoped>
.rooms-section {
    padding: 100px 2rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
}

.page-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3rem;
    font-weight: 400;
}

.rooms-container {
    display: flex;
    flex-direction: column;
    gap: 4rem;
}

.room-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    padding: 2rem;
}

/* Шахматный порядок - меняем местами колонки */
.room-card.reverse {
    direction: rtl;
}

.room-card.reverse > * {
    direction: ltr;
}

.room-info {
    padding: 1rem;
}

.room-name {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
    font-weight: 600;
}

.room-description {
    color: #666;
    line-height: 1.8;
    font-size: 1rem;
}

.room-image img {
    width: 100%;
    height: 350px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
    .room-card,
    .room-card.reverse {
        grid-template-columns: 1fr;
        direction: ltr;
    }
    
    .room-card.reverse > * {
        direction: ltr;
    }
    
    .room-image img {
        height: 250px;
    }
}
</style>