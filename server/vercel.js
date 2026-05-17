// server/vercel.js
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();
const bookingRoutes = require('./routes/bookings');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Cat\'s Ghostly Aura' });
});

// Подключение к БД
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключена'))
  .catch(err => console.error('❌ Ошибка:', err));

// Экспорт для Vercel
module.exports.handler = serverless(app);