// controllers/tripController.js
const pool = require("../db");

const addTrip = async (req, res) => {
    const { title, start_date, end_date, budget, destinations } = req.body;
    const user_id = req.user.id;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const newTrip = await client.query(
            "INSERT INTO trips (title, start_date, end_date, budget, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [title, start_date, end_date, budget, user_id]
        );
        const tripId = newTrip.rows[0].id;
        for (const dest of destinations) {
            await client.query(
                "INSERT INTO destinations (trip_id, name, date, notes, cost) VALUES ($1, $2, $3, $4, $5)",
                [tripId, dest.name, dest.date, dest.notes, dest.cost]
            );
        }
        await client.query("COMMIT");
        res.status(201).json({ trip: { id: tripId, title, start_date, end_date, budget, user_id, destinations } });
    } catch (error) {
        await client.query("ROLLBACK");
        res.status(500).json({ error: "Ошибка при добавлении путешествия" });
    } finally {
        client.release();
    }
};

const getUserTrips = async (req, res) => {
    const user_id = req.user.id;
    try {
        const trips = await pool.query("SELECT * FROM trips WHERE user_id = $1", [user_id]);
        const result = await Promise.all(trips.rows.map(async (trip) => {
            const destinations = await pool.query("SELECT * FROM destinations WHERE trip_id = $1", [trip.id]);
            return { ...trip, destinations: destinations.rows };
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении путешествий" });
    }
};

// Экспортируем функции
module.exports = { addTrip, getUserTrips };
