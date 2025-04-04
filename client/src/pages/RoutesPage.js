import React, { useEffect, useState } from "react";

const RoutesPage = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem("token"); // Получаем токен из localStorage
                const response = await fetch("http://localhost:5000/api/trips", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}` // Добавляем заголовок Authorization
                    }
                });
    
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Ошибка загрузки данных");
                }
    
                console.log("Полученные данные:", data); // Лог для отладки
                if (Array.isArray(data)) {
                    setTrips(data);
                } else {
                    setError("Некорректный формат данных от сервера");
                }
            } catch (error) {
                console.error("Ошибка загрузки маршрутов:", error);
                setError(error.message || "Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };
    
        fetchTrips();
    }, []);
    
    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

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
                            {trip.destinations && Array.isArray(trip.destinations) ? (
                                <ul>
                                    {trip.destinations.length > 0 ? (
                                        trip.destinations.map(dest => (
                                            <li key={dest.id}>
                                                {dest.name} ({dest.date}) — {dest.cost} ₽
                                                <p>{dest.notes}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <p>Нет добавленных пунктов</p>
                                    )}
                                </ul>
                            ) : (
                                <p>Нет данных о пунктах назначения</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RoutesPage;
