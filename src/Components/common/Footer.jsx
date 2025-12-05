import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  // Nota: El mapa apunta a Recoleta, Santiago, como ejemplo de ubicación.
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5601.471433565763!2d-70.61747016559674!3d-33.40616802002714!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf046fa6278b%3A0xf39c581b2251797b!2sMirador%20Los%20Gemelos!5e0!3m2!1sen!2sus!4v1764960273704!5m2!1sen!2sus";

  return (
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-secondary mt-auto">
      <div className="container">
        <div className="row">
          
          {/* Columna 1 (3/12): Marca */}
          <div className="col-md-3 col-6 mb-4">
            <h5 className="text-uppercase fw-bold" style={{ color: "var(--accent-primary)" }}>
              Level Up Gamer
            </h5>
            <p className="text-secondary small">
              Elevando tu experiencia de juego al siguiente nivel.
            </p>
          </div>

          {/* Columna 2 (3/12): Enlaces Rápidos (Ahora incluye Contacto) */}
          <div className="col-md-3 col-6 mb-4">
            <h5 className="fw-bold mb-3 text-white">Navegación</h5>
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
              <li>
                <Link to="/contact" className="text-decoration-none text-secondary footer-link">
                  Formulario de Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 (3/12): Contacto e Información */}
          <div className="col-md-3 col-6 mb-4">
            <h5 className="fw-bold mb-3 text-white">Info. Contacto</h5>
            <p className="text-secondary small mb-1">📧 contacto@levelup.cl</p>
            <p className="text-secondary small mb-1">📍 Santiago, Chile</p>
            
            <div className="d-flex gap-3 mt-3">
              <span className="fs-5" style={{cursor: "pointer"}} title="Instagram">📸</span>
              <span className="fs-5" style={{cursor: "pointer"}} title="Twitter">🐦</span>
              <span className="fs-5" style={{cursor: "pointer"}} title="Discord">👾</span>
            </div>
          </div>
          
          {/* Columna 4 (3/12): Mapa de Ubicación */}
          <div className="col-md-3 col-12 mb-4">
            <h5 className="fw-bold mb-3 text-white">Dónde Encontrarnos</h5>
            {/* Contenedor Responsivo para el Mapa */}
            <div style={{ height: '150px', width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: '0', filter: 'grayscale(60%) invert(90%)' }}
                    loading="lazy"
                    title="Ubicación de la tienda"
                ></iframe>
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