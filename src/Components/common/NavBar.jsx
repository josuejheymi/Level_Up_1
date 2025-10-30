// Navbar.jsx - Versión actualizada
import { Link, NavLink } from "react-router-dom";
import CartWidget from "../cart/CartWidget";
import { useUser } from "../user/UserContext";
import UserDropdown from "../user/UserDropdown";
import SearchBar from "./SearchBar";

// Este componente representa la barra de navegación principal de la aplicación
export default function Navbar({ onSearch }) { // ← Recibe onSearch como prop
  const { currentUser } = useUser();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Marca o logo */}
        <NavLink to="/" className="navbar-brand">
          Level Up Gamer
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

        {/* Barra de búsqueda - ahora funciona! */}
        <SearchBar onSearch={onSearch} />

        {/* Sección colapsable */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/categoria/todos" className="nav-link">
                Categorias
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                Acerca de
              </NavLink>
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
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Carrito siempre visible */}
        <div className="d-flex align-items-center ms-3">
          <Link to="/cart" className="nav-link text-light">
            <CartWidget />
          </Link>
        </div>
      </div>
    </nav>
  );
}