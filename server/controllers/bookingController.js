const Booking = require('../models/Booking');

// ==================== CREATE ====================
exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({
      success: true,
      message: 'Бронирование успешно создано',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Ошибка при создании бронирования',
      error: error.message
    });
  }
};

// ==================== READ ALL ====================
exports.getAllBookings = async (req, res) => {
  try {
    const { status, roomType, page = 1, limit = 10 } = req.query;
    
    // Фильтры
    const filter = {};
    if (status) filter.status = status;
    if (roomType) filter.roomType = roomType;
    
    // Пагинация
    const skip = (page - 1) * limit;
    
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Booking.countDocuments(filter);
    
    res.json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении данных',
      error: error.message
    });
  }
};

// ==================== READ ONE ====================
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении бронирования',
      error: error.message
    });
  }
};

// ==================== UPDATE ====================
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Вернуть обновлённый документ
        runValidators: true // Проверить валидацию
      }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }
    
    res.json({
      success: true,
      message: 'Бронирование обновлено',
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Ошибка при обновлении бронирования',
      error: error.message
    });
  }
};

// ==================== DELETE ====================
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }
    
    res.json({
      success: true,
      message: 'Бронирование удалено',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении бронирования',
      error: error.message
    });
  }
};

// ==================== UPDATE STATUS ====================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Недопустимый статус'
      });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Бронирование не найдено'
      });
    }
    
    res.json({
      success: true,
      message: `Статус изменён на ${status}`,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Ошибка при обновлении статуса',
      error: error.message
    });
  }
};