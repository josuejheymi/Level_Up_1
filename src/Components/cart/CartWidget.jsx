import React from "react";
import { useCart } from "./CartContext"; 

/**
 * Componente CartWidget
 * Responsabilidad: Mostrar el ícono del carrito y la cantidad de items.
 * Este es un componente "Consumidor" (Consumer), solo lee datos, no tiene lógica compleja.
 */
export default function CartWidget() {
  
  // 1. CONSUMO DEL CONTEXTO
  // Extraemos solo 'totalItems'. No necesitamos saber qué productos hay,
  // ni calcular precios aquí. El Contexto ya hizo el trabajo sucio por nosotros.
  const { totalItems } = useCart();

  return (
    /**
     * CONTENEDOR PRINCIPAL
     * Clases Bootstrap clave:
     * - position-relative: Es VITAL. Define el "punto cero" para que el badge (hijo)
     * se pueda posicionar de forma absoluta respecto a este div.
     * - d-flex: Alinea el icono verticalmente si hay texto al lado.
     */
    <div className="d-flex align-items-center position-relative p-2 hover-scale text-white">
      
      {/* ÍCONO SVG (Scalable Vector Graphics) */}
      {/* Usamos 'currentColor' en stroke para que herede el color del texto del Navbar */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="feather feather-shopping-cart"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* 2. RENDERIZADO CONDICIONAL (Short-circuit evaluation)
        Si totalItems > 0 es VERDADERO, entonces renderiza el <span>.
        Si es FALSO (0), React ignora todo lo que sigue al '&&'.
      */}
      {(totalItems > 0) && (
        <span 
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success border border-dark"
          style={{ fontSize: "0.75rem" }}
        >
          {totalItems > 99 ? '99+' : totalItems}
          
          {/* ACCESIBILIDAD:
              Este texto es invisible en pantalla, pero los lectores de pantalla (para ciegos)
              lo leerán en voz alta. Es una excelente práctica profesional.
          */}
          <span className="visually-hidden">items en el carrito</span>
        </span>
      )}
    </div>
  );
}