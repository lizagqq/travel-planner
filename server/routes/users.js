console.log("JWT_SECRET:", process.env.JWT_SECRET);
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");



// Подключение к базе данных через pg
const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "travel_planner",
    password: "1111", 
    port: 5432,
});

client.connect();

// Middleware для проверки токена
const auth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        console.log("Токен не предоставлен");
        return res.status(401).json({ error: "Токен не предоставлен" });
    }
    try {
        console.log("Проверяемый токен:", token);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Декодированный токен:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Ошибка при верификации токена:", error.message);
        res.status(401).json({ error: "Недействительный токен" });
    }
};

// Регистрация пользователя
router.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Проверяем, существует ли пользователь
        const existingUserQuery = await client.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        if (existingUserQuery.rows.length > 0) {
            return res.status(400).json({ error: "Пользователь с таким именем уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаём нового пользователя
        const newUserQuery = await client.query(
            "INSERT INTO users (username, password, role, \"createdAt\") VALUES ($1, $2, $3, NOW()) RETURNING id",
            [username, hashedPassword, role || "user"]
        );
        const userId = newUserQuery.rows[0].id;

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Созданный токен при авторизации:", token);

        res.status(201).json({ token });
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Авторизация пользователя
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userQuery = await client.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        const user = userQuery.rows[0];

        if (!user) {
            return res.status(400).json({ error: "Неверное имя пользователя или пароль" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Неверное имя пользователя или пароль" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Получение данных текущего пользователя
router.get("/me", auth, async (req, res) => {
    try {
        const userQuery = await client.query(
            "SELECT id, username, role FROM users WHERE id = $1",
            [req.user.id]
        );
        const user = userQuery.rows[0];

        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }
        res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;