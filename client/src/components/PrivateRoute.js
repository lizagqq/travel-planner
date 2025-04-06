import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    toast.error("Сессия истекла, пожалуйста, войдите снова");
                }
            } catch (error) {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                toast.error("Ошибка сервера");
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Загрузка...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default PrivateRoute;