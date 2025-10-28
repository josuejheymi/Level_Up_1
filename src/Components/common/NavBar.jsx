import { Link, NavLink } from "react-router-dom";
import CartWidget from "../cart/CartWidget";
import { useUser } from "../user/UserContext";
import UserDropdown from "../user/UserDropdown";

export default function Navbar() {
  const { currentUser } = useUser();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          Level Up Gamer
        </NavLink>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/admin" className="nav-link">
                Admin Panel
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                Acerca de
              </NavLink>
            </li>
          </ul>

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
    