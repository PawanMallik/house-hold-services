const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [user] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [decoded.id]);
      if (user.length === 0) return res.status(401).json({ message: "User not found" });

      req.user = user[0];
      next();
    } catch (err) {
      console.error("Auth Error:", err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
};

module.exports = { protect };
