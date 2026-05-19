// server/api.js
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Глобальная переменная для кеширования подключения
let isConnected = false;

// Функция подключения к БД
const connectDB = async () => {
  if (isConnected) {
    console.log('✅ MongoDB уже подключена');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Таймаут 5 секунд
    });
    isConnected = true;
    console.log('✅ MongoDB подключена');
  } catch (err) {
    console.error('❌ Ошибка MongoDB:', err.message);
    // Не выбрасываем ошибку — позволяем функции работать
  }
};

// Тестовый маршрут (быстрый ответ)
app.get('/', async (req, res) => {
  await connectDB();
  res.status(200).json({ 
    message: 'API Cat\'s Ghostly Aura',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Роуты
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

// Создаём handler
const handler = serverless(app);

// === ВСЕ ТРИ ВАРИАНТА ЭКСПОРТА ОДНОВРЕМЕННО ===
module.exports = handler;           // Вариант 1
module.exports.handler = handler;   // Вариант 2
exports.default = handler;          // Вариант 3
// =============================================