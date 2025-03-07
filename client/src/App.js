import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RoutesPage from "./pages/RoutesPage";
import Navbar from "./components/Navbar"; // Импортируем Navbar
import AddRoutePage from './pages/AddRoutePage';

function App() {
  return (
    <Router>
      <Navbar />  {/* Добавляем Navbar в верхнюю часть страницы */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/add-route" element={<AddRoutePage />} />  {/* Новый маршрут */}
      </Routes>
    </Router>
  );
}

export default App;
