const pool = require("../config/db");

const getServices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM services");
    res.json(rows);
  } catch (err) {
    console.error("Get Services Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    await pool.query("INSERT INTO services (name, description, price) VALUES (?, ?, ?)", [
      name,
      description,
      price,
    ]);
    res.json({ message: "Service added successfully" });
  } catch (err) {
    console.error("Add Service Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getServices, addService };
