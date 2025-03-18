import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Состояние для переключения
    const [username, setUsername] = useState(""); // Имя пользователя для регистрации

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Вход выполнен!");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Ошибка сервера");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Регистрация успешна! Теперь войдите.");
                setIsRegister(false); // Переключаемся на форму входа
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Ошибка сервера");
        }
    };

    return (
        <div className="login-container">
        <form className="login-box" onSubmit={isRegister ? handleRegister : handleLogin}>
            {isRegister && (
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            )}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn" type="submit">
                {isRegister ? "Зарегистрироваться" : "Войти"}
            </button>
            <p onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
            </p>
        </form>
    </div>
    
    );
};



export default LoginPage;
