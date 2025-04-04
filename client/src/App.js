import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AddRoutePage from "./pages/AddRoutePage";
import RoutesPage from "./pages/RoutesPage";
import AdminPanel from "./pages/AdminPanel";

function App() {
    // Очищаем localStorage при загрузке приложения
    useEffect(() => {
        localStorage.removeItem("token");
    }, []); // Пустой массив зависимостей — эффект выполнится только один раз при монтировании

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/add-route" element={<AddRoutePage />} />
                <Route path="/routes" element={<RoutesPage />} />
                <Route path="/admin" element={<AdminPanel />} />
            </Routes>
        </Router>
    );
}

export default App;