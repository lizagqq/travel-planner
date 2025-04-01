// routes/tripRoutes.js
const express = require("express");
const { addTrip, getUserTrips } = require("../controllers/tripController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Добавление нового путешествия
router.post("/trips", authMiddleware, addTrip);

// Получение всех путешествий для пользователя
router.get("/trips", authMiddleware, getUserTrips);

module.exports = router;
