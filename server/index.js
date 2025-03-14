const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
