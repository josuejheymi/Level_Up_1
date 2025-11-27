import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ProductList from "../Components/common/ProductList";
// 1. Importamos el hook del contexto
import { useProducts } from "../Components/products/ProductContext";

export default function Categoria() {
  const { nombre } = useParams(); // Ej: "consolas", "juegos"
  // 2. Sacamos TODOS los productos del contexto
  const { allProducts, loading } = useProducts();

  // 3. Filtramos dinámicamente
  const productosFiltrados = useMemo(() => {
    if (!allProducts) return [];
    if (nombre === "todos") return allProducts;
    return allProducts.filter(
      (p) => p.categoria.toLowerCase() === nombre.toLowerCase()
    );
  }, [nombre, allProducts]);

  if (loading) {
    return <div className="container mt-5 text-center">Cargando categoría...</div>;
  }

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">
            {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
          </li>
        </ol>
      </nav>

      <h2 className="mb-4 text-uppercase fw-bold border-bottom pb-2">
        {nombre === "todos" ? "Todas las Categorías" : `Categoría: ${nombre}`}
      </h2>

      {productosFiltrados.length > 0 ? (
        <ProductList products={productosFiltrados} />
      ) : (
        <div className="alert alert-warning text-center">
          No hay productos en esta categoría todavía.
        </div>
      )}
    </div>
  );
}