const jwt = require("jsonwebtoken");
const pool = require("../db");

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Нет авторизации" });

    try {
        const decoded = jwt.verify(token, "secretkey"); // Используем тот же ключ, что и для создания токена
        req.user = decoded; // Добавляем информацию о пользователе в запрос
        next(); // Переходим к следующему middleware или маршруту
    } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        res.status(401).json({ message: "Неверный или просроченный токен" });
    }
};

module.exports = { authMiddleware };
