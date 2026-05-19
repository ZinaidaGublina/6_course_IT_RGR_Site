// server/api.js
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');
const { connectDB } = require('./db'); // Импортируем утилиту

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware для гарантии подключения БД перед каждым запросом
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Cat\'s Ghostly Aura',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Роуты
const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});


// === ВСЕ ТРИ ВАРИАНТА ЭКСПОРТА ОДНОВРЕМЕННО ===
module.exports = handler;           // Вариант 1
module.exports.handler = handler;   // Вариант 2
exports.default = handler;          // Вариант 3
// =============================================