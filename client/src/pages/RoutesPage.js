import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./RoutesPage.css";

const RoutesPage = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [editingTrip, setEditingTrip] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        start_date: "",
        end_date: "",
        budget: "",
        destinations: [],
    });
    const [newDestination, setNewDestination] = useState({
        name: "",
        date: "",
        cost: "",
        notes: "",
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login", { state: { from: "/routes" } });
            return;
        }

        const fetchTrips = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/trips", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setTrips(data);
                } else {
                    toast.error("Ошибка при загрузке маршрутов");
                }
            } catch (error) {
                toast.error("Ошибка сервера");
            }
        };

        fetchTrips();
    }, [token, navigate]);

    const handleEdit = (trip) => {
        setEditingTrip(trip.id);
        setFormData({
            title: trip.title,
            start_date: trip.start_date,
            end_date: trip.end_date,
            budget: trip.budget,
            destinations: trip.destinations,
        });
    };

    const handleCancelEdit = () => {
        setEditingTrip(null);
        setFormData({
            title: "",
            start_date: "",
            end_date: "",
            budget: "",
            destinations: [],
        });
        setNewDestination({ name: "", date: "", cost: "", notes: "" });
    };

    const handleAddDestination = () => {
        if (!newDestination.name || !newDestination.date || !newDestination.cost) {
            toast.error("Заполните все обязательные поля пункта назначения");
            return;
        }
        setFormData({
            ...formData,
            destinations: [...formData.destinations, { ...newDestination }],
        });
        setNewDestination({ name: "", date: "", cost: "", notes: "" });
    };

    const handleRemoveDestination = (index) => {
        setFormData({
            ...formData,
            destinations: formData.destinations.filter((_, i) => i !== index),
        });
    };

    const handleUpdate = async (tripId) => {
        if (!formData.title || !formData.start_date || !formData.end_date || !formData.budget) {
            toast.error("Заполните все поля маршрута");
            return;
        }
        if (formData.destinations.length === 0) {
            toast.error("Добавьте хотя бы один пункт назначения");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Маршрут обновлен");
                setTrips(trips.map((trip) => (trip.id === tripId ? { ...formData, id: tripId } : trip)));
                setEditingTrip(null);
                setFormData({
                    title: "",
                    start_date: "",
                    end_date: "",
                    budget: "",
                    destinations: [],
                });
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Ошибка при обновлении маршрута");
            }
        } catch (error) {
            toast.error("Ошибка сервера");
        }
    };

    const handleDelete = async (tripId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.ok) {
                toast.success("Маршрут удален");
                setTrips(trips.filter((trip) => trip.id !== tripId));
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Ошибка при удалении маршрута");
            }
        } catch (error) {
            toast.error("Ошибка сервера");
        }
    };
    
    return (
        <div className="routes-page">
            <div className="container">
                <h1 className="page-title fade-in">Мои маршруты</h1>
                {trips.length > 0 ? (
                    <div className="trip-grid">
                        {trips.map((trip) => (
                            <div key={trip.id} className="trip-card card fade-in">
                                {editingTrip === trip.id ? (
                                    <div className="edit-form">
                                        <div className="form-group">
                                            <label className="form-label">Название маршрута:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, title: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Дата начала:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.start_date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, start_date: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Дата окончания:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.end_date}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, end_date: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Бюджет (руб.):</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.budget}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, budget: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        <h5 className="section-title">Пункты назначения</h5>
                                        <div className="form-group">
                                            <label className="form-label">Название:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newDestination.name}
                                                onChange={(e) =>
                                                    setNewDestination({ ...newDestination, name: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Дата:</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={newDestination.date}
                                                onChange={(e) =>
                                                    setNewDestination({ ...newDestination, date: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Стоимость (руб.):</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newDestination.cost}
                                                onChange={(e) =>
                                                    setNewDestination({ ...newDestination, cost: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Заметки:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newDestination.notes}
                                                onChange={(e) =>
                                                    setNewDestination({ ...newDestination, notes: e.target.value })
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-secondary add-destination-btn"
                                            onClick={handleAddDestination}
                                        >
                                            Добавить пункт назначения
                                        </button>

                                        {formData.destinations.length > 0 && (
                                            <ul className="destination-list">
                                                {formData.destinations.map((dest, index) => (
                                                    <li key={index} className="destination-item">
                                                        <span>
                                                            {dest.name} ({dest.date}) - {dest.cost} руб.{" "}
                                                            {dest.notes && `(${dest.notes})`}
                                                        </span>
                                                        <button
                                                            className="btn btn-danger remove-destination-btn"
                                                            onClick={() => handleRemoveDestination(index)}
                                                        >
                                                            Удалить
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <div className="edit-actions">
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleUpdate(trip.id)}
                                            >
                                                Сохранить
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={handleCancelEdit}
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="trip-details">
                                        <h3 className="trip-title">{trip.title}</h3>
                                        <p className="trip-dates">
                                            <strong>Даты:</strong> {trip.start_date} - {trip.end_date}
                                        </p>
                                        <p className="trip-budget">
                                            <strong>Бюджет:</strong> {trip.budget} руб.
                                        </p>
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
                                        <div className="trip-actions">
                                            <button
                                                className="btn btn-secondary edit-btn"
                                                onClick={() => handleEdit(trip)}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="btn btn-danger delete-btn"
                                                onClick={() => handleDelete(trip.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-trips fade-in">У вас пока нет маршрутов.</p>
                )}
            </div>
        </div>
    );
};

export default RoutesPage;