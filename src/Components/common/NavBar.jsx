import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom"; 
import CartWidget from "../cart/CartWidget";
import { useUser } from "../user/UserContext";
import UserDropdown from "../user/UserDropdown";
import SearchBar from "./SearchBar";
import { useProducts } from "../products/ProductContext"; 

export default function Navbar() {
  const { user } = useUser();
  const { setSearchTerm } = useProducts(); 
  
  const navigate = useNavigate();
  const location = useLocation();

  // Función inteligente para manejar la búsqueda
  const handleSearch = (query) => {
    // 1. Actualizamos el filtro global
    setSearchTerm(query);

    // 2. Lógica de Redirección
    if (location.pathname !== "/") {
      navigate("/");
    }

    // 3. (UX PRO) Scroll con Offset (Para que el Navbar no tape los resultados)
    if (query.trim().length > 0) {
        setTimeout(() => {
            const productSection = document.querySelector(".all-products-section");
            if (productSection) {
                // Obtenemos la posición del elemento
                const elementPosition = productSection.getBoundingClientRect().top;
                // Sumamos el scroll actual
                const offsetPosition = elementPosition + window.pageYOffset - 120; // ⬅️ -120px de espacio para el Navbar

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 100); // Pequeño delay para asegurar que React renderizó
    }
  };

  // Helper para resetear búsqueda al hacer click en links
  const handleResetSearch = () => {
      setSearchTerm("");
      window.scrollTo(0, 0);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm" style={{zIndex: 1000}}>
      <div className="container">
        
        {/* LOGO */}
        <NavLink 
            to="/" 
            className="navbar-brand d-flex align-items-center"
            onClick={handleResetSearch}
        >
          <span className="fs-4 fw-bold text-uppercase text-primary">Level Up</span>
          <span className="fs-4 fw-bold text-uppercase text-light ms-2">Gamer</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* BARRA DE BÚSQUEDA CENTRAL (Desktop) */}
        <div className="d-none d-lg-block mx-auto" style={{ width: "40%" }}>
            <SearchBar onSearch={handleSearch} />
        </div>

        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* SearchBar (Móvil) */}
          <div className="d-lg-none my-3">
             <SearchBar onSearch={handleSearch} />
          </div>

          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={handleResetSearch}>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/blog" className="nav-link">
                Noticias <span className="badge bg-danger rounded-pill ms-1" style={{fontSize: "0.6rem"}}>NEW</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/categoria/todos" className="nav-link">Categorías</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">Nosotros</NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {user ? (
              <li className="nav-item">
                <UserDropdown />
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link fw-semibold">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-primary btn-sm px-4 rounded-pill fw-bold">
                    Registro
                  </NavLink>
                </li>
              </>
            )}
            
            <li className="nav-item">
              <NavLink to="/cart" className="nav-link text-light position-relative p-0">
                <CartWidget />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}