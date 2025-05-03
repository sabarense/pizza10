import React, { useState } from "react";
import "../css/PizzaConfig.css"; 

type PizzaSize = "broto" | "media" | "grande" | "familia";
type PizzaCrosta = "fina" | "regular" | "recheada";
type Sabor = "Calabresa" | "Portuguesa" | "Frango" | "Peperoni" | "Vegetariana" | "Moda" | "Margheritta" | "Quatro Queijos";

const saboresDisponiveis: Sabor[] = [
  "Calabresa",
  "Portuguesa",
  "Frango",
  "Peperoni",
  "Vegetariana",
  "Moda",
  "Margheritta",
  "Quatro Queijos",
];

const PizzaConfig: React.FC = () => {
  const [size, setSize] = useState<PizzaSize>("media");
  const [crosta, setCrosta] = useState<PizzaCrosta>("regular");
  const [sabores, setSabores] = useState<Sabor[]>([]);

  const handleSaborChange = (sabor: Sabor) => {
    if (sabores.includes(sabor)) {
      setSabores(sabores.filter((s) => s !== sabor));
    } else if (sabores.length < 4) {
      setSabores([...sabores, sabor]);
    }
  };

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
      key={sabor}
      className={`pizza-config-sabor-item ${
        sabores.includes(sabor) ? "selected" : ""
      }`}
    >
      <input
        className="pizza-config-sabor-checkbox"
        type="checkbox"
        checked={sabores.includes(sabor)}
        onChange={() => handleSaborChange(sabor)}
        disabled={!sabores.includes(sabor) && sabores.length >= 4}
      />
      {sabor}
    </label>
  ))}
</div>

      </div>
      <button
        className="pizza-config-btn"
        disabled={sabores.length === 0}
        onClick={() =>
          alert(`Pizza: ${size}, Sabores: ${sabores.join(", ")}`)
        }
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default PizzaConfig;
