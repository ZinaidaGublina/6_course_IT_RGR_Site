// server/api.js
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Простой тестовый маршрут (без БД!)
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API Cat\'s Ghostly Aura is running!',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Роуты (подключаем)
const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Подключение к БД (НЕ ждём его для ответа!)
// Это важно: функция должна ответить сразу, а БД подключится в фоне
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ Ошибка MongoDB:', err.message));

// Экспорт для Vercel — ПРОСТОЙ ВАРИАНТ
module.exports.handler = serverless(app);