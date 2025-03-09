import React, { useState } from "react";
import MapComponent from "../components/MapComponent";

const AddRoutePage = () => {
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [routePoints, setRoutePoints] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!routeName || routePoints.length === 0) {
      setError("Название маршрута и точки маршрута обязательны");
      return;
    }

    setIsSubmitting(true);
    const routeData = {
      name: routeName,
      description,
      points: routePoints,
    };

    try {
      const response = await fetch("http://localhost:5000/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeData),
      });

      if (response.ok) {
        alert("Маршрут успешно добавлен!");
        setRouteName("");
        setDescription("");
        setRoutePoints([]);
      } else {
        throw new Error("Ошибка при добавлении маршрута");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Форма для добавления маршрута */}
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Добавить маршрут</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="routeName" style={styles.label}>
              Название маршрута:
            </label>
            <input
              id="routeName"
              type="text"
              placeholder="Введите название маршрута"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="description" style={styles.label}>
              Описание маршрута:
            </label>
            <textarea
              id="description"
              placeholder="Введите описание маршрута"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Сохранить маршрут"}
          </button>
        </form>
      </div>

      {/* Карта */}
      <div style={styles.mapContainer}>
        <MapComponent
          onAddPoint={(point) => setRoutePoints([...routePoints, point])}
          onRemovePoint={(id) =>
            setRoutePoints(routePoints.filter((point) => point.id !== id))
          }
        />
      </div>
    </div>
  );
};

// Стили для улучшенного дизайна
const styles = {
  container: {
    display: "flex",
    height: "100vh", // Задаём высоту 100vh для всего контейнера
    flexDirection: "row", // Размещение элементов горизонтально (форма слева, карта справа)
  },
  formContainer: {
    width: "350px", // Ширина формы
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Прозрачный белый фон
    padding: "30px",
    boxShadow: "2px 5px 10px rgba(0, 0, 0, 0.2)", // Тень для формы
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: "15px",
    marginRight: "20px", // Отступ от карты
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "0.3s",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minHeight: "100px",
    outline: "none",
    transition: "0.3s",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    marginTop: "-10px",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#45a049",
    },
    ":disabled": {
      backgroundColor: "#ccc",
    },
  },
  mapContainer: {
    flex: 1,
    height: "100vh", // Высота карты на весь экран
    width: "calc(100% - 370px)", // Убираем ширину формы, чтобы карта занимала оставшееся пространство
    position: "relative",
  },
};

export default AddRoutePage;
