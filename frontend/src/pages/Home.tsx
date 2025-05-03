import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const Home: React.FC = () => (
  <div className="home-root">
    <div className="home-card">
      <img
        src="/pizza-banner.jpg"
        alt="Pizza deliciosa"
        className="home-banner-img"
      />
      <h1 className="home-title">
        Bem-vindo de volta à <span className="home-title-accent">Pizza10</span>!
      </h1>
      <p className="home-desc">
        Escolha uma opção para começar:
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
        <Link to="/register">
          <button className="home-btn-red home-action-btn">
            Cadastro 👤
          </button>
        </Link>
      </div>
      {/* <div className="home-promo">
        <span role="img" aria-label="promo">🔥</span> Promoção do dia: Pizza Grande + Refrigerante por R$39,90!
      </div> */}
      <div className="home-footer">
        <span role="img" aria-label="pizza">
          🍕
        </span>{" "}
        <b>Aberto todos os dias, das 18h às 23h!</b>
      </div>
    </div>
  </div>
);

export default Home;
