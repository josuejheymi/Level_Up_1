import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

export default function UserDropdown() {
  const { currentUser, logoutUser } = useUser();
  const [open, setOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="dropdown" onMouseLeave={() => setOpen(false)}>
      <button
        className="btn btn-secondary dropdown-toggle"
        onClick={() => setOpen(!open)}
      >
        {currentUser.name}
      </button>
      {open && (
        <ul className="dropdown-menu show">
          <li>
            <Link className="dropdown-item" to="/profile">
              Mi Perfil
            </Link>
          </li>
          <li>
            <button className="dropdown-item" onClick={logoutUser}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
