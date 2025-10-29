// Componente de dropdown de usuario que muestra opciones de perfil y cerrar sesión

import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

export default function UserDropdown() {
  // Obtiene el usuario actual y función para cerrar sesión del contexto
  const { currentUser, logoutUser } = useUser();

  // Estado para controlar si el dropdown está abierto o cerrado
  const [open, setOpen] = useState(false);

  // Si no hay usuario logueado, no muestra nada
  if (!currentUser) return null;

  return (
    // Contenedor del dropdown que se cierra cuando el mouse sale
    <div className="dropdown" onMouseLeave={() => setOpen(false)}>

      {/* Botón que muestra el nombre del usuario y abre/cierra el menú */}
      <button
        className="btn btn-secondary dropdown-toggle"
        onClick={() => setOpen(!open)} // Alterna entre abrir y cerrar
      >
        {currentUser.name} {/* Muestra el nombre del usuario */}
      </button>

      {/* Menú desplegable que solo se muestra cuando open es true */}
      {open && (
        <ul className="dropdown-menu show">
          {/* Opción para ir al perfil del usuario */}
          <li>
            <Link
              className="dropdown-item"
              to="/profile"
              onClick={() => setOpen(false)} // Cierra el menú al hacer clic
            >
              Mi Perfil
            </Link>
          </li>

          {/* Opción para cerrar sesión */}
          <li>
            <button
              className="dropdown-item"
              onClick={() => {
                logoutUser(); // Cierra la sesión
                setOpen(false); // Cierra el menú
              }}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}