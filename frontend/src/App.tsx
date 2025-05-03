import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Register from "./pages/Register";
import PizzaConfig from "./pages/PizzaConfig";
import DrinksConfig from "./pages/DrinksConfig";
import Payment from "./pages/Payment";
import Welcome from "./components/Welcome";

// Componente wrapper para acessar o hook useLocation fora do BrowserRouter
const AppContent: React.FC = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!hideHeaderFooter && <Header />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pizza-config" element={<PizzaConfig />} />
          <Route path="/drinks-config" element={<DrinksConfig />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
