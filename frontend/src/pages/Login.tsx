import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        { withCredentials: true }
      );
      localStorage.setItem("user_nome", res.data.nome);
      window.dispatchEvent(new Event("storage"));

      navigate("/home");
    } catch (err) {}
  };

  return (
    <div className="login-root">
      <h2 className="login-title">Login</h2>
      {error && <div className="login-error">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="login-input"
          name="senha"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        <button className="login-btn" type="submit">
          Entrar
        </button>
      </form>
      <div className="login-footer">
        <p>
          Não tem uma conta? <a href="/register">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
