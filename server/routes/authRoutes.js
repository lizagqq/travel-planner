const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // Подключаем базу данных
const router = express.Router();

const SECRET_KEY = "your_secret_key"; // Лучше хранить в переменной окружения

// Маршрут для входа (login)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверяем наличие пользователя
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Пользователь не найден" });
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password_hash); // Используем password_hash
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Неверный пароль" });
        }

        // Генерация JWT-токена
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Маршрут для регистрации (register)
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Проверяем наличие пользователя с таким email
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Пользователь с таким email уже существует" });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохраняем пользователя в базе данных
        await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)", // Используем password_hash
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "Пользователь успешно зарегистрирован" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

module.exports = router;
