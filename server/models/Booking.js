const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fio: {
    type: String,
    required: [true, 'ФИО обязательно'],
    trim: true,
    minlength: [3, 'Минимум 3 символа'],
    maxlength: [100, 'Максимум 100 символов']
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Некорректный email']
  },
  guestFio: {
    type: String,
    trim: true
  },
  checkin: {
    type: Date,
    required: [true, 'Дата заезда обязательна']
  },
  checkout: {
    type: Date,
    required: [true, 'Дата выезда обязательна']
  },
  adults: {
    type: Number,
    required: [true, 'Количество взрослых обязательно'],
    min: [1, 'Минимум 1 взрослый'],
    max: [20, 'Максимум 20 взрослых']
  },
  children: {
    type: Number,
    default: 0,
    min: [0, 'Не может быть отрицательным']
  },
  rooms: {
    type: Number,
    required: [true, 'Количество номеров обязательно'],
    min: [1, 'Минимум 1 номер'],
    max: [10, 'Максимум 10 номеров']
  },
  roomType: {
    type: String,
    required: [true, 'Тип номера обязателен'],
    enum: {
      values: ['econom', 'comfort', 'business'],
      message: 'Недопустимый тип номера'
    }
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Максимум 500 символов']
  },
  totalCost: {
    type: Number,
    required: [true, 'Стоимость обязательна'],
    min: [0, 'Не может быть отрицательной']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled'],
      message: 'Недопустимый статус'
    },
    default: 'pending'
  }
}, {
  timestamps: true // Автоматически добавляет createdAt и updatedAt
});

// Индекс для быстрого поиска по email
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkin: 1, checkout: 1 });

module.exports = mongoose.model('Booking', bookingSchema);