import { Link, NavLink } from "react-router-dom";
import CartWidget from "../cart/CartWidget";
import { useUser } from "../user/UserContext";
import UserDropdown from "../user/UserDropdown";
import SearchBar from "./SearchBar";
// IMPORTANTE: Conectamos con el contexto de productos
import { useProducts } from "../products/ProductContext";

export default function Navbar() {
  const { currentUser } = useUser();
  // Obtenemos la función para actualizar la búsqueda globalmente
  const { setSearchQuery } = useProducts();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        {/* Marca o logo */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <span className="fs-4 fw-bold text-uppercase">Level Up Gamer</span>
        </NavLink>

        {/* Botón hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Barra de búsqueda Conectada */}
        {/* Pasamos setSearchQuery directamente al SearchBar */}
        <div className="d-none d-lg-block mx-auto" style={{ width: "40%" }}>
            <SearchBar onSearch={setSearchQuery} />
        </div>

        {/* Sección colapsable */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-lg-none">
             {/* SearchBar para móvil */}
             <li className="nav-item mb-2">
                <SearchBar onSearch={setSearchQuery} />
             </li>
          </ul>

          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/categoria/todos" className="nav-link">Categorías</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">Acerca de</NavLink>
            </li>
          </ul>

          {/* Opciones de usuario */}
          <ul className="navbar-nav ms-auto align-items-center">
            {currentUser ? (
              <li className="nav-item">
                <UserDropdown />
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link btn btn-outline-light btn-sm ms-2 px-3 rounded-pill">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Carrito siempre visible */}
        <div className="d-flex align-items-center ms-3">
          <Link to="/cart" className="nav-link text-light position-relative">
            <CartWidget />
          </Link>
        </div>
      </div>
    </nav>
  );
}