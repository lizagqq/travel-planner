// routes/authRoutes.js

const express = require("express");
const router = express.Router();

// Пример простого маршрута для авторизации (login)
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Здесь можно добавить вашу логику проверки пользователя, например:
  if (email === "admin@example.com" && password === "password123") {
    // Генерация токена (можно использовать jsonwebtoken)
    const token = "your-jwt-token"; // Поставьте свою логику для генерации токена
    res.json({ token });
  } else {
    res.status(401).json({ error: "Неверные учетные данные" });
  }
});

// Пример маршрута для регистрации (register)
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Здесь можно добавить логику для регистрации нового пользователя
  res.status(201).json({ message: "Пользователь зарегистрирован" });
});

module.exports = router;
