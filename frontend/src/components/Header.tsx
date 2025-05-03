import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

const Header: React.FC = () => (
  <header className="app-header">
    <nav className="app-header__nav">
      <Link to="/home">Home</Link>
      <Link to="/pizza-config">Montar Pedido</Link>
      <Link to="/drinks-config">Bebidas</Link>
      <Link to="/register">Cadastro</Link>
    </nav>
  </header>
);

export default Header;
