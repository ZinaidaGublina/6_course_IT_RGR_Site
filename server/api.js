// server/api.js
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');
const { connectDB } = require('./db');

const app = express();

console.log('🚀 [API] Сервер запускается...');

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`📥 [API] ${req.method} ${req.path}`);
  next();
});

// JSON middleware с логированием
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({ origin: '*' }));

// Middleware для БД
app.use(async (req, res, next) => {
  console.log('🔌 [DB] Подключение к MongoDB...');
  try {
    await connectDB();
    console.log('✅ [DB] MongoDB готова');
    next();
  } catch (err) {
    console.error('❌ [DB] Ошибка:', err.message);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// Тестовый маршрут
app.get('/', (req, res) => {
  console.log('📤 [ROUTE] Отправка ответа для /');
  res.json({ 
    message: 'API Cat\'s Ghostly Aura',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Роуты с логированием
console.log('📦 [ROUTE] Подключение bookingRoutes...');
const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', (req, res, next) => {
  console.log(`📥 [ROUTE] /api/bookings -> ${req.method}`);
  bookingRoutes(req, res, next);
});

// 404
app.use((req, res) => {
  console.log(`⚠️ [404] ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 [ERROR]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Экспорт
console.log('📤 [EXPORT] Создание handler...');
const handler = serverless(app);
// === ВСЕ ТРИ ВАРИАНТА ЭКСПОРТА ОДНОВРЕМЕННО ===
module.exports = handler;           // Вариант 1
module.exports.handler = handler;   // Вариант 2
exports.default = handler;          // Вариант 3
// =============================================
console.log('✅ [EXPORT] Handler создан');

