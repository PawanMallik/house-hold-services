const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'servicehub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Test DB Route
app.get('/api/test/db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() as time');
    res.json({ success: true, db_time: rows[0].time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
