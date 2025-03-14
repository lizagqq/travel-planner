import React, { useState } from "react";
import './LoginPage.css'; // Импортируем CSS файл для стилизации

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                localStorage.setItem("token", data.token); // Сохраняем токен в localStorage
                alert("Вход выполнен!");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Ошибка сервера");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Авторизация</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            placeholder="Пароль" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
