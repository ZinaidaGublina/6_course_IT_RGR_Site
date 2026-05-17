const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /api/bookings - Создать бронирование
router.post('/', bookingController.createBooking);

// GET /api/bookings - Получить все бронирования (с фильтрацией и пагинацией)
// Query params: ?status=confirmed&roomType=econom&page=1&limit=10
router.get('/', bookingController.getAllBookings);

// GET /api/bookings/:id - Получить бронирование по ID
router.get('/:id', bookingController.getBookingById);

// PUT /api/bookings/:id - Полностью обновить бронирование
router.put('/:id', bookingController.updateBooking);

// PATCH /api/bookings/:id - Частично обновить бронирование
router.patch('/:id', bookingController.updateBooking);

// PATCH /api/bookings/:id/status - Изменить статус
router.patch('/:id/status', bookingController.updateStatus);

// DELETE /api/bookings/:id - Удалить бронирование
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;