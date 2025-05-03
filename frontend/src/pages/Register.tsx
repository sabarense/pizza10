import React, { useState } from "react";
import axios from "axios";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/clientes", form);
    alert("Cadastro realizado!");
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
        {/* Aqui você pode integrar um componente de mapa futuramente */}
        <button className="register-btn" type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Register;
