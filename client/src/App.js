import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RoutesPage from "./pages/RoutesPage";
import Navbar from "./components/Navbar"; // Импортируем Navbar

function App() {
  return (
    <Router>
      <Navbar />  {/* Добавляем Navbar в верхнюю часть страницы */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
