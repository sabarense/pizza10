import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/DrinksConfig.css";

type Drink = {
  id: number;
  nome: string;
  preco: number;
};

const DrinksConfig: React.FC = () => {
  const navigate = useNavigate();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [quantidades, setQuantidades] = useState<{ [id: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Busca bebidas do backend
  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/drinks");
        setDrinks(response.data);

        // Inicializa quantidades com 0 para cada bebida
        const initialQuantidades = response.data.reduce((acc: any, drink: Drink) => {
          acc[drink.id] = 0;
          return acc;
        }, {});
        setQuantidades(initialQuantidades);

      } catch (err) {
        setError("Erro ao carregar bebidas. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  const handleQuantidadeChange = (id: number, valor: number) => {
    setQuantidades({ ...quantidades, [id]: valor < 0 ? 0 : valor });
  };

  const handleAdicionarAoCarrinho = async () => {
    try {
      // Filtra apenas itens com quantidade > 0
      const items = Object.entries(quantidades)
        .filter(([_, quantidade]) => quantidade > 0)
        .map(([id, quantidade]) => ({
          drink_id: Number(id),
          quantidade: Number(quantidade)
        }));

      if (items.length === 0) {
        alert("Selecione pelo menos uma bebida!");
        return;
      }

      // Envia para o backend
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { type: "drink", items },
        { withCredentials: true }
      );

      // Redireciona para a próxima tela (ex: carrinho ou pagamento)
      navigate("/cart");

    } catch (err) {
      alert("Erro ao adicionar ao carrinho. Tente novamente.");
    }
  };

  // Calcula o valor total das bebidas selecionadas
  const total = drinks.reduce((sum, drink) => {
    const qtd = quantidades[drink.id] || 0;
    return sum + drink.preco * qtd;
  }, 0);

  if (loading) return <div className="loading">Carregando bebidas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="drinks-config-root">
      <h2 className="drinks-config-title">Selecione suas Bebidas</h2>
      <div className="drinks-config-list">
        {drinks.map((drink) => (
          <div key={drink.id} className="drinks-config-item">
            <span>
              {drink.nome} <b>(R$ {drink.preco.toFixed(2)})</b>
            </span>
            <input
              className="drinks-config-input"
              type="number"
              min={0}
              value={quantidades[drink.id] || 0}
              onChange={(e) =>
                handleQuantidadeChange(drink.id, Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>
      {/* Mostra o valor total somente se houver pelo menos uma bebida selecionada */}
      {Object.values(quantidades).some(qtd => qtd > 0) && (
        <div className="drinks-price-display">
          <span>Total das bebidas:</span>
          <span className="price-highlight">R$ {total.toFixed(2)}</span>
        </div>
      )}
      <button
        className="drinks-config-btn"
        onClick={handleAdicionarAoCarrinho}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default DrinksConfig;
