import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [predefinedTrips, setPredefinedTrips] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Загрузка данных пользователя
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

        // Загрузка готовых маршрутов
        const fetchPredefinedTrips = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/predefined-trips");
                if (response.ok) {
                    const trips = await response.json();
                    setPredefinedTrips(trips);
                }
            } catch (error) {
                console.error("Ошибка при загрузке готовых маршрутов:", error);
            }
        };

        fetchUser();
        fetchPredefinedTrips();
    }, [token]);

    const handleCreateRoute = () => {
        if (!token) {
            // Если пользователь не авторизован, перенаправляем на /login с указанием, куда вернуться
            navigate("/login", { state: { from: "/add-route" } });
        } else {
            // Если пользователь авторизован, сразу переходим на /add-route
            navigate("/add-route");
        }
    };

    return (
        <div className="container mt-5">
            {/* Приветствие */}
            <div className="text-center mb-5">
                {user ? (
                    <>
                        <h1>Привет, {user.username}!</h1>
                        <p>Добро пожаловать в Travel Planner! Планируйте свои поездки легко и удобно.</p>
                    </>
                ) : (
                    <>
                        <h1>Добро пожаловать в Travel Planner!</h1>
                        <p>Планируйте свои поездки легко и удобно.</p>
                        <a href="/login" className="btn btn-primary">Войти</a>
                    </>
                )}
            </div>

            {/* Готовые маршруты */}
            <h2 className="text-center mb-4">Популярные маршруты</h2>
            {predefinedTrips.length > 0 ? (
                <div className="row">
                    {predefinedTrips.map((trip) => (
                        <div key={trip.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{trip.title}</h5>
                                    <p className="card-text">
                                        <strong>Даты:</strong> {trip.start_date} - {trip.end_date}
                                    </p>
                                    <p className="card-text">
                                        <strong>Бюджет:</strong> {trip.budget} руб.
                                    </p>
                                    <div>
                                        <strong>Пункты назначения:</strong>
                                        <ul>
                                            {trip.destinations.map((dest) => (
                                                <li key={dest.id}>
                                                    {dest.name} ({dest.date}) - Стоимость: {dest.cost} руб.
                                                    {dest.notes && <span> - {dest.notes}</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Готовые маршруты пока недоступны.</p>
            )}

            {/* Кнопка "Создать свой маршрут" */}
            <div className="text-center mt-5">
                <button className="btn btn-success btn-lg" onClick={handleCreateRoute}>
                    Создать свой маршрут
                </button>
            </div>
        </div>
    );
};

export default Home;