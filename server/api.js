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

// Подключение к БД (не блокируем экспорт)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ Ошибка MongoDB:', err.message));

console.log('🔍 [DEBUG] перед экспортом');

// Экспорт для Vercel
const handler = serverless(app);
console.log('🔍 [DEBUG] handler создан:', typeof handler);

module.exports.handler = handler;

console.log('🔍 [DEBUG] api.js завершён');