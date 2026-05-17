<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  fio: '',
  phone: '',
  email: '',
  guestFio: '',
  checkin: '',
  checkout: '',
  adults: 1,
  children: 0,
  rooms: 1,
  roomType: 'econom',
  comment: ''
})

const showModal = ref(false)
const showConfirmModal = ref(false) // Новое окно подтверждения
const modalTitle = ref('')
const modalContent = ref('')
const modalConfirm = ref(true)
const bookingData = ref(null) // Данные для отправки

const openModal = (title, content, showConfirm = true) => {
  modalTitle.value = title
  modalContent.value = content
  modalConfirm.value = showConfirm
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  showConfirmModal.value = false
}

// Открытие окна подтверждения с деталями
const showBookingConfirmation = () => {
  // Валидация
  if (!form.fio || !form.email || !form.checkin || !form.checkout) {
    alert('Заполните все обязательные поля (*)')
    return
  }

  const d1 = new Date(form.checkin)
  const d2 = new Date(form.checkout)
  
  if (d2 <= d1) {
    alert('Дата выезда должна быть позже даты заезда!')
    return
  }

  // Расчет
  const nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
  const prices = { econom: 2500, comfort: 3500, business: 5500 }
  const typeNames = { econom: 'Эконом', comfort: 'Комфорт', business: 'Бизнес' }
  const total = nights * prices[form.roomType] * form.rooms

  const formatDate = d => d.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })

  // Сохраняем данные для отправки
  bookingData.value = {
    fio: form.fio,
    phone: form.phone,
    email: form.email,
    guestFio: form.guestFio,
    checkin: form.checkin,
    checkout: form.checkout,
    adults: form.adults,
    children: form.children,
    rooms: form.rooms,
    roomType: form.roomType,
    comment: form.comment,
    totalCost: total
  }

  // Показываем окно подтверждения
 const detailsHtml = `
  <div style="line-height: 1.8;">
    <p><strong>📅 Заезд:</strong> ${formatDate(d1)}</p>
    <p><strong>📅 Выезд:</strong> ${formatDate(d2)}</p>
    <p><strong>🌙 Ночей:</strong> ${nights}</p>
    <p><strong>🛏 Тип номера:</strong> ${typeNames[form.roomType]}</p>
    <p><strong>🔢 Количество номеров:</strong> ${form.rooms}</p>
    <p><strong>👥 Гости:</strong> ${form.adults} взр. / ${form.children} дет.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 1rem 0;">
    <p style="font-size: 1.3rem; font-weight: 700; text-align: center; color: #8b0000;">
      💰 Итого: ${total.toLocaleString('ru-RU')} руб.
    </p>
    <p style="font-size: 0.85rem; color: #888; text-align: center;">
      (${prices[form.roomType].toLocaleString('ru-RU')} ₽ × ${nights} ноч. × ${form.rooms} ном.)
    </p>
  </div>
  `

  openModal('~ Подтверждение брони ~', detailsHtml, true)
  showConfirmModal.value = true
}

// Отправка на сервер после подтверждения
const confirmBooking = async () => {
  if (!bookingData.value) return

  try {
    const API_BASE = import.meta.env.VITE_API_URL

const res = await fetch(`${API_BASE}/api/bookings`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bookingData.value)
})

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Ошибка сервера')

    // Успешное сохранение
    openModal('Успешно!', `
      <div style="text-align:center; padding:1rem;">
        <div style="font-size:3rem; margin-bottom:0.5rem;">🎉</div>
        <p style="font-weight:600; color:#2e7d32; font-size:1.1rem;">
          Бронирование сохранено!
        </p>
        <p style="color:#666; margin-top:0.5rem; font-size:0.9rem;">
          ID: ${data.data._id}
        </p>
        <p style="color:#888; margin-top:0.5rem; font-size:0.85rem;">
          Мы свяжемся с вами для подтверждения
        </p>
      </div>
    `, false)

    // Очистка формы
    Object.assign(form, {
      fio: '',
      phone: '',
      email: '',
      guestFio: '',
      checkin: '',
      checkout: '',
      adults: 1,
      children: 0,
      rooms: 1,
      roomType: 'econom',
      comment: ''
    })

    bookingData.value = null

  } catch (err) {
    alert('Ошибка при сохранении: ' + err.message)
    console.error(err)
  }
}

const handleBooking = (e) => {
  e.preventDefault()
  showBookingConfirmation()
}
</script>

<template>
  <section class="booking-section">
    <div class="booking-overlay"></div>
    
    <div class="booking-container">
      <h2 class="decorative-text">Cat's ghostly aura</h2>
      
      <div class="booking-form-wrapper">
        <h3 class="form-title">~ Бронирование ~</h3>
        
        <form @submit.prevent="handleBooking" class="booking-form">
          <!-- ФИО -->
          <div class="form-group full-width">
            <label>ФИО <span class="required">*</span></label>
            <input v-model="form.fio" type="text" required placeholder="Иванов Иван Иванович">
          </div>

          <!-- Телефон и Email -->
          <div class="form-row">
            <div class="form-group">
              <label>Ваш телефон</label>
              <input v-model="form.phone" type="tel" placeholder="+7 (999) 000-00-00">
            </div>
            <div class="form-group">
              <label>Email <span class="required">*</span></label>
              <input v-model="form.email" type="email" required placeholder="example@mail.ru">
            </div>
          </div>

          <!-- ФИО отдыхающего -->
          <div class="form-group full-width">
            <label>ФИО отдыхающего</label>
            <input v-model="form.guestFio" type="text" placeholder="Если отличается">
          </div>

          <!-- Даты -->
          <div class="form-row">
            <div class="form-group">
              <label>Дата заезда <span class="required">*</span></label>
              <input v-model="form.checkin" type="date" required>
            </div>
            <div class="form-group">
              <label>Дата отъезда <span class="required">*</span></label>
              <input v-model="form.checkout" type="date" required>
            </div>
          </div>

          <!-- Количество -->
          <div class="form-row three-columns">
            <div class="form-group">
              <label>Взрослых <span class="required">*</span></label>
              <input v-model.number="form.adults" type="number" min="1" required class="small-input">
            </div>
            <div class="form-group">
              <label>Детей <span class="required">*</span></label>
              <input v-model.number="form.children" type="number" min="0" required class="small-input">
            </div>
            <div class="form-group">
              <label>Номеров <span class="required">*</span></label>
              <input v-model.number="form.rooms" type="number" min="1" required class="small-input">
            </div>
          </div>

          <!-- Тип номера -->
          <div class="form-group full-width">
            <label>Тип номера</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="form.roomType" value="econom"> Эконом
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.roomType" value="comfort"> Комфорт
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.roomType" value="business"> Бизнес
              </label>
            </div>
          </div>

          <!-- Комментарий -->
          <div class="form-group full-width">
            <label>Комментарий</label>
            <textarea v-model="form.comment" rows="3" placeholder="Пожелания..."></textarea>
          </div>

          <button type="submit" class="btn-submit">БРОНИРОВАТЬ</button>
        </form>
      </div>
    </div>
  </section>

    <!-- Модальное окно -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay active" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ modalTitle }}</h3>
        <div v-html="modalContent" class="modal-body"></div>
        <div class="modal-actions">
          <!-- Кнопка Отмена (только при подтверждении) -->
          <button 
            v-if="modalConfirm" 
            @click="closeModal" 
            class="btn-modal-cancel"
          >
            Отмена
          </button>
          
          <!-- Кнопка Подтверждаю (только при подтверждении) -->
          <button 
            v-if="modalConfirm" 
            @click="confirmBooking" 
            class="btn-modal-confirm"
          >
            Подтверждаю
          </button>
          
          <!-- Кнопка Закрыть (только при успехе) -->
          <button 
            v-if="!modalConfirm" 
            @click="closeModal" 
            class="btn-modal-confirm"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Все стили остаются без изменений */
.booking-section {
  position: relative;
  min-height: 100vh;
  background: url('/images/hotel-room-bg.PNG') center/cover no-repeat;
  padding: 100px 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.booking-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
}

.booking-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
}

.decorative-text {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  text-align: center;
  color: #fff;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.booking-form-wrapper {
  background: rgba(255,255,255,0.95);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.form-title {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #000;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b0000;
  box-shadow: 0 0 0 3px rgba(139,0,0,0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.three-columns {
  grid-template-columns: 1fr 1fr 1fr;
}

.small-input {
  width: 80px !important;
  text-align: center;
  padding: 0.7rem 0.3rem !important;
}

.required { color: #8b0000; }

.radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.radio-label input { cursor: pointer; }

.btn-submit {
  background: linear-gradient(135deg, #8b0000, #5c0000);
  color: #fff;
  border: none;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 0.5rem;
  text-transform: uppercase;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139,0,0,0.4);
}

/* Модальное окно */
.modal-overlay {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.65);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}
.modal-overlay.active { visibility: visible; opacity: 1; }

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.25);
  text-align: center;
}
.modal-body { margin: 1.5rem 0; text-align: left; line-height: 1.6; }
.modal-actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; }

.btn-modal-cancel, .btn-modal-confirm {
  padding: 0.8rem 1.8rem; border: none; border-radius: 6px;
  font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
}
.btn-modal-cancel { background: #f4f4f4; color: #333; }
.btn-modal-cancel:hover { background: #e8e8e8; }
.btn-modal-confirm { background: linear-gradient(135deg, #8b0000, #5c0000); color: #fff; }
.btn-modal-confirm:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(139,0,0,0.4); }

@media (max-width: 768px) {
  .form-row, .three-columns { grid-template-columns: 1fr; }
  .small-input { width: 100% !important; }
}
</style>