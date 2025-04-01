const pool = require("../db"); // Подключение к базе данных

// Функция для добавления нового путешествия
const addTrip = async (req, res) => {
    const { title, start_date, end_date, budget } = req.body;
    const user_id = req.user.id; // Получаем ID пользователя из middleware

    try {
        const newTrip = await pool.query(
            "INSERT INTO trips (title, start_date, end_date, budget, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, start_date, end_date, budget, user_id]
        );

        res.status(201).json({ trip: newTrip.rows[0] }); // Возвращаем новый trip
    } catch (error) {
        console.error("Ошибка при добавлении путешествия:", error);
        res.status(500).json({ error: "Ошибка при добавлении путешествия" });
    }
};

// Функция для получения всех путешествий для пользователя
const getUserTrips = async (req, res) => {
    const user_id = req.user.id; // Получаем ID пользователя из middleware

    try {
        const trips = await pool.query("SELECT * FROM trips WHERE user_id = $1", [user_id]);
        res.json(trips.rows); // Возвращаем все путешествия пользователя
    } catch (error) {
        console.error("Ошибка при получении путешествий:", error);
        res.status(500).json({ error: "Ошибка при получении путешествий" });
    }
};

module.exports = { addTrip, getUserTrips };
