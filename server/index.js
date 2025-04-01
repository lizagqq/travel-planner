const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes"); // Добавляем маршруты для путешествий

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", tripRoutes); // Подключаем маршруты для путешествий

const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));