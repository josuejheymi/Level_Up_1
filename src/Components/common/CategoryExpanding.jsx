import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryExpanding({ categories }) {
  // Estado para saber cuál tarjeta está activa (hover)
  const [activeId, setActiveId] = useState(null);

  // Iconos de respaldo por si no hay imagen
  const categoryIcons = {
    "Consolas": "🎮", "PC Gamer": "🖥️", "Accesorios": "🎧",
    "Sillas": "💺", "Juegos": "🕹️", "Ropa": "👕"
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-5 mb-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5 text-white text-uppercase" style={{ letterSpacing: '2px' }}>
          Explora tu Mundo
        </h2>

        {/* CONTENEDOR FLEXIBLE (SOLO DESKTOP/TABLET) */}
        <div className="d-none d-md-flex gap-2" style={{ height: '400px' }}>
          {categories.map((cat) => {
            const isActive = activeId === cat.id; // ¿Es este el panel activo?
            
            return (
              <Link 
                key={cat.id || cat.nombre}
                to={`/categoria/${cat.nombre}`}
                className="text-decoration-none position-relative overflow-hidden rounded-4 shadow-lg transition-all"
                style={{
                  // MAGIA AQUÍ: Si es activo crece a 5, si no se queda en 1
                  flex: isActive ? 5 : 1, 
                  transition: 'flex 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: 'pointer',
                  backgroundImage: cat.imagenUrl ? `url(${cat.imagenUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#212529', // Fondo por si no hay imagen
                  minWidth: '60px' // Evita que colapsen demasiado
                }}
                onMouseEnter={() => setActiveId(cat.id)}
                onMouseLeave={() => setActiveId(null)}
              >
                {/* CAPA OSCURA (Gradiente) */}
                <div 
                    className="position-absolute w-100 h-100"
                    style={{
                        background: isActive 
                            ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)' // Oscuro abajo
                            : 'rgba(0,0,0,0.6)' // Oscuro total cuando está inactivo
                    }}
                ></div>

                {/* TEXTO Y CONTENIDO */}
                <div className="position-absolute bottom-0 start-0 p-4 w-100">
                    <div style={{
                        opacity: isActive ? 1 : 0.7,
                        transform: isActive ? 'translateY(0)' : 'translateY(0)',
                        transition: 'opacity 0.3s'
                    }}>
                        {/* Si está inactivo y muy angosto, mostramos solo icono/letra */}
                        <h3 className={`fw-bold text-white m-0 text-uppercase ${isActive ? 'display-6' : 'h5 text-truncate'}`}>
                            {cat.nombre}
                        </h3>
                        
                        {/* Botón "Ver más" que solo aparece al expandir */}
                        <div style={{
                            maxHeight: isActive ? '100px' : '0px',
                            opacity: isActive ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'all 0.5s ease'
                        }}>
                            <span className="btn btn-primary rounded-pill mt-3 px-4 fw-bold shadow">
                                Explorar {categoryIcons[cat.nombre] || "⚡"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ICONO CENTRAL (Visible solo si no hay imagen de fondo) */}
                {!cat.imagenUrl && (
                    <div className="position-absolute top-50 start-50 translate-middle text-white opacity-25" style={{fontSize: '4rem'}}>
                        {categoryIcons[cat.nombre] || "⚡"}
                    </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* VERSIÓN MÓVIL (CARRUSEL SIMPLE VERTICAL/HORIZONTAL) */}
        {/* En celular, los paneles expandibles no funcionan bien por falta de espacio, usamos grid bonita */}
        <div className="d-md-none row g-3">
            {categories.map((cat) => (
                <div key={cat.id} className="col-6">
                    <Link to={`/categoria/${cat.nombre}`} className="text-decoration-none">
                        <div className="card bg-dark text-white border-0 shadow rounded-4 overflow-hidden position-relative" style={{height: '150px'}}>
                            {cat.imagenUrl ? (
                                <img src={cat.imagenUrl} alt={cat.nombre} className="w-100 h-100" style={{objectFit: 'cover', opacity: 0.6}} />
                            ) : (
                                <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-secondary">
                                    <span style={{fontSize: '3rem'}}>{categoryIcons[cat.nombre] || "⚡"}</span>
                                </div>
                            )}
                            <div className="card-img-overlay d-flex align-items-end p-3" style={{background: 'linear-gradient(to top, black, transparent)'}}>
                                <h5 className="card-title fw-bold m-0">{cat.nombre}</h5>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}