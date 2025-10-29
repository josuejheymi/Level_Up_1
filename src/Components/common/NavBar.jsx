// Este archivo define el componente Navbar, que es la barra de navegación principal de la aplicación**

// Importamos componentes de React Router para navegación
import { Link, NavLink } from "react-router-dom";
// Importamos el componente del icono del carrito
import CartWidget from "../cart/CartWidget";
// Importamos el hook para acceder al contexto del usuario
import { useUser } from "../user/UserContext";
// Importamos el dropdown del usuario (para cuando está logueado)
import UserDropdown from "../user/UserDropdown";
// Importamos la barra de búsqueda
import SearchBar from "./SearchBar";

// Este componente representa la barra de navegación principal de la aplicación
export default function Navbar() {
  // Obtenemos el usuario actual para determinar si está logueado o no
  const { currentUser } = useUser();

  // Función que maneja las búsquedas realizadas por el usuario
  const handleSearch = (query) => {
    console.log("Buscar:", query);
    // Aquí normalmente se filtrarían los productos en Home o se dispararía un estado global
    // con el término de búsqueda para que otros componentes puedan usarlo
  };

  // Renderizamos la barra de navegación
  return (
    // Navbar principal con clases de Bootstrap para estilo oscuro y responsive
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      {/* Contenedor para alinear el contenido */}
      <div className="container">

        {/* Logo/Marca de la aplicación - enlace a la página principal */}
        <NavLink to="/" className="navbar-brand">
          Level Up Gamer
        </NavLink>

        {/* Componente de barra de búsqueda */}
        <SearchBar onSearch={handleSearch} />

        {/* Contenedor colapsable para menú responsive */}
        <div className="collapse navbar-collapse">

          {/* Menú de navegación principal (lado izquierdo) */}
          <ul className="navbar-nav me-auto">
            {/* Enlace a la página de inicio */}
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Inicio
              </NavLink>
            </li>
            {/* Enlace a la página "Acerca de" */}
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                Acerca de
              </NavLink>
            </li>
          </ul>

          {/* Menú de usuario (lado derecho) */}
          <ul className="navbar-nav ms-auto align-items-center">

            {/* Verificamos si hay un usuario logueado */}
            {currentUser ? (
              // Si el usuario ESTÁ logueado, mostramos el dropdown de usuario
              <li className="nav-item">
                <UserDropdown />
              </li>
            ) : (
              // Si el usuario NO está logueado, mostramos opciones de login/registro
              <>
                {/* Enlace a la página de login */}
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                {/* Enlace a la página de registro */}
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* Icono del carrito de compras - siempre visible */}
            <li className="nav-item ms-3">
              <Link to="/cart" className="nav-link">
                <CartWidget />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}