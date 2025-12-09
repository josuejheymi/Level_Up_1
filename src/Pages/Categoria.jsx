import React, { useMemo, useEffect } from "react";
import { useParams, Link, NavLink } from "react-router-dom"; 
import ProductList from "../Components/common/ProductList";
import { useProducts } from "../Components/products/ProductContext"; 

/**
 * Componente: Página de Categoría
 * Responsabilidad: Filtrar y mostrar productos según la categoría seleccionada en la URL.
 * * Conceptos Clave:
 * 1. Rutas Dinámicas: 'useParams' captura el nombre de la categoría.
 * 2. Filtrado Eficiente: 'useMemo' recalcula la lista solo si cambian los productos o la categoría.
 * 3. Navegación Activa: 'NavLink' nos permite saber qué botón está seleccionado para pintarlo de otro color.
 */
export default function Categoria() {
  
  // 1. HOOKS
  const { nombre } = useParams(); // Obtenemos "teclados", "monitores", etc. desde la URL
  const { allProducts, loading } = useProducts(); // Obtenemos toda la base de datos

  // 2. EFECTO: SCROLL UP
  // Cuando el usuario cambia de categoría, subimos la vista al principio para que no quede a mitad de página.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [nombre]);

  /**
   * LÓGICA: OBTENER CATEGORÍAS DISPONIBLES
   * Recorremos todos los productos para encontrar qué categorías existen realmente en la base de datos.
   * Usamos 'Map' para evitar duplicados (ej: si hay 10 teclados, solo queremos 1 botón "Teclados").
   */
  const availableCategories = useMemo(() => {
    if (!allProducts.length) return [];

    const uniqueCats = new Map();
    // Siempre agregamos "todos" al principio como opción por defecto
    const list = [{ nombre: "todos", imagenUrl: null }];

    allProducts.forEach(p => {
        // Validación defensiva: Aseguramos que el producto tenga categoría válida
        if (p.categoria && p.categoria.nombre) {
            if (!uniqueCats.has(p.categoria.nombre)) {
                uniqueCats.set(p.categoria.nombre, p.categoria);
            }
        }
    });

    // Ordenamos alfabéticamente para que se vea ordenado
    const sortedCats = Array.from(uniqueCats.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    // Unimos "todos" con las categorías encontradas
    return [...list, ...sortedCats];
  }, [allProducts]);

  /**
   * LÓGICA: FILTRAR PRODUCTOS
   * Comparamos el nombre de la categoría del producto con el nombre de la URL.
   */
  const productosFiltrados = useMemo(() => {
    if (!allProducts) return [];
    
    // Si la URL dice "todos", devolvemos la lista completa sin filtrar.
    if (nombre === "todos") return allProducts;
    
    // Si no, filtramos (usamos toLowerCase para evitar problemas de mayúsculas/minúsculas)
    return allProducts.filter(
        (p) => p.categoria?.nombre?.toLowerCase().trim() === nombre.toLowerCase().trim()
    );
  }, [nombre, allProducts]);

  // --- RENDERIZADO: CARGA ---
  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 text-primary">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando catálogo...</span>
            </div>
        </div>
    );
  }

  // --- RENDERIZADO: PRINCIPAL ---
  return (
    <div className="container mt-4 mb-5 fade-in">
      
      {/* BREADCRUMB (Migas de Pan) */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb text-white">
          <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none hover-text-white">Inicio</Link></li>
          <li className="breadcrumb-item active text-capitalize text-white fw-bold" aria-current="page">
            {nombre}
          </li>
        </ol>
      </nav>

      {/* TÍTULO DE SECCIÓN */}
      <h2 className="mb-4 text-uppercase fw-bold border-bottom border-secondary pb-2 text-white">
        {nombre === "todos" ? "Catálogo Completo" : `Categoría: ${nombre}`}
      </h2>

      {/* BARRA DE FILTROS (Navegación por Pestañas/Píldoras) */}
      <div className="d-flex flex-wrap gap-3 mb-4">
        {availableCategories.map((cat) => (
          <NavLink
            key={cat.nombre}
            to={`/categoria/${cat.nombre}`}
            className={({ isActive }) => 
              `btn rounded-pill px-3 py-2 fw-bold d-flex align-items-center transition-transform ${
                isActive 
                  ? "btn-primary shadow scale-105 text-black" // Estilo Activo (Verde brillante)
                  : "btn-dark border-secondary text-secondary hover-light" // Estilo Inactivo (Oscuro)
              }`
            }
            style={{transition: 'all 0.2s ease'}}
          >
            {/* ICONO DE CATEGORÍA */}
            <span className="me-2 d-flex align-items-center justify-content-center" style={{width: '24px', height: '24px'}}>
                {cat.nombre === 'todos' ? (
                    // Icono Rayo para "Todos"
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                ) : cat.imagenUrl ? (
                    // Si tiene imagen, la mostramos en un círculo
                    <img 
                        src={cat.imagenUrl} 
                        alt={cat.nombre} 
                        className="rounded-circle bg-white"
                        style={{width: '24px', height: '24px', objectFit: 'cover', padding: '2px'}} 
                    />
                ) : (
                    // Si no tiene imagen, icono Caja genérico
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                )}
            </span>
            
            <span className="text-capitalize">{cat.nombre}</span>
          </NavLink>
        ))}
      </div>

      {/* LISTADO DE PRODUCTOS */}
      {productosFiltrados.length > 0 ? (
        <ProductList products={productosFiltrados} />
      ) : (
        // Estado Vacío (Empty State)
        <div className="alert alert-warning text-center py-5 shadow-sm border-0 bg-dark text-white border-secondary rounded-3">
          <div className="mb-3">
             {/* Icono Lupa Triste */}
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" stroke="var(--bs-warning)" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><path d="M8 11h6"></path></svg>
          </div>
          <h4 className="mt-3">No encontramos productos en esta categoría.</h4>
          <p className="text-secondary">Prueba seleccionando otra o vuelve a ver todo el catálogo.</p>
          <Link to="/categoria/todos" className="btn btn-outline-light mt-3 rounded-pill px-4 hover-scale">Ver Todo</Link>
        </div>
      )}
    </div>
  );
}