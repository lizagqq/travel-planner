const express = require("express");
const { addTrip, getUserTrips } = require("../controllers/tripController"); // Проверь путь
const authMiddleware = require("../middleware/authMiddleware");

console.log("addTrip:", addTrip); // Отладка
console.log("getUserTrips:", getUserTrips);

const router = express.Router();

router.post("/trips", authMiddleware, addTrip);
router.get("/trips", authMiddleware, getUserTrips);

module.exports = router;