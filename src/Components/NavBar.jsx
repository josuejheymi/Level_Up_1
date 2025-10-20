import { NavLink } from "react-router-dom";
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
                        <li>
                            <p>CHIIII</p>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className="nav-link">Acerca de</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}