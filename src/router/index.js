import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Rooms from '../views/Rooms.vue'
import Booking from '../views/Booking.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/rooms', name: 'rooms', component: Rooms },
    { path: '/booking', name: 'booking', component: Booking },
  ],
})

export default router
