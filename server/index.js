require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookingRoutes = require('./routes/bookings');

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL || '*' // '*' только для теста, в проде домен Vercel
  ],
  credentials: true
}));
app.use(express.json()); // Парсинг JSON
app.use(express.urlencoded({ extended: true })); // Парсинг URL-encoded данных

// ==================== ROUTES ====================
app.use('/api/bookings', bookingRoutes);

// Приветственный маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'API сервер Cat\'s Ghostly Aura',
    version: '1.0.0',
    endpoints: {
      bookings: '/api/bookings'
    }
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не найден'
  });
});

// Глобальная обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера'
  });
});

// ==================== DATABASE CONNECTION ====================
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB подключена');
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error('❌ Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('👋 MongoDB отключена, сервер остановлен');
  process.exit(0);
});