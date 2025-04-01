import React, { useEffect, useState } from "react";

const RoutesPage = () => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/trips")
            .then(response => response.json())
            .then(data => setTrips(data))
            .catch(error => console.error("Ошибка загрузки маршрутов:", error));
    }, []);

    return (
        <div className="container">
            <h1>Мои маршруты</h1>
            {trips.length === 0 ? (
                <p>У вас пока нет маршрутов.</p>
            ) : (
                <ul>
                    {trips.map(trip => (
                        <li key={trip.id}>
                            <h2>{trip.title}</h2>
                            <p>Даты: {trip.start_date} - {trip.end_date}</p>
                            <p>Бюджет: {trip.budget} ₽</p>
                            <h3>Пункты назначения:</h3>
                            {trip.destinations.length === 0 ? (
                                <p>Нет добавленных пунктов</p>
                            ) : (
                                <ul>
                                    {trip.destinations.map(dest => (
                                        <li key={dest.id}>
                                            {dest.name} ({dest.date}) — {dest.cost} ₽
                                            <p>{dest.notes}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RoutesPage;
