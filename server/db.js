// server/db.js
const mongoose = require('mongoose');

let isConnected = false;
let isConnecting = false;

exports.connectDB = async () => {
  if (isConnected) {
    console.log('ℹ️ [DB] Уже подключены');
    return;
  }
  
  if (isConnecting) {
    console.log('⏳ [DB] Ждём подключения...');
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
  console.log('🔌 [DB] Начинаю подключение...');
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('✅ [DB] MongoDB подключена');
  } catch (err) {
    console.error('❌ [DB] Ошибка:', err.message);
    throw err;
  } finally {
    isConnecting = false;
  }
};

exports.isConnected = () => isConnected;