import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    // mt-auto: Empuja el footer al fondo si hay poco contenido
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-secondary mt-auto">
      <div className="container">
        <div className="row">
          
          {/* Columna 1: Marca y Slogan */}
          <div className="col-md-4 mb-4">
            <h4 className="text-uppercase fw-bold" style={{ color: "var(--accent-primary)" }}>
              Level Up Gamer
            </h4>
            <p className="text-muted small">
              Elevando tu experiencia de juego al siguiente nivel con la mejor tecnología y estilo.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3 text-white">Enlaces Rápidos</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link to="/" className="text-decoration-none text-secondary footer-link">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/categoria/todos" className="text-decoration-none text-secondary footer-link">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-decoration-none text-secondary footer-link">
                  Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Redes */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3 text-white">Contacto</h5>
            <p className="text-secondary small mb-1">📧 contacto@levelup.cl</p>
            <p className="text-secondary small mb-1">📍 Santiago, Chile</p>
            
            <div className="d-flex gap-3 mt-3">
              {/* Iconos simulados con Emojis para no instalar librerías extra */}
              <span className="fs-4" style={{cursor: "pointer"}} title="Instagram">📸</span>
              <span className="fs-4" style={{cursor: "pointer"}} title="Twitter">🐦</span>
              <span className="fs-4" style={{cursor: "pointer"}} title="Facebook">📘</span>
              <span className="fs-4" style={{cursor: "pointer"}} title="Discord">👾</span>
            </div>
          </div>
        </div>

        <hr className="border-secondary" />

        <div className="text-center text-muted small">
          &copy; {new Date().getFullYear()} Level Up Gamer. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}