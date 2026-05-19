// server/api/bookings.js
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

export default async function handler(req, res) {
  let conn;
  
  try {
    // Подключаемся к БД
    conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB подключена');
    
    const { method } = req;
    
    if (method === 'GET') {
      const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
      
      // ЗАКРЫВАЕМ соединение ПЕРЕД отправкой ответа
      await mongoose.disconnect();
      console.log('👋 MongoDB отключена');
      
      return res.status(200).json({ 
        success: true, 
        count: bookings.length, 
        data: bookings 
      });
    }
    
    if (method === 'POST') {
      const booking = new Booking(req.body);
      await booking.save();
      
      await mongoose.disconnect();
      
      return res.status(201).json({ 
        success: true, 
        data: booking 
      });
    }
    
    // Для других методов
    await mongoose.disconnect();
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    // Закрываем соединение даже при ошибке
    if (conn) {
      await mongoose.disconnect();
    }
    
    return res.status(500).json({ 
      error: error.message 
    });
  }
}