import React from "react";
import ProductCard from "./ProductCard";

/**
 * Componente: ProductList
 * Responsabilidad: Renderizar una grilla responsive de tarjetas de productos.
 * Patrón de Diseño: "List Component" (Recibe un array y renderiza N componentes hijos).
 */
export default function ProductList({ products }) {

  // 1. VALIDACIÓN DEFENSIVA (Guard Clause)
  // Si la prop 'products' es undefined, null o un array vacío, mostramos un mensaje
  // amigable en lugar de dejar que React intente mapear 'undefined' (lo que rompería la app).
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5 fade-in">
        <div style={{fontSize: "3rem"}}>🔍</div>
        <h4 className="text-white mt-3">No se encontraron productos.</h4>
        <p className="text-secondary">Intenta ajustar tus filtros de búsqueda.</p>
      </div>
    );
  }

  return (
    /**
     * SISTEMA DE GRILLA BOOTSTRAP (Moderno)
     * En lugar de definir el ancho en cada columna, lo definimos en el padre (row).
     * * - row: Contenedor flexbox.
     * - row-cols-1: En Móvil (xs), muestra 1 tarjeta por fila (ancho 100%).
     * - row-cols-md-2: En Tablet (md), muestra 2 tarjetas por fila (50% c/u).
     * - row-cols-lg-3: En Escritorio (lg), muestra 3 tarjetas por fila (33% c/u).
     * - g-4: "Gap" (Espaciado) de nivel 4 entre tarjetas, tanto horizontal como vertical.
     */
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 fade-in">
      
      {/* 2. ITERACIÓN DE DATOS (.map) */}
      {products.map((product) => (
        <div className="col" key={product.id}>
          {/* IMPORTANTE: La Prop 'key'
             React necesita un identificador único (key) para saber qué elemento
             se actualizó, borró o añadió. SIEMPRE usa un ID único de base de datos,
             nunca uses el índice del array (index) si la lista puede cambiar de orden.
          */}
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}