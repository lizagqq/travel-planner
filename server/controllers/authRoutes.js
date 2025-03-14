const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post(
    "/register",
    [
        body("username").notEmpty().withMessage("Имя пользователя не может быть пустым"),
        body("email").isEmail().withMessage("Некорректный email"),
        body("password").isLength({ min: 6 }).withMessage("Пароль должен быть не менее 6 символов")
    ],
    registerUser
);

router.post("/login", loginUser);

module.exports = router;
