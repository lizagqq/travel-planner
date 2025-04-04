import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const token = localStorage.getItem("token");
    console.log("PrivateRoute: token =", token); // Отладка
    if (!token) {
        console.log("PrivateRoute: Перенаправляем на /login"); // Отладка
    }
    return token ? <Outlet /> : <Navigate to="/login" state={{ from: window.location.pathname }} />;
};

export default PrivateRoute;