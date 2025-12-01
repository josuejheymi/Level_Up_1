import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function UserDropdown() {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  // Staff = ADMIN o VENDEDOR
  const isStaff = user.rol === "ADMIN" || user.rol === "VENDEDOR";

  return (
    <div className="dropdown position-relative" onMouseLeave={() => setOpen(false)}>
      
      {/* Botón Principal */}
      <button
        className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span className="fw-bold text-uppercase" style={{ color: "var(--accent-primary)" }}>
            {user.nombre}
        </span>
      </button>

      {/* Menú Desplegable Oscuro */}
      {open && (
        <ul 
          className="dropdown-menu show bg-dark border border-secondary shadow-lg p-0 overflow-hidden" 
          style={{ position: "absolute", right: 0, left: "auto", minWidth: "240px", zIndex: 1050 }}
        >
          {/* Header con info de usuario */}
          <li className="dropdown-header bg-black py-3 border-bottom border-secondary">
            <div className="text-white fw-bold text-truncate">{user.email}</div>
            <div className="mt-2 d-flex gap-2 flex-wrap">
                <span className="badge bg-primary border border-success text-black">
                    {user.rol}
                </span>
                {user.esEstudianteDuoc && (
                    <span className="badge bg-dark text-success border border-success">
                        Duoc VIP
                    </span>
                )}
            </div>
          </li>
          
          {/* Opción PANEL DE STAFF (Solo Admin/Vendedor) */}
          {isStaff && (
            <li>
              <Link 
                className="dropdown-item text-white py-2 hover-bg-dark-gray" 
                to="/admin" 
                onClick={() => setOpen(false)}
                style={{ borderLeft: "4px solid var(--accent-primary)" }}
              >
                <span className="me-2">⚡</span> Panel de Staff
              </Link>
            </li>
          )}

          <li>
            <Link 
                className="dropdown-item text-white py-2 hover-bg-dark-gray" 
                to="/profile" 
                onClick={() => setOpen(false)}
            >
              <span className="me-2">👤</span> Mi Perfil
            </Link>
          </li>

          <li><hr className="dropdown-divider bg-secondary my-0" /></li>

          {/* Cerrar Sesión */}
          <li>
            <button
              className="dropdown-item text-danger fw-bold py-3 hover-bg-dark-gray w-100 text-start"
              onClick={handleLogout}
            >
              <span className="me-2">🚪</span> Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  );
} 