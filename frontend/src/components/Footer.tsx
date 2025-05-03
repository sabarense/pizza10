import React from "react";
import "../css/Footer.css";

const Footer: React.FC = () => (
  <footer className="app-footer">
    <span>
      Pizza10 &copy; {new Date().getFullYear()} &mdash; Feito com <span role="img" aria-label="pizza">🍕</span>
    </span>
  </footer>
);

export default Footer;
