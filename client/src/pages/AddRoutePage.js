import React, { useState } from "react";

const AddRoutePage = () => {
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика отправки данных на сервер
    console.log({
      routeName,
      description,
      startDate,
      endDate,
    });
  };

  return (
    <div>
      <h1>Добавить новый маршрут</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название маршрута:</label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Описание маршрута:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Дата начала:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Дата окончания:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Добавить маршрут</button>
      </form>
    </div>
  );
};

export default AddRoutePage;
