import { Link, NavLink } from "react-router-dom";
import CartWidget from "../cart/CartWidget";
export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <NavLink to="/" className="navbar-brand">Level Up Gamer</NavLink>
                <div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin" className="nav-link">Admin Panel</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className="nav-link">Acerca de</NavLink>
                        </li>
                        <li>
                            <p>1</p>
                        </li>
                    </ul>
                </div>
            </div>
            <Link to="/cart">
            <CartWidget></CartWidget>
            </Link>
        </nav>
    );
}