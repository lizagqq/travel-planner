const jwt = require("jsonwebtoken");
const pool = require("../db");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Нет токена, доступ запрещен" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Неверный токен" });
    }
};

const adminMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Нет токена, доступ запрещен" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        const userId = decoded.userId;
        const user = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);

        if (user.rows.length === 0 || user.rows[0].role !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен: требуется роль администратора" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Неверный токен" });
    }
};

module.exports = { authMiddleware, adminMiddleware };