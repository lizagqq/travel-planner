import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/routes">Мои маршруты</Link>
        </li>
        <li>
          <Link to="/add-route">Добавить маршрут</Link> {/* Новая ссылка */}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
