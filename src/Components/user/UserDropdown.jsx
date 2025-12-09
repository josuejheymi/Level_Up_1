import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

/**
 * Componente: Menú Desplegable de Usuario
 * Responsabilidad: Mostrar opciones de cuenta (Perfil, Admin, Logout).
 * * Concepto Clave: Click Outside
 * Usamos 'useRef' para detectar si el usuario hizo clic fuera del menú para cerrarlo automáticamente.
 */
export default function UserDropdown({ closeNav }) {
  // 1. HOOKS
  const { user, logout } = useUser();
  const navigate = useNavigate();
  
  // Estado local para visibilidad del menú
  const [isOpen, setIsOpen] = useState(false);
  
  // Referencia al elemento DOM del menú
  const dropdownRef = useRef(null);

  /**
   * EFECTO: Detectar Click Fuera
   * Añade un 'listener' global al documento. Si el clic ocurre fuera de 'dropdownRef', cerramos el menú.
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Si no hay usuario, no renderizamos nada (Seguridad visual)
  if (!user) return null;

  // Lógica de Roles: ¿Es Staff?
  const isStaff = user.rol === "ADMIN" || user.rol === "VENDEDOR";

  // Cierra tanto este dropdown como el menú principal (móvil)
  const handleCloseAll = () => {
    setIsOpen(false);
    if (closeNav) closeNav();
  };

  const handleLogout = () => {
    handleCloseAll();
    logout();
    navigate("/");
  };

  return (
    <div className="dropdown position-relative" ref={dropdownRef}>
      
      {/* BOTÓN ACTIVADOR (TOGGLE) */}
      <button
        className={`btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 ${isOpen ? "active" : ""}`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="fw-bold text-uppercase" style={{ color: "var(--accent-primary)" }}>
            {user.nombre}
        </span>
      </button>

      {/* MENÚ DESPLEGABLE */}
      {isOpen && (
        <ul 
          className="dropdown-menu show bg-dark border border-secondary shadow-lg p-0 overflow-hidden" 
          style={{ position: "absolute", right: 0, left: "auto", minWidth: "250px", zIndex: 1050 }}
        >
          {/* CABECERA CON DATOS DE USUARIO */}
          <li className="dropdown-header bg-black py-3 border-bottom border-secondary">
            <div className="text-white fw-bold text-truncate">{user.email}</div>
            <div className="mt-2 d-flex gap-2 flex-wrap">
                <span className="badge bg-primary border border-success text-black">{user.rol}</span>
                {user.esEstudianteDuoc && (
                    <span className="badge bg-dark text-success border border-success">Duoc VIP</span>
                )}
            </div>
          </li>
          
          {/* OPCIÓN: PANEL DE STAFF (Solo visible para Admin/Vendedor) */}
          {isStaff && (
            <li>
              <Link 
                className="dropdown-item text-white py-2 hover-bg-dark-gray d-flex align-items-center gap-2" 
                to="/admin" 
                onClick={handleCloseAll}
                style={{ borderLeft: "4px solid var(--accent-primary)" }}
              >
                {/* Icono Dashboard */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="6" height="6" rx="1" />
                  <rect x="13" y="3" width="6" height="6" rx="1" />
                  <rect x="3" y="13" width="6" height="6" rx="1" />
                  <rect x="13" y="13" width="6" height="6" rx="1" />
                </svg>  
                Panel de Staff
              </Link>
            </li>
          )}

          {/* OPCIÓN: MI PERFIL */}
          <li>
            <Link 
                className="dropdown-item text-white py-2 hover-bg-dark-gray d-flex align-items-center gap-2" 
                to="/profile" 
                onClick={handleCloseAll}
            >
              {/* Icono Usuario */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="6" r="3.2" />
                <path d="M3.5 17c0-3.3 2.7-6 5.5-6s5.5 2.7 5.5 6" />
              </svg>
              Mi Perfil
            </Link>
          </li>

          <li><hr className="dropdown-divider bg-secondary my-0" /></li>

          {/* OPCIÓN: CERRAR SESIÓN */}
          <li>
            <button
              className="dropdown-item text-danger fw-bold py-3 hover-bg-dark-gray w-100 text-start d-flex align-items-center gap-2"
              onClick={handleLogout}
            >
              {/* Icono Logout */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" />
                <polyline points="12 8 16 12 12 16" />
                <line x1="16" y1="12" x2="8" y2="12" />
              </svg>
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}