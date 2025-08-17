const pool = require("../config/db");

const createBooking = async (req, res) => {
  try {
    const { serviceId, date } = req.body;
    const userId = req.user.id;

    await pool.query("INSERT INTO bookings (user_id, service_id, date) VALUES (?, ?, ?)", [
      userId,
      serviceId,
      date,
    ]);

    res.json({ message: "Booking created successfully" });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query(
      "SELECT b.id, s.name AS service, b.date FROM bookings b JOIN services s ON b.service_id = s.id WHERE b.user_id = ?",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get Bookings Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    await pool.query("DELETE FROM bookings WHERE id = ?", [bookingId]);
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("Cancel Booking Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createBooking, getBookings, cancelBooking };
