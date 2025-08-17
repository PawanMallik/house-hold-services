const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const corsOrigin = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// ✅ Use Pool instead of single connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // Railway SSL
  },
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.send('Household Services API is running ✅');
});

// ✅ Test DB connection
app.get('/api/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('❌ Test query failed:', err.message);
      return res.status(500).json({ error: 'DB connection failed', details: err.message });
    }
    res.json({ success: true, result: results[0].result });
  });
});

// Get all services
app.get('/api/services', (req, res) => {
  const query = `
    SELECT id, name, description, base_price, duration_hours, category
    FROM services
    WHERE is_active = TRUE
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  const checkUser = 'SELECT id FROM users WHERE email = ?';
  db.query(checkUser, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const insertUser =
      'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)';
    db.query(insertUser, [fullName, email, phone, passwordHash], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to create user' });

      const userId = result.insertId;
      const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: { id: userId, fullName, email, phone },
      });
    });
  });
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const query =
    'SELECT id, full_name, email, phone, password_hash FROM users WHERE email = ? AND is_active = TRUE';

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email, phone: user.phone },
    });
  });
});

// Get current user info
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const query = 'SELECT id, full_name, email, phone FROM users WHERE id = ?';
  db.query(query, [req.user.userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

// Test DB connection
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Test query failed:', err);
      return res.status(500).json({ error: 'DB connection failed', details: err.message });
    }
    res.json({ success: true, result: results[0].result });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
