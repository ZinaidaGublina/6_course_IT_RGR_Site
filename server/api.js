// server/api.js
console.log('🔍 [DEBUG] api.js начал выполняться');

const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

console.log('🔍 [DEBUG] модули импортированы');

const app = express();

// Пытаемся подключить роуты с обработкой ошибок
try {
  const bookingRoutes = require('./routes/bookings');
  console.log('🔍 [DEBUG] routes/bookings подключены');
  app.use('/api/bookings', bookingRoutes);
} catch (err) {
  console.error('❌ [DEBUG] Ошибка при подключении роутов:', err.message);
  throw err; // Пробрасываем ошибку, чтобы Vercel её увидел
}

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Тестовый маршрут
app.get('/', (req, res) => {
  console.log('🔍 [DEBUG] GET / вызван');
  res.json({ message: 'API Cat\'s Ghostly Aura is running!' });
});

// Подключение к БД
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ Ошибка:', err));

// Создаём handler
const handler = serverless(app);

// ЭКСПОРТ ДЛЯ VERCEL (пробуем разные варианты)
module.exports = handler;           // Вариант 1: прямой экспорт
module.exports.handler = handler;   // Вариант 2: именованный экспорт
exports.default = handler;          // Вариант 3: default export