import React from "react";
import { Link } from "react-router-dom";

/**
 * Componente Footer (Pie de Página)
 * Responsabilidad: Mostrar información legal, enlaces rápidos y contacto.
 * * Concepto Clave: Layout con Sistema de Grillas (Grid System).
 * Bootstrap divide la pantalla en 12 columnas virtuales.
 * - col-md-3: En pantallas medianas (PC), ocupa 3/12 del ancho (25%).
 * - col-6: En pantallas pequeñas (Móvil), ocupa 6/12 del ancho (50%).
 */
export default function Footer() {
  
  // URL del mapa embebido (Google Maps iframe)
  // Usamos una dirección fija de ejemplo (Recoleta, Santiago) para la demo.
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.156829749525!2d-70.6419973848007!3d-33.41904598078291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a6eb60393b%3A0x702e881270b2060!2sAv.%20Recoleta%2C%20Recoleta%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1689204040000!5m2!1ses!2scl";

  return (
    // mt-auto: Empuja el footer al final si el contenido de arriba es corto.
    <footer className="bg-dark text-white pt-5 pb-3 border-top border-secondary mt-auto">
      <div className="container">
        
        {/* FILA PRINCIPAL: Dividida en 4 columnas */}
        <div className="row">
          
          {/* COLUMNA 1: Marca y Slogan */}
          <div className="col-md-3 col-6 mb-4">
            <h5 className="text-uppercase fw-bold" style={{ color: "var(--accent-primary)" }}>
              Level Up Gamer
            </h5>
            <p className="text-secondary small">
              Elevando tu experiencia de juego al siguiente nivel. Tecnología de punta y envíos a todo Chile.
            </p>
          </div>

          {/* COLUMNA 2: Navegación */}
          <div className="col-md-3 col-6 mb-4">
            <h5 className="fw-bold mb-3 text-white">Explorar</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link to="/" className="text-decoration-none text-secondary footer-link hover-text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/categoria/todos" className="text-decoration-none text-secondary footer-link hover-text-white">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/ofertas" className="text-decoration-none text-warning footer-link hover-text-white">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-decoration-none text-secondary footer-link hover-text-white">
                  Nosotros & Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Datos de Contacto */}
          <div className="col-md-3 col-6 mb-4">
            <h5 className="fw-bold mb-3 text-white">Contacto</h5>
            <div className="text-secondary small d-flex flex-column gap-2">
                <div>
                    <span className="fw-bold text-white d-block">Email:</span>
                    contacto@levelup.cl
                </div>
                <div>
                    <span className="fw-bold text-white d-block">Ubicación:</span>
                    Santiago, Chile
                </div>
            </div>
            
            {/* Redes Sociales (Iconos decorativos) */}
            <div className="d-flex gap-3 mt-3">
              <span className="fs-5 social-icon" style={{cursor: "pointer", transition: "transform 0.2s"}} title="Instagram">📸</span>
              <span className="fs-5 social-icon" style={{cursor: "pointer", transition: "transform 0.2s"}} title="Twitter">🐦</span>
              <span className="fs-5 social-icon" style={{cursor: "pointer", transition: "transform 0.2s"}} title="Discord">👾</span>
            </div>
          </div>
          
          {/* COLUMNA 4: Mapa */}
          <div className="col-md-3 col-12 mb-4">
            <h5 className="fw-bold mb-3 text-white">Encuéntranos</h5>
            <div className="rounded overflow-hidden border border-secondary shadow-sm" style={{ height: '150px' }}>
                <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: '0', filter: 'invert(90%) hue-rotate(180deg)' }} // Filtro Dark Mode para el mapa
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Tienda"
                ></iframe>
            </div>
          </div>
        </div>
        
        <hr className="border-secondary my-4" />

        {/* COPYRIGHT */}
        <div className="text-center text-muted small">
          © {new Date().getFullYear()} Level Up Gamer. Proyecto Académico Duoc UC.
        </div>
      </div>
    </footer>
  );
}