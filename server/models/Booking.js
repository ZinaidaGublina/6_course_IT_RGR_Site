// server/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fio: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  guestFio: String,
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, required: true, min: 0 },
  rooms: { type: Number, required: true, min: 1 },
  roomType: { 
    type: String, 
    enum: ['econom', 'comfort', 'business'],
    default: 'econom'
  },
  comment: String,
  totalCost: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true // createdAt, updatedAt
});

// ВАЖНО: правильный экспорт!
module.exports = mongoose.model('Booking', bookingSchema);