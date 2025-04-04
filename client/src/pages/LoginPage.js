import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./LoginPage.css";

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // Получаем информацию о текущем маршруте

    // Проверяем, есть ли в state информация о перенаправлении
    const { from } = location.state || { from: "/profile" }; // По умолчанию перенаправляем на /profile

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? "http://localhost:5000/api/auth/login"
            : "http://localhost:5000/api/auth/register";
        const body = isLogin
            ? { email, password }
            : { username, email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem("token", data.token);
                    toast.success("Вы успешно вошли!");
                    // Перенаправляем на страницу, указанную в state.from, или на /profile
                    navigate(from);
                } else {
                    toast.success("Регистрация прошла успешно! Теперь войдите.");
                    setIsLogin(true);
                }
            } else {
                toast.error(data.error || "Ошибка при выполнении запроса");
            }
        } catch (error) {
            toast.error("Ошибка сервера");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{isLogin ? "Вход" : "Регистрация"}</h1>
            <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
                {!isLogin && (
                    <div className="mb-3">
                        <label className="form-label">Имя пользователя:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Пароль:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    {isLogin ? "Войти" : "Зарегистрироваться"}
                </button>
            </form>
            <p className="text-center mt-3">
                {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
                <button
                    className="btn btn-link p-0"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Зарегистрироваться" : "Войти"}
                </button>
            </p>
        </div>
    );
};

export default LoginPage;