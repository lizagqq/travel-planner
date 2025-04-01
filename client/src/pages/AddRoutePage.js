import React, { useState } from 'react';
import './AddRoutePage.css';

function App() {
    const [trip, setTrip] = useState({
        title: '',
        startDate: '',
        endDate: '',
        budget: '',
        destinations: []
    });
    const [editingIndex, setEditingIndex] = useState(null); // Индекс редактируемого пункта
    const [destinationForm, setDestinationForm] = useState({
        name: '',
        date: '',
        notes: '',
        cost: ''
    });

    // Обработчик изменения общей формы поездки
    const handleTripChange = (e) => {
        const { name, value } = e.target;
        setTrip({
            ...trip,
            [name]: name === 'budget' ? value : value
        });
    };

    // Обработчик отправки общей формы поездки
    const handleTripSubmit = (e) => {
        e.preventDefault();
        const budget = parseFloat(trip.budget) || 0;
        if (trip.title && trip.startDate && trip.endDate && trip.budget) {
            setTrip({ ...trip, budget });
            alert('Поездка сохранена!');
        } else {
            alert('Заполните все поля о поездке!');
        }
    };

    // Обработчик изменения формы пункта назначения
    const handleDestinationChange = (e) => {
        const { name, value } = e.target;
        setDestinationForm({
            ...destinationForm,
            [name]: name === 'cost' ? value : value
        });
    };

    // Обработчик добавления или редактирования пункта назначения
    const handleDestinationSubmit = (e) => {
        e.preventDefault();
        const { name, date, notes, cost } = destinationForm;
        const parsedCost = parseFloat(cost) || 0;

        if (trip.title === '') {
            alert('Сначала заполните данные о поездке!');
            return;
        }

        if (name && date) {
            if (editingIndex !== null) {
                // Редактирование существующего пункта
                const updatedDestinations = trip.destinations.map((dest, index) =>
                    index === editingIndex ? { name, date, notes, cost: parsedCost } : dest
                );
                setTrip({ ...trip, destinations: updatedDestinations });
                setEditingIndex(null);
                alert('Пункт назначения обновлен!');
            } else {
                // Добавление нового пункта
                setTrip({
                    ...trip,
                    destinations: [...trip.destinations, { name, date, notes, cost: parsedCost }]
                });
                alert('Пункт назначения добавлен!');
            }
            setDestinationForm({ name: '', date: '', notes: '', cost: '' });
        } else {
            alert('Укажите название и дату!');
        }
    };

    // Редактирование пункта
    const editDestination = (index) => {
        setEditingIndex(index);
        setDestinationForm(trip.destinations[index]);
    };

    // Удаление пункта
    const deleteDestination = (index) => {
        const updatedDestinations = trip.destinations.filter((_, i) => i !== index);
        setTrip({ ...trip, destinations: updatedDestinations });
        if (editingIndex === index) {
            setEditingIndex(null);
            setDestinationForm({ name: '', date: '', notes: '', cost: '' });
        }
        alert('Пункт назначения удален!');
    };

    // Подсчет бюджета
    const totalCost = trip.destinations.reduce((sum, dest) => sum + dest.cost, 0);
    const parsedBudget = parseFloat(trip.budget) || 0;
    const remainingBudget = (parsedBudget - totalCost).toFixed(2);

    return (
        <div className="container">
            <h1>Планирование путешествия</h1>

            {/* Форма для общих данных поездки */}
            <div className="trip-form">
                <h2>Общие данные поездки</h2>
                <form onSubmit={handleTripSubmit}>
                    <input
                        type="text"
                        name="title"
                        placeholder="Название поездки (например, Отпуск в Италии)"
                        value={trip.title}
                        onChange={handleTripChange}
                    />
                    <input
                        type="date"
                        name="startDate"
                        value={trip.startDate}
                        onChange={handleTripChange}
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={trip.endDate}
                        onChange={handleTripChange}
                    />
                    <input
                        type="number"
                        name="budget"
                        placeholder="Бюджет (в евро)"
                        value={trip.budget}
                        onChange={handleTripChange}
                    />
                    <button type="submit">Сохранить поездку</button>
                </form>
            </div>

            {/* Форма для добавления/редактирования пункта назначения */}
            <div className="destination-form">
                <h2>{editingIndex !== null ? 'Редактировать пункт назначения' : 'Добавить пункт назначения'}</h2>
                <form onSubmit={handleDestinationSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Название (например, Рим)"
                        value={destinationForm.name}
                        onChange={handleDestinationChange}
                    />
                    <input
                        type="date"
                        name="date"
                        value={destinationForm.date}
                        onChange={handleDestinationChange}
                    />
                    <input
                        type="text"
                        name="notes"
                        placeholder="Заметки (например, посетить Колизей)"
                        value={destinationForm.notes}
                        onChange={handleDestinationChange}
                    />
                    <input
                        type="number"
                        name="cost"
                        placeholder="Стоимость (в евро)"
                        value={destinationForm.cost}
                        onChange={handleDestinationChange}
                    />
                    <button type="submit">{editingIndex !== null ? 'Сохранить' : 'Добавить'}</button>
                </form>
            </div>

            {/* Детали поездки */}
            <div className="trip-details">
                <h2>Ваша поездка: <span>{trip.title || 'Не выбрано'}</span></h2>
                <p>Даты: <span>{trip.startDate && trip.endDate ? `${trip.startDate} - ${trip.endDate}` : '-'}</span></p>
                <p>Бюджет: <span>{parsedBudget}</span> евро (Остаток: <span>{remainingBudget}</span> евро)</p>
                <p>Общие затраты: <span>{totalCost}</span> евро</p>
                <h3>Пункты назначения:</h3>
                <ul className="destination-list">
                    {trip.destinations.map((dest, index) => (
                        <li key={index}>
                            {dest.name} ({dest.date}) - {dest.notes || 'Нет заметок'} - {dest.cost} евро
                            <div>
                                <button onClick={() => editDestination(index)}>Редактировать</button>
                                <button onClick={() => deleteDestination(index)}>Удалить</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;