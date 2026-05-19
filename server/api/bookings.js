// server/api/bookings.js — Vercel API Route
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  
  isConnected = true;
  console.log('✅ MongoDB подключена');
};

export default async function handler(req, res) {
  // Подключаемся к БД
  await connectDB();
  
  const { method } = req;
  
  try {
    switch (method) {
      case 'GET':
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({ 
          success: true, 
          count: bookings.length, 
          data: bookings 
        });
        break;
        
      case 'POST':
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json({ 
          success: true, 
          data: booking 
        });
        break;
        
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message 
    });
  }
}