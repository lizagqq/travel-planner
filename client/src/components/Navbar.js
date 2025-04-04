import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await fetch("http://localhost:5000/api/profile", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке данных пользователя:", error);
                }
            }
        };
        fetchUser();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">Travel Planner</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Главная</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/routes">Маршруты</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add-route">Добавить маршрут</Link>
                        </li>
                        {token && user ? (
                            <>
                                {user.role === "admin" && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin">Панель администратора</Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <Link className="nav-link d-flex align-items-center" to="/profile">
                                        <FaUser className="me-1" /> Привет, {user.username}!
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center"
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt className="me-1" /> Выйти
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Войти</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;