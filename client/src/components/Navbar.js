import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";

const Navbar = () => {
    const [username, setUsername] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetch("http://localhost:5000/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUsername(data.username);
                    setIsAdmin(data.role === "admin");
                })
                .catch((error) => {
                    console.error("Ошибка загрузки профиля:", error);
                    localStorage.removeItem("token");
                });
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUsername("");
        setIsAdmin(false);
        toast.success("Вы вышли из системы");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand">
                    Travel Planner
                </Link>
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">
                        Главная
                    </Link>
                    {token ? (
                        <>
                            <Link to="/routes" className="navbar-link">
                                Мои маршруты
                            </Link>
                            <Link to="/add-route" className="navbar-link">
                                Создать маршрут
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="navbar-link">
                                    Панель администратора
                                </Link>
                            )}
                            <Link to="/profile" className="navbar-link">
                                Привет, {username}!
                            </Link>
                            <button onClick={handleLogout} className="navbar-btn">
                                Выйти
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="navbar-link">
                            Войти
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;