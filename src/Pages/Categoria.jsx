import React, { useMemo } from "react";
import { useParams, Link, NavLink } from "react-router-dom"; 
import ProductList from "../Components/common/ProductList";

// --- CORRECCIÓN AQUÍ ---
// Antes decía: "../products/ProductContext"
// Ahora dice: "../Components/products/ProductContext"
import { useProducts } from "../Components/products/ProductContext"; 

export default function Categoria() {
  const { nombre } = useParams(); 
  const { allProducts, loading } = useProducts();

  // 1. OBTENER LISTA DE CATEGORÍAS ÚNICAS
  const availableCategories = useMemo(() => {
    if (!allProducts.length) return [];
    const unique = [...new Set(allProducts.map(p => p.categoria))];
    return ["todos", ...unique.sort()];
  }, [allProducts]);

  // 2. FILTRAR PRODUCTOS
  const productosFiltrados = useMemo(() => {
    if (!allProducts) return [];
    if (nombre === "todos") return allProducts;
    
    // Usamos trim() y toLowerCase() para evitar errores de tipeo
    return allProducts.filter(
      (p) => p.categoria.toLowerCase().trim() === nombre.toLowerCase().trim()
    );
  }, [nombre, allProducts]);

  // 3. ASIGNAR ÍCONOS
  const getIcon = (cat) => {
    const cleanCat = cat.toLowerCase().trim();

    const icons = {
      "todos": "⚡",
      "consolas": "🎮",
      "pc gamer": "🖥️",
      "accesorios": "🎧",
      "sillas": "💺",
      "juegos": "🕹️",
      "ropa": "👕",
      "chavo del 8": "🤠",
      "ofertas": "🔥"
    };
    
    return icons[cleanCat] || "📦"; 
  };

  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );
  }

  return (
    <div className="container mt-4 mb-5 fade-in">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active text-capitalize" aria-current="page">
            {nombre}
          </li>
        </ol>
      </nav>

      <h2 className="mb-4 text-uppercase fw-bold border-bottom pb-2">
        {nombre === "todos" ? "Catálogo Completo" : `Categoría: ${nombre}`}
      </h2>

      {/* BARRA DE FILTROS */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {availableCategories.map((cat) => (
          <NavLink
            key={cat}
            to={`/categoria/${cat}`}
            className={({ isActive }) => 
              `btn rounded-pill px-4 fw-bold transition-transform ${
                isActive 
                  ? "btn-primary shadow" 
                  : "btn-outline-secondary border-0 bg-light"
              }`
            }
          >
            <span className="me-2">{getIcon(cat)}</span>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </NavLink>
        ))}
      </div>

      {/* LISTADO */}
      {productosFiltrados.length > 0 ? (
        <ProductList products={productosFiltrados} />
      ) : (
        <div className="alert alert-warning text-center py-5 shadow-sm border-0">
          <div style={{ fontSize: "3rem" }}>😕</div>
          <h4 className="mt-3">No encontramos productos en esta categoría.</h4>
          <p className="text-muted">Prueba seleccionando otra o vuelve a "Todos".</p>
          <Link to="/categoria/todos" className="btn btn-dark mt-3 rounded-pill px-4">Ver Todo</Link>
        </div>
      )}
    </div>
  );
} 