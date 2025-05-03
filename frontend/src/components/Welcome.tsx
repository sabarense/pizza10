import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Welcome.css";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-root">
      <div className="welcome-card">
        <h1 className="welcome-title">Pizza10</h1>
        <p className="welcome-desc">
          Bem-vindo! <br />
          Peça suas pizzas e bebidas favoritas <b>sem sair do sofá</b>.<br />
          <span style={{ color: "#e67e22", fontWeight: 600 }}>
            Sabor, rapidez e diversão em cada fatia!
          </span>
        </p>
        <img
          src="/welcome-illustration.jpg"
          alt="Bem-vindo"
          className="welcome-img"
        />
        <button
          className="welcome-btn"
          onClick={() => navigate("/home")}
        >
          🍕 Peça Agora
        </button>
      </div>
    </div>
  );
};

export default Welcome;
