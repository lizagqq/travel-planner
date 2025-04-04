import React from "react";
import { Navigate } from "react-router-dom"; // Используем Navigate вместо Redirect

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Проверка на авторизацию (например, наличие токена)

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Перенаправление на страницу логина
  }

  return children; // Если пользователь авторизован, возвращаем дочерние компоненты
};

export default PrivateRoute;
