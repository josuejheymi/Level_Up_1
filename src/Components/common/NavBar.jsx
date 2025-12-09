import React, { useState } from "react"; 
import { NavLink, useNavigate, useLocation } from "react-router-dom"; 
import CartWidget from "../cart/CartWidget";
import { useUser } from "../user/UserContext";
import UserDropdown from "../user/UserDropdown";
import SearchBar from "./SearchBar";
import { useProducts } from "../products/ProductContext"; 

/**
 * Componente de Navegación Principal
 * Responsabilidad: Manejar el enrutamiento visual, la búsqueda global y el estado de sesión.
 */
export default function Navbar() {
  // --- 1. HOOKS DE CONTEXTO Y ROUTER ---
  const { user } = useUser(); // Estado de sesión (si existe usuario)
  const { setSearchTerm } = useProducts(); // Filtro global de productos
  
  const navigate = useNavigate();
  const location = useLocation();

  // --- 2. ESTADO LOCAL (UI) ---
  // Controla si el menú hamburguesa (móvil) está desplegado o colapsado.
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // --- 3. HANDLERS (MANEJADORES DE EVENTOS) ---

  // Cierra el menú móvil. Se usa al hacer clic en cualquier enlace.
  const closeNav = () => {
    setIsNavExpanded(false);
  };

  // Alterna el estado del menú (Abrir/Cerrar).
  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  /**
   * Lógica de Búsqueda Inteligente
   * 1. Cierra el menú móvil si está abierto.
   * 2. Actualiza el término de búsqueda en el contexto global.
   * 3. Si el usuario no está en el Home, lo redirige.
   * 4. Hace un scroll suave hacia la sección de productos para mejorar UX.
   */
  const handleSearch = (query) => {
    closeNav(); 
    setSearchTerm(query);

    // Redirección si estamos en otra página (ej: /contacto)
    if (location.pathname !== "/") {
      navigate("/");
    }

    // Scroll con Offset (Desplazamiento)
    // Esperamos 100ms para asegurar que el DOM se haya renderizado tras la navegación
    if (query.trim().length > 0) {
        setTimeout(() => {
            const productSection = document.querySelector(".all-products-section");
            if (productSection) {
                const elementPosition = productSection.getBoundingClientRect().top;
                // Restamos 120px para compensar la altura del Navbar fijo
                const offsetPosition = elementPosition + window.pageYOffset - 120; 

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 100); 
    }
  };

  // Resetea la búsqueda y vuelve al inicio de la página (usado en el Logo/Inicio)
  const handleResetSearch = () => {
      setSearchTerm("");
      window.scrollTo(0, 0);
      closeNav(); 
  };

  // --- 4. RENDERIZADO (JSX) ---
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm" style={{zIndex: 1000}}>
      <div className="container">
        
        {/* === LOGOTIPO === */}
        <NavLink 
            to="/" 
            className="navbar-brand d-flex align-items-center"
            onClick={handleResetSearch}
        >
          <span className="fs-4 fw-bold text-uppercase text-primary">Level Up</span>
          <span className="fs-4 fw-bold text-uppercase text-light ms-2">Gamer</span>
        </NavLink>

        {/* === BOTÓN HAMBURGUESA (MÓVIL) === */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNav} 
          aria-expanded={isNavExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* === BARRA DE BÚSQUEDA (DESKTOP) === */}
        {/* SOLUCIÓN VISUAL:
            - flex-grow-1: Ocupa el espacio disponible pero respeta los márgenes.
            - maxWidth: Evita que se estire demasiado y aplaste los enlaces.
            - ms-4 me-4: Márgenes laterales para separar del logo y el menú.
        */}
        <div className="d-none d-lg-block ms-4 me-4 flex-grow-1" style={{ maxWidth: "350px" }}>
            <SearchBar onSearch={handleSearch} />
        </div>

        {/* === CONTENIDO COLAPSIBLE === */}
        <div className={`collapse navbar-collapse ${isNavExpanded ? "show" : ""}`} id="navbarNav">
          
          {/* Barra de Búsqueda (Solo visible en Móvil) */}
          <div className="d-lg-none my-3">
             <SearchBar onSearch={handleSearch} />
          </div>

          {/* Enlaces de Navegación */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={handleResetSearch}>Inicio</NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="/blog" className="nav-link" onClick={closeNav}>
                Blogs <span className="badge bg-danger rounded-pill ms-1" style={{fontSize: "0.6rem"}}>NEW</span>
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="/ofertas" className="nav-link text-warning fw-bold" onClick={closeNav}>
                Offers
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/categoria/todos" className="nav-link" onClick={closeNav}>Categorías</NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink to="/about" className="nav-link" onClick={closeNav}>Info</NavLink>
            </li>
          </ul>

          {/* Área de Usuario y Carrito */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            
            {/* Lógica Condicional: ¿Está logueado? */}
            {user ? (
              <li className="nav-item">
                <UserDropdown closeNav={closeNav} />
              </li>
            ) : (
              // Fragmento (<>...</>) para agrupar elementos sin añadir nodos al DOM
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link fw-semibold" onClick={closeNav}>Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-primary btn-sm px-4 rounded-pill fw-bold" onClick={closeNav}>
                    Register
                  </NavLink>
                </li>
              </>
            )}
            
            {/* Widget del Carrito */}
            <li className="nav-item">
              <NavLink to="/cart" className="nav-link text-light position-relative p-0" onClick={closeNav}>
                <CartWidget />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}