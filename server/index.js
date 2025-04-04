const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const profileRoutes = require("./routes/profileRoutes");
const predefinedTripRoutes = require("./routes/predefinedTripRoutes");

console.log("authRoutes:", authRoutes);
console.log("tripRoutes:", tripRoutes);
console.log("profileRoutes:", profileRoutes);
console.log("predefinedTripRoutes:", predefinedTripRoutes);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", tripRoutes);
app.use("/api", profileRoutes);
app.use("/api", predefinedTripRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));