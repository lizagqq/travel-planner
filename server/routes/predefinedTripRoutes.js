const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const {
    getPredefinedTrips,
    addPredefinedTrip,
    updatePredefinedTrip,
    deletePredefinedTrip,
} = require("../controllers/predefinedTripController");

const router = express.Router();

// Доступно всем
router.get("/predefined-trips", getPredefinedTrips);

// predefinedTripController.js
const getPredefinedTrips = async (req, res) => {
    try {
        const trips = await pool.query("SELECT * FROM predefined_trips");
        const result = await Promise.all(trips.rows.map(async (trip) => {
            const destinations = await pool.query("SELECT * FROM predefined_destinations WHERE trip_id = $1", [trip.id]);
            return { ...trip, destinations: destinations.rows };
        }));
        res.json(result);
    } catch (error) {
        console.error("Ошибка при получении готовых маршрутов:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

// Доступно только администратору
router.post("/predefined-trips", authMiddleware, adminMiddleware, addPredefinedTrip);
router.put("/predefined-trips/:id", authMiddleware, adminMiddleware, updatePredefinedTrip);
router.delete("/predefined-trips/:id", authMiddleware, adminMiddleware, deletePredefinedTrip);

module.exports = router;