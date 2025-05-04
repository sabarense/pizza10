import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PizzaConfig.css"; 

type PizzaSize = "broto" | "media" | "grande" | "familia";
type PizzaCrosta = "fina" | "regular" | "recheada";
type Sabor = "Calabresa" | "Portuguesa" | "Frango" | "Peperoni" | "Vegetariana" | "Moda" | "Margheritta" | "Quatro Queijos";

const saboresDisponiveis: { id: number; nome: Sabor }[] = [
  { id: 1, nome: "Calabresa" },
  { id: 2, nome: "Portuguesa" },
  { id: 3, nome: "Frango" },
  { id: 4, nome: "Peperoni" },
  { id: 5, nome: "Vegetariana" },
  { id: 6, nome: "Moda" },
  { id: 7, nome: "Margheritta" },
  { id: 8, nome: "Quatro Queijos" },
];

const PRECO_PIZZAS: Record<PizzaSize, number> = {
  broto: 25,
  media: 35,
  grande: 45,
  familia: 55,
};
const PRECO_CROSTA_RECHEADA = 5;

const PizzaConfig: React.FC = () => {
  const [size, setSize] = useState<PizzaSize>("media");
  const [crosta, setCrosta] = useState<PizzaCrosta>("regular");
  const [sabores, setSabores] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaborChange = (id: number) => {
    if (sabores.includes(id)) {
      setSabores(sabores.filter((s) => s !== id));
    } else if (sabores.length < 4) {
      setSabores([...sabores, id]);
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          type: "pizza",
          pizza: {
            size,
            crust: crosta,
            flavors: sabores,
          }
        },
        { withCredentials: true }
      );
      alert("Pizza adicionada ao carrinho!");
      navigate("/cart");
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao adicionar pizza.");
    } finally {
      setLoading(false);
    }
  };

  // Cálculo do preço
  const precoBase = PRECO_PIZZAS[size];
  const precoCrosta = crosta === "recheada" ? PRECO_CROSTA_RECHEADA : 0;
  const precoTotal = sabores.length > 0 ? precoBase + precoCrosta : 0;

  return (
    <div className="pizza-config-root">
      <h2 className="pizza-config-title">Especifique sua pizza</h2>
      <div className="pizza-config-section">
        <label className="pizza-config-label">Tamanho:</label>
        <select
          className="pizza-config-select"
          value={size}
          onChange={(e) => setSize(e.target.value as PizzaSize)}
        >
          <option value="broto">Broto</option>
          <option value="media">Média</option>
          <option value="grande">Grande</option>
          <option value="familia">Família</option>
        </select>
      </div>
      <div className="pizza-config-section">
        <label className="pizza-config-label">Crosta:</label>
        <select
          className="pizza-config-select"
          value={crosta}
          onChange={(e) => setCrosta(e.target.value as PizzaCrosta)}
        >
          <option value="fina">Fina</option>
          <option value="regular">Regular</option>
          <option value="recheada">Recheada</option>
        </select>
      </div>
      <div className="pizza-config-section">
        <label className="pizza-config-label">Sabores (até 4):</label>
        <div className="pizza-config-sabores-list">
          {saboresDisponiveis.map((sabor) => (
            <label
              key={sabor.id}
              className={`pizza-config-sabor-item ${
                sabores.includes(sabor.id) ? "selected" : ""
              }`}
            >
              <input
                className="pizza-config-sabor-checkbox"
                type="checkbox"
                checked={sabores.includes(sabor.id)}
                onChange={() => handleSaborChange(sabor.id)}
                disabled={!sabores.includes(sabor.id) && sabores.length >= 4}
              />
              {sabor.nome}
            </label>
          ))}
        </div>
      </div>
      {/* Exibe o valor da pizza apenas se houver pelo menos um sabor */}
      {sabores.length > 0 && (
        <div className="pizza-price-display">
          <span>Valor da pizza:</span>
          <span className="price-highlight">R$ {precoTotal.toFixed(2)}</span>
        </div>
      )}
      <button
        className="pizza-config-btn"
        disabled={sabores.length === 0 || loading}
        onClick={handleAddToCart}
      >
        {loading ? "Adicionando..." : "Adicionar ao Carrinho"}
      </button>
    </div>
  );
};

export default PizzaConfig;
