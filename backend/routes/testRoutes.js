// routes/testRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// simple API check
router.get("/", (req, res) => {
  res.json({ message: "API is working ✅" });
});

// DB check
router.get("/db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ message: "DB connected ✅", result: rows[0].result });
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ error: "DB connection failed ❌", details: err.message });
  }
});

module.exports = router;
