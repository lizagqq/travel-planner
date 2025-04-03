const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Нет токена, доступ запрещен" });
    }

    try {
        const decoded = jwt.verify(token, "your_secret_key"); // Явный ключ, как в authRoutes.js
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Неверный токен" });
    }
};

module.exports = authMiddleware; // Прямой экспорт функции