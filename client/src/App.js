import React, { useEffect } from "react";
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
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        localStorage.removeItem("token");
                        toast.info("Ваша сессия истекла. Пожалуйста, войдите снова.");
                    }
                })
                .catch((error) => {
                    console.error("Ошибка при проверке токена:", error);
                    localStorage.removeItem("token");
                    toast.info("Ваша сессия истекла. Пожалуйста, войдите снова.");
                });
        }
    }, []);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/add-route" element={<AddRoutePage />} />
                    <Route path="/admin" element={<AdminPanel />} />
                </Route>
                <Route path="/routes" element={<RoutesPage />} />
            </Routes>
        </Router>
    );
}

export default App;