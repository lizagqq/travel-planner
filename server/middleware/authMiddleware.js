const jwt = require("jsonwebtoken");
const pool = require("../db");

// Используем секрет из переменной окружения
const SECRET_KEY = process.env.JWT_SECRET;

// Общая функция для верификации токена
const verifyToken = (token, res) => {
    if (!token) {
        return res.status(401).json({ error: "Нет токена, доступ запрещен" });
    }

    try {
        console.log("Проверяемый токен:", token);
        console.log("JWT_SECRET:", SECRET_KEY);

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Декодированный токен:", decoded);

        // Поддерживаем как id, так и userId
        const userId = decoded.id || decoded.userId;
        if (!userId) {
            return res.status(401).json({ error: "Недействительный токен: отсутствует id пользователя" });
        }

        return { userId, decoded };
    } catch (error) {
        console.error("Ошибка при верификации токена:", error.message);
        return res.status(401).json({ error: `Недействительный токен: ${error.message}` });
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    const result = verifyToken(token, res);
    if (res.headersSent) return; // Если ответ уже отправлен, выходим

    const { userId, decoded } = result;
    req.user = { id: userId, ...decoded };
    console.log("req.user в authMiddleware:", req.user);
    next();
};

const adminMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    const result = verifyToken(token, res);
    if (res.headersSent) return; // Если ответ уже отправлен, выходим

    const { userId, decoded } = result;

    try {
        console.log("Ищем пользователя с id:", userId);
        const userQuery = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
        console.log("Результат запроса:", userQuery.rows);

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const userRole = userQuery.rows[0].role;
        if (userRole !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен: требуется роль администратора" });
        }

        req.user = { id: userId, ...decoded };
        console.log("req.user в adminMiddleware:", req.user);
        next();
    } catch (error) {
        console.error("Ошибка при проверке роли администратора:", error.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

module.exports = { authMiddleware, adminMiddleware };