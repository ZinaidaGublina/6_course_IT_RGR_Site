// server/db.js
const mongoose = require('mongoose');

let isConnected = false;
let isConnecting = false;

exports.connectDB = async () => {
  // Если уже подключены — выходим
  if (isConnected) {
    return;
  }
  
  // Если уже идёт подключение — ждём его завершения
  if (isConnecting) {
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (isConnected) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
    return;
  }
  
  isConnecting = true;
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ MongoDB подключена');
  } catch (err) {
    console.error('❌ Ошибка MongoDB:', err.message);
    throw err;
  } finally {
    isConnecting = false;
  }
};

exports.isConnected = () => isConnected;