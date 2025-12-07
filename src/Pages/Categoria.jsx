import React, { useMemo, useEffect } from "react"; // ⬅️ Agregamos useEffect
import { useParams, Link, NavLink } from "react-router-dom"; 
import ProductList from "../Components/common/ProductList";
import { useProducts } from "../Components/products/ProductContext"; 

export default function Categoria() {
  const { nombre } = useParams(); 
  const { allProducts, loading } = useProducts();

  // 1. ✨ EFECTO MAGICO: SCROLL UP AUTOMÁTICO
  // Cada vez que cambiamos de categoría ('nombre'), subimos el scroll.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nombre]);

  // 2. OBTENER LISTA DE OBJETOS CATEGORÍA
  const availableCategories = useMemo(() => {
    if (!allProducts.length) return [];

    const uniqueCats = new Map();
    const list = [{ nombre: "todos", imagenUrl: null }];

    allProducts.forEach(p => {
        if (p.categoria && p.categoria.nombre) {
            if (!uniqueCats.has(p.categoria.nombre)) {
                uniqueCats.set(p.categoria.nombre, p.categoria);
            }
        }
    });

    const sortedCats = Array.from(uniqueCats.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
    return [...list, ...sortedCats];
  }, [allProducts]);

  // 3. FILTRAR PRODUCTOS
  const productosFiltrados = useMemo(() => {
    if (!allProducts) return [];
    if (nombre === "todos") return allProducts;
    
    return allProducts.filter(
        (p) => p.categoria?.nombre?.toLowerCase().trim() === nombre.toLowerCase().trim()
    );
  }, [nombre, allProducts]);

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
        <ol className="breadcrumb text-white">
          <li className="breadcrumb-item"><Link to="/" className="text-secondary">Inicio</Link></li>
          <li className="breadcrumb-item active text-capitalize text-white" aria-current="page">
            {nombre}
          </li>
        </ol>
      </nav>

      <h2 className="mb-4 text-uppercase fw-bold border-bottom pb-2 text-white">
        {nombre === "todos" ? "Catálogo Completo" : `Categoría: ${nombre}`}
      </h2>

      {/* BARRA DE FILTROS */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {availableCategories.map((cat) => (
          <NavLink
            key={cat.nombre}
            to={`/categoria/${cat.nombre}`}
            className={({ isActive }) => 
              `btn rounded-pill px-3 py-2 fw-bold d-flex align-items-center transition-transform ${
                isActive 
                  ? "btn-primary shadow scale-105" 
                  : "btn-dark border-secondary text-secondary hover-light"
              }`
            }
            style={{transition: 'all 0.2s ease'}}
          >
            <span className="me-2 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                {cat.nombre === 'todos' ? (
                    <span style={{fontSize: '1.2rem'}}>⚡</span>
                ) : cat.imagenUrl ? (
                    <img 
                        src={cat.imagenUrl} 
                        alt={cat.nombre} 
                        className="rounded-circle bg-white"
                        style={{width: '24px', height: '24px', objectFit: 'cover', padding: '2px'}} 
                    />
                ) : (
                    <span style={{fontSize: '1.2rem'}}>📦</span>
                )}
            </span>
            
            <span className="text-capitalize">{cat.nombre}</span>
          </NavLink>
        ))}
      </div>

      {/* LISTADO */}
      {productosFiltrados.length > 0 ? (
        <ProductList products={productosFiltrados} />
      ) : (
        <div className="alert alert-warning text-center py-5 shadow-sm border-0 bg-dark text-white border-secondary">
          <div style={{ fontSize: "3rem" }}>😕</div>
          <h4 className="mt-3">No encontramos productos en esta categoría.</h4>
          <p className="text-secondary">Prueba seleccionando otra o vuelve a "Todos".</p>
          <Link to="/categoria/todos" className="btn btn-outline-light mt-3 rounded-pill px-4">Ver Todo</Link>
        </div>
      )}
    </div>
  );
}