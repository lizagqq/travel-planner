import React, { useState } from 'react';
import './AddRoutePage.css';

const AddRoutePage = () => {
    const [trip, setTrip] = useState({
        title: '',
        startDate: '',
        endDate: '',
        budget: '',
        destinations: []
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const [destinationForm, setDestinationForm] = useState({
        name: '',
        date: '',
        notes: '',
        cost: ''
    });

    const handleTripChange = (e) => {
        const { name, value } = e.target;
        setTrip({
            ...trip,
            [name]: value
        });
    };

    const handleTripSubmit = async (e) => {
        e.preventDefault();
        if (!trip.title || !trip.startDate || !trip.endDate || !trip.budget) {
            alert('Заполните все поля о поездке!');
            return;
        }

        if (trip.destinations.length === 0) {
            alert('Добавьте хотя бы один пункт назначения!');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/trips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: trip.title,
                    start_date: trip.startDate,
                    end_date: trip.endDate,
                    budget: parseFloat(trip.budget),
                    destinations: trip.destinations
                })
            });

            if (response.ok) {
                alert("Поездка успешно сохранена!");
                setTrip({
                    title: '',
                    startDate: '',
                    endDate: '',
                    budget: '',
                    destinations: []
                });
            } else {
                alert("Ошибка при сохранении поездки.");
            }
        } catch (error) {
            console.error("Ошибка при сохранении поездки:", error);
        }
    };

    const handleDestinationChange = (e) => {
        const { name, value } = e.target;
        setDestinationForm({
            ...destinationForm,
            [name]: value
        });
    };

    const handleDestinationSubmit = (e) => {
        e.preventDefault();
        const { name, date, notes, cost } = destinationForm;

        if (!name || !date) {
            alert('Укажите название и дату!');
            return;
        }

        const newDestination = { name, date, notes, cost: parseFloat(cost) || 0 };

        if (editingIndex !== null) {
            const updatedDestinations = [...trip.destinations];
            updatedDestinations[editingIndex] = newDestination;
            setTrip({ ...trip, destinations: updatedDestinations });
            setEditingIndex(null);
        } else {
            setTrip({
                ...trip,
                destinations: [...trip.destinations, newDestination]
            });
        }

        setDestinationForm({ name: '', date: '', notes: '', cost: '' });
    };

    const editDestination = (index) => {
        setEditingIndex(index);
        setDestinationForm(trip.destinations[index]);
    };

    const deleteDestination = (index) => {
        const updatedDestinations = trip.destinations.filter((_, i) => i !== index);
        setTrip({ ...trip, destinations: updatedDestinations });
        setEditingIndex(null);
        setDestinationForm({ name: '', date: '', notes: '', cost: '' });
    };

    const totalCost = trip.destinations.reduce((sum, dest) => sum + dest.cost, 0);
    const parsedBudget = parseFloat(trip.budget) || 0;
    const remainingBudget = (parsedBudget - totalCost).toFixed(2);

    return (
        <div className="container">
            <h1>Планирование путешествия</h1>

            <div className="trip-form">
                <h2>Общие данные поездки</h2>
                <form onSubmit={handleTripSubmit}>
                    <input type="text" name="title" placeholder="Название поездки" value={trip.title} onChange={handleTripChange} />
                    <input type="date" name="startDate" value={trip.startDate} onChange={handleTripChange} />
                    <input type="date" name="endDate" value={trip.endDate} onChange={handleTripChange} />
                    <input type="number" name="budget" placeholder="Бюджет (в ₽)" value={trip.budget} onChange={handleTripChange} />
                </form>
            </div>

            <div className="destination-form">
                <h2>{editingIndex !== null ? 'Редактировать пункт назначения' : 'Добавить пункт назначения'}</h2>
                <form onSubmit={handleDestinationSubmit}>
                    <input type="text" name="name" placeholder="Название" value={destinationForm.name} onChange={handleDestinationChange} />
                    <input type="date" name="date" value={destinationForm.date} onChange={handleDestinationChange} />
                    <input type="text" name="notes" placeholder="Заметки" value={destinationForm.notes} onChange={handleDestinationChange} />
                    <input type="number" name="cost" placeholder="Стоимость (в ₽)" value={destinationForm.cost} onChange={handleDestinationChange} />
                    <button type="submit">{editingIndex !== null ? 'Сохранить' : 'Добавить'}</button>
                </form>
            </div>

            <div className="trip-details">
                <h2>Поездка: {trip.title || 'Не выбрано'}</h2>
                <p>Даты: {trip.startDate} - {trip.endDate}</p>
                <p>Бюджет: {parsedBudget} ₽</p>
                <p>Остаток бюджета: {remainingBudget} ₽</p>
                <p>Общие затраты: {totalCost} ₽</p>
                <h3>Пункты назначения:</h3>
                <ul>
                    {trip.destinations.map((dest, index) => (
                        <li key={index}>
                            {dest.name} ({dest.date}) — {dest.cost} ₽
                            <p>{dest.notes}</p>
                            <button onClick={() => editDestination(index)}>Редактировать</button>
                            <button onClick={() => deleteDestination(index)}>Удалить</button>
                        </li>
                    ))}
                </ul>

                {/* Кнопка для сохранения поездки */}
                {trip.destinations.length > 0 && (
                    <button onClick={handleTripSubmit}>Сохранить поездку</button>
                )}
            </div>
        </div>
    );
};

export default AddRoutePage;
