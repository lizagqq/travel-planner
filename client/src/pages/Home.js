import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const [predefinedTrips, setPredefinedTrips] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("http://localhost:5000/api/predefined-trips")
            .then((response) => response.json())
            .then((data) => setPredefinedTrips(data))
            .catch((error) => console.error("Ошибка загрузки маршрутов:", error));
    }, []);

    return (
        <div className="home">
            <div className="hero-section">
                <div className="container">
                    <h1 className="hero-title fade-in">Планируйте свои путешествия с легкостью!</h1>
                    <p className="hero-subtitle fade-in">
                        Создавайте свои маршруты или выбирайте готовые варианты.
                    </p>
                    {token ? (
                        <Link to="/add-route" className="btn btn-primary hero-btn fade-in">
                            Создать свой маршрут
                        </Link>
                    ) : (
                        <Link to="/login" className="btn btn-primary hero-btn fade-in">
                            Войти, чтобы начать
                        </Link>
                    )}
                </div>
            </div>

            <div className="container">
                <h2 className="section-title fade-in">Готовые маршруты</h2>
                {predefinedTrips.length > 0 ? (
                    <div className="trip-grid">
                        {predefinedTrips.map((trip) => (
                            <div key={trip.id} className="trip-card card fade-in">
                                <h3 className="trip-title">{trip.title}</h3>
                                <p className="trip-dates">
                                    {trip.start_date} - {trip.end_date}
                                </p>
                                <p className="trip-budget">Бюджет: {trip.budget} руб.</p>
                                <div className="trip-destinations">
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
                        ))}
                    </div>
                ) : (
                    <p className="no-trips fade-in">Готовых маршрутов пока нет.</p>
                )}
            </div>
        </div>
    );
};

export default Home;