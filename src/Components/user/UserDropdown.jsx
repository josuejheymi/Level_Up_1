import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function UserDropdown() {
  // 1. Usamos los nombres correctos del nuevo UserContext
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Si no hay usuario, no mostramos nada
  if (!user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/"); // Redirigir al home al salir
  };

  return (
    <div className="dropdown position-relative" onMouseLeave={() => setOpen(false)}>
      
      {/* Botón con el nombre del usuario (user.nombre viene de Java) */}
      <button
        className="btn btn-secondary dropdown-toggle d-flex align-items-center gap-2"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <i className="bi bi-person-circle"></i> {/* Icono opcional si usas Bootstrap Icons */}
        {user.nombre}
      </button>

      {/* Menú Desplegable */}
      {open && (
        <ul 
          className="dropdown-menu show" 
          style={{ position: "absolute", right: 0, left: "auto", minWidth: "200px" }}
        >
          {/* Header con el correo */}
          <li className="dropdown-header text-truncate">
            {user.email}
            {user.esEstudianteDuoc && <span className="badge bg-success ms-2">Duoc VIP</span>}
          </li>
          
          <li><hr className="dropdown-divider" /></li>

          {/* Opción ADMIN (Solo si el rol es ADMIN) */}
          {user.rol === "ADMIN" && (
            <li>
              <Link className="dropdown-item fw-bold text-primary" to="/admin" onClick={() => setOpen(false)}>
                ⚙️ Panel Admin
              </Link>
            </li>
          )}

          {/* Opción Perfil */}
          <li>
            <Link className="dropdown-item" to="/profile" onClick={() => setOpen(false)}>
              👤 Mi Perfil
            </Link>
          </li>

          <li><hr className="dropdown-divider" /></li>

          {/* Opción Cerrar Sesión */}
          <li>
            <button
              className="dropdown-item text-danger"
              onClick={handleLogout}
            >
              🚪 Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}