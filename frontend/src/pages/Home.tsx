import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const Home: React.FC = () => {
  const userNome = localStorage.getItem("user_nome");

  return (
    <div className="home-root">
      <div className="home-card">
        <img
          src="/pizza-banner.jpg"
          alt="Pizza deliciosa"
          className="home-banner-img"
        />
        <h1 className="home-title">
          {userNome ? (
            <>
              Bem-vindo, <span className="home-title-accent">{userNome}</span>!
            </>
          ) : (
            <>
              Bem-vindo à <span className="home-title-accent">Pizza10</span>!
            </>
          )}
        </h1>
        <p className="home-desc">
          {userNome
            ? "Escolha uma opção para começar seu pedido:"
            : "Escolha uma opção para começar:"}
        </p>
        <div className="home-actions">
          <Link to="/pizza-config">
            <button className="home-btn-yellow home-action-btn">
              Pizza 🍕
            </button>
          </Link>
          <Link to="/drinks-config">
            <button className="home-btn-yellow home-action-btn">
              Bebidas 🥤
            </button>
          </Link>
          {!userNome && (
            <>
              <Link to="/register">
                <button className="home-btn-red home-action-btn">
                  Cadastro 👤
                </button>
              </Link>
              <Link to="/login">
                <button className="home-btn-red home-action-btn">
                  Login 🔑
                </button>
              </Link>
            </>
          )}
        </div>
        <div className="home-footer">
          <span role="img" aria-label="pizza">
            🍕
          </span>{" "}
          <b>Aberto todos os dias, das 18h às 23h!</b>
        </div>
      </div>
    </div>
  );
};

export default Home;
