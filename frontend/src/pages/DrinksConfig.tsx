import React, { useState } from "react";
import "../css/DrinksConfig.css";


type Bebida = { nome: string; preco: number };

const bebidasDisponiveis: Bebida[] = [
  { nome: "Coca-Cola 2L", preco: 10 },
  { nome: "Guaraná 2L", preco: 9 },
  { nome: "Água", preco: 4 },
  { nome: "Suco", preco: 6 },
];

const DrinksConfig: React.FC = () => {
  const [quantidades, setQuantidades] = useState<{ [nome: string]: number }>({});

  const handleQuantidadeChange = (nome: string, valor: number) => {
    setQuantidades({ ...quantidades, [nome]: valor });
  };

  return (
    <div className="drinks-config-root">
      <h2 className="drinks-config-title">Selecione suas Bebidas</h2>
      <div className="drinks-config-list">
        {bebidasDisponiveis.map((bebida) => (
          <div key={bebida.nome} className="drinks-config-item">
            <span>
              {bebida.nome} <b>(R$ {bebida.preco})</b>
            </span>
            <input
              className="drinks-config-input"
              type="number"
              min={0}
              value={quantidades[bebida.nome] || 0}
              onChange={(e) =>
                handleQuantidadeChange(bebida.nome, Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      <button
        className="drinks-config-btn"
        onClick={() => alert(`Bebidas: ${JSON.stringify(quantidades)}`)}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default DrinksConfig;
