const jwt = require("jsonwebtoken");
const pool = require("../db");

const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (token, res) => {
    if (!token) {
        return res.status(401).json({ error: "Нет токена, доступ запрещен" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id; // токен содержит id

        if (!userId) {
            return res.status(401).json({ error: "Недействительный токен: отсутствует id пользователя" });
        }

        return { userId };
    } catch (error) {
        console.error("Ошибка при верификации токена:", error.message);
        return res.status(401).json({ error: `Недействительный токен: ${error.message}` });
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    const result = verifyToken(token, res);
    if (res.headersSent) return;

    const { userId } = result;
    req.user = { id: id }; 
    next();
};

const adminMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    const result = verifyToken(token, res);
    if (res.headersSent) return;

    const { userId } = result;

    try {
        const userQuery = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const userRole = userQuery.rows[0].role;
        if (userRole !== "admin") {
            return res.status(403).json({ error: "Доступ запрещен: требуется роль администратора" });
        }

        req.user = { id: userId, role: userRole }; // ✅ id и роль
        next();
    } catch (error) {
        console.error("Ошибка при проверке роли администратора:", error.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

module.exports = { authMiddleware, adminMiddleware };
