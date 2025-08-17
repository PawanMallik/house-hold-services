const express = require("express");
const { getServices, addService } = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getServices);          // Public
router.post("/", protect, addService); // Only logged-in users

module.exports = router;
