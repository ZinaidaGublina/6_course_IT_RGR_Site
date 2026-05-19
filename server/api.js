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

// Тестовый маршрут
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API Cat\'s Ghostly Aura is running!',
    status: 'ok'
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

// Подключение к MongoDB (не блокируем)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ Ошибка MongoDB:', err.message));

// Создаём handler
const handler = serverless(app);

// === ВСЕ ТРИ ВАРИАНТА ЭКСПОРТА ОДНОВРЕМЕННО ===
module.exports = handler;           // Вариант 1
module.exports.handler = handler;   // Вариант 2
exports.default = handler;          // Вариант 3
// =============================================