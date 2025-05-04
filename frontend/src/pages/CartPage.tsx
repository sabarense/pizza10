import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Cart.css";

type CartItem = {
  id: number;
  drink_id: number;
  nome: string;
  preco: number;
  quantidade: number;
};

type PizzaItem = {
  id: number;
  size: string;
  crust: string;
  flavors: string[];
  preco: number;
};

type CartResponse = {
  items: CartItem[];
  pizzas: PizzaItem[];
  total: number;
};

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [pizzas, setPizzas] = useState<PizzaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [removingDrinkId, setRemovingDrinkId] = useState<number | null>(null);
  const [removingPizzaId, setRemovingPizzaId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get<CartResponse>("http://localhost:5000/api/cart", {
          withCredentials: true,
        });
        setCartItems(response.data.items || []);
        setPizzas(response.data.pizzas || []);
        setTotal(response.data.total);
      } catch (err) {
        setError("Erro ao carregar carrinho");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    setUpdatingItemId(itemId);
    try {
      await axios.put(
        `http://localhost:5000/api/cart/update/${itemId}`,
        { quantidade: newQuantity },
        { withCredentials: true }
      );
      const response = await axios.get<CartResponse>("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(response.data.items || []);
      setPizzas(response.data.pizzas || []);
      setTotal(response.data.total);
    } catch (err) {
      alert("Erro ao atualizar quantidade");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeDrink = async (itemId: number) => {
    setRemovingDrinkId(itemId);
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        withCredentials: true,
      });
      const response = await axios.get<CartResponse>("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(response.data.items || []);
      setPizzas(response.data.pizzas || []);
      setTotal(response.data.total);
    } catch (err) {
      alert("Erro ao remover bebida");
    } finally {
      setRemovingDrinkId(null);
    }
  };

  const removePizza = async (pizzaId: number) => {
    setRemovingPizzaId(pizzaId);
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove-pizza/${pizzaId}`, {
        withCredentials: true,
      });
      const response = await axios.get<CartResponse>("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      setCartItems(response.data.items || []);
      setPizzas(response.data.pizzas || []);
      setTotal(response.data.total);
    } catch (err) {
      alert("Erro ao remover pizza");
    } finally {
      setRemovingPizzaId(null);
    }
  };

  if (loading) return <div className="loading">Carregando carrinho...</div>;
  if (error) return <div className="error">{error}</div>;

  // Função para traduzir tamanhos e tipos de crosta
  const traduzirTamanho = (size: string) => {
    const traducoes: {[key: string]: string} = {
      'broto': 'Broto',
      'media': 'Média',
      'grande': 'Grande',
      'familia': 'Família'
    };
    return traducoes[size] || size;
  };
  
  const traduzirCrosta = (crust: string) => {
    const traducoes: {[key: string]: string} = {
      'fina': 'Fina',
      'regular': 'Regular',
      'recheada': 'Recheada'
    };
    return traducoes[crust] || crust;
  };

  return (
    <div className="cart-root">
      <h2 className="cart-title">Carrinho</h2>
      
      {cartItems.length === 0 && pizzas.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio</p>
        </div>
      ) : (
        <>
          {cartItems.length > 0 && (
            <div className="cart-section">
              <h3>Bebidas</h3>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.nome}</span>
                      <span className="item-price">R$ {item.preco.toFixed(2)}</span>
                    </div>
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                          disabled={item.quantidade <= 1 || updatingItemId === item.id}
                        >
                          {updatingItemId === item.id ? '⌛' : '-'}
                        </button>
                        <span>{item.quantidade}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          disabled={updatingItemId === item.id}
                        >
                          {updatingItemId === item.id ? '⌛' : '+'}
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeDrink(item.id)}
                        disabled={removingDrinkId === item.id}
                      >
                        {removingDrinkId === item.id ? 'Removendo...' : 'Remover'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pizzas.length > 0 && (
            <div className="cart-section">
              <h3>Pizzas</h3>
              <div className="cart-items">
                {pizzas.map(pizza => (
                  <div key={pizza.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">Pizza {traduzirTamanho(pizza.size)}</span>
                      <span className="item-price">R$ {pizza.preco.toFixed(2)}</span>
                      <div className="item-details">
                        <div><strong>Crosta:</strong> {traduzirCrosta(pizza.crust)}</div>
                        <div>
                          <strong>Sabores:</strong>{" "}
                          {pizza.flavors && pizza.flavors.length > 0
                            ? pizza.flavors.join(", ")
                            : "Nenhum sabor selecionado"}
                        </div>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removePizza(pizza.id)}
                      disabled={removingPizzaId === pizza.id}
                    >
                      {removingPizzaId === pizza.id ? "Removendo..." : "Remover"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Botões de adicionar bebidas/pizza sempre visíveis */}
      <div className="empty-cart-buttons" style={{ marginBottom: 24 }}>
        <button className="cart-btn" onClick={() => navigate("/drinks-config")}>
          Adicionar Bebidas
        </button>
        <button className="cart-btn" onClick={() => navigate("/pizza-config")}>
          Adicionar Pizza
        </button>
      </div>

      <div className="cart-summary">
        <div className="total">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={() => navigate("/payment")}>
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default CartPage;
