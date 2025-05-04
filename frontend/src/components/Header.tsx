import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user_nome"));

  useEffect(() => {
    const syncLoginState = () => setIsLoggedIn(!!localStorage.getItem("user_nome"));
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    } catch {
      // Ignorar erros
    }
    localStorage.removeItem("user_nome");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <nav className="app-header__nav">
        {/* Ícone de voltar */}
        <button
          className="nav-link back-btn"
          type="button"
          onClick={() => navigate(-1)}
          title="Voltar"
        >
          ← Voltar
        </button>

        <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          🏠 Home
        </NavLink>
        <NavLink to="/pizza-config" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          🍕 Pizza
        </NavLink>
        <NavLink to="/drinks-config" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          🥤 Bebidas
        </NavLink>
        {/* Botão Carrinho */}
        <button
          className="nav-link"
          type="button"
          onClick={() => navigate("/cart")}
        >
          🛒 Carrinho
        </button>
        {!isLoggedIn && (
          <>
            <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              👤 Cadastro
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              🔑 Login
            </NavLink>
          </>
        )}
        {isLoggedIn && (
          <button className="logout-btn" onClick={handleLogout} title="Sair">
            🚪 Sair
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
