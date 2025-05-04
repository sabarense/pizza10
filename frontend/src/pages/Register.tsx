import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Register.css"; 

type RegisterForm = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
};

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    endereco: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/customers/", form, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Cadastro realizado! Faça login para acessar sua conta.");
      navigate("/login"); // Redireciona para a página de login
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        alert("Erro: " + error.response.data.error);
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="register-root">
      <h2 className="register-title">Cadastro</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          className="register-input"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="senha"
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleChange}
          required
        />
        <button className="register-btn" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Register;
