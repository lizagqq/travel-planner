const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profileRoutes");
const predefinedTripRoutes = require("./routes/predefinedTripRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api", predefinedTripRoutes);

app.listen(5000, () => {
    console.log("Сервер запущен на порту 5000");
});