import React from "react";
import { useCart } from "./CartContext"; // Asegúrate de importar el hook

export default function CartWidget() {
  // En lugar de traer todo el 'cart' y calcular, traemos el 'totalItems' ya listo
  const { totalItems } = useCart();

  return (
    <div className="d-flex align-items-center position-relative">
      {/* Ícono de carrito (puedes cambiarlo por un SVG o Icono de librería) */}
      <span style={{ fontSize: "1.5rem" }}>🛒</span>
      
      {/* Badge con el número (solo se muestra si hay items) */}
      {(totalItems > 0) && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: "0.75rem" }}
        >
          {totalItems}
          <span className="visually-hidden">items en el carrito</span>
        </span>
      )}
    </div>
  );
}