const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const pool = require("../db");

console.log("authMiddleware in profileRoutes:", authMiddleware); // Добавляем отладку

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        // Используем req.user.id вместо req.user.userId
        const userId = req.user.id;
        console.log("Извлечённый userId в /profile:", userId); // Добавляем отладку

        const user = await pool.query(
            "SELECT id, username, email, created_at FROM users WHERE id = $1",
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json(user.rows[0]);
    } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;