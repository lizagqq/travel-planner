import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AddRoutePage from "./pages/AddRoutePage";
import RoutesPage from "./pages/RoutesPage";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkToken = async (token) => {
        try {
            const response = await fetch("http://localhost:5000/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setIsAuthenticated(true);
            } else if (response.status === 401) {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                toast.info("Ваша сессия истекла. Пожалуйста, войдите снова.");
            } else {
                console.error("Ошибка проверки токена, статус:", response.status);
            }
        } catch (error) {
            console.error("Ошибка при проверке токена:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            checkToken(token);
        }
    }, []);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/add-route" element={<AddRoutePage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/routes" element={<RoutesPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;