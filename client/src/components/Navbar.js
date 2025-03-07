import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";  // Для стилизации

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
      </ul>
    </nav>
  );
};

export default Navbar;
