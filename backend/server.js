const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '40611492e3a8327a9d9a2927ddc37c7d83696172b3f373162a844228817d541d46ba6945fd316c0c8b69f6524e5ee5fa7edc51ac1817f2898ac13111f4837a2e';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Pawan@123',
  database: process.env.DB_NAME || 'servicehub'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check if user already exists
    const checkUser = 'SELECT id FROM users WHERE email = ?';
    db.query(checkUser, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const insertUser = 'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)';
      db.query(insertUser, [fullName, email, phone, passwordHash], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        const userId = results.insertId;
        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          token,
          user: { id: userId, fullName, email, phone }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = 'SELECT id, full_name, email, phone, password_hash FROM users WHERE email = ? AND is_active = TRUE';
    db.query(findUser, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const getUserInfo = 'SELECT id, full_name, email, phone FROM users WHERE id = ?';
  db.query(getUserInfo, [req.user.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    res.json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone
    });
  });
});

// Get all services
app.get('/api/services', (req, res) => {
  const getServices = 'SELECT id, name, description, base_price, duration_hours, category FROM services WHERE is_active = TRUE';
  db.query(getServices, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Create a booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const { serviceId, bookingDate, bookingTime, serviceAddress, customerPhone, specialNotes } = req.body;
    const userId = req.user.userId;

    // Get service details for pricing
    const getService = 'SELECT base_price FROM services WHERE id = ?';
    db.query(getService, [serviceId], (err, serviceResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (serviceResults.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const totalPrice = serviceResults[0].base_price;

      // Insert booking
      const insertBooking = `
        INSERT INTO bookings (user_id, service_id, booking_date, booking_time, service_address, customer_phone, special_notes, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(insertBooking, [userId, serviceId, bookingDate, bookingTime, serviceAddress, customerPhone, specialNotes, totalPrice], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create booking' });
        }

        res.status(201).json({
          success: true,
          message: 'Booking created successfully',
          bookingId: results.insertId
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's booking history
app.get('/api/bookings/my-history', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  const getBookings = `
    SELECT 
      b.id,
      s.name as service_name,
      t.full_name as technician_name,
      b.booking_date,
      b.booking_time,
      b.service_address,
      b.status,
      b.total_price,
      b.created_at,
      s.duration_hours,
      COALESCE(t.rating, 0) as technician_rating
    FROM bookings b
    JOIN services s ON b.service_id = s.id
    LEFT JOIN technicians t ON b.technician_id = t.id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `;

  db.query(getBookings, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      success: true,
      bookings: results
    });
  });
});

// Get booking statistics for user
app.get('/api/bookings/stats', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  const getStats = `
    SELECT 
      COUNT(*) as total_bookings,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
      SUM(CASE WHEN status IN ('pending', 'confirmed', 'in_progress') THEN 1 ELSE 0 END) as upcoming_bookings,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings
    FROM bookings 
    WHERE user_id = ?
  `;

  db.query(getStats, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const stats = results[0];
    res.json({
      success: true,
      stats: {
        total: parseInt(stats.total_bookings),
        completed: parseInt(stats.completed_bookings),
        upcoming: parseInt(stats.upcoming_bookings),
        cancelled: parseInt(stats.cancelled_bookings)
      }
    });
  });
});

// Update booking status (for admin/technician use)
app.put('/api/bookings/:bookingId/status', authenticateToken, (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  const userId = req.user.userId;

  // First check if the booking belongs to the user
  const checkBooking = 'SELECT id FROM bookings WHERE id = ? AND user_id = ?';
  db.query(checkBooking, [bookingId, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Booking not found or access denied' });
    }

    // Update status (users can only cancel their bookings)
    if (status !== 'cancelled') {
      return res.status(403).json({ error: 'You can only cancel your bookings' });
    }

    const updateStatus = 'UPDATE bookings SET status = ? WHERE id = ?';
    db.query(updateStatus, [status, bookingId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update booking' });
      }

      res.json({
        success: true,
        message: 'Booking status updated successfully'
      });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;