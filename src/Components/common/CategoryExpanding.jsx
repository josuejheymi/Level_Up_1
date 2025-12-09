import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Componente: CategoryExpanding
 * Muestra las categorías en un formato de "Galería Expandible" (Hero Section).
 * * Conceptos clave:
 * 1. Eventos de Mouse (Hover) para activar animaciones.
 * 2. Estilos Dinámicos (Inline Styles) para alterar el CSS basado en el estado.
 * 3. Renderizado Responsivo (Mostrar una vista en PC y otra en Móvil).
 */
export default function CategoryExpanding({ categories }) {
  // -----------------------------------------------------------------------
  // 1. ESTADO (HOOKS)
  // -----------------------------------------------------------------------
  
  // Guardamos el ID de la categoría sobre la que el mouse está encima.
  // null = El mouse no está sobre ninguna tarjeta.
  const [activeId, setActiveId] = useState(null);

  // -----------------------------------------------------------------------
  // 2. DATOS ESTÁTICOS (CONSTANTES)
  // -----------------------------------------------------------------------
  
  // Diccionario de Iconos: "Mapa" para asignar un emoji si la categoría no tiene foto.
  const categoryIcons = {
    "Consolas": "🎮", "PC Gamer": "🖥️", "Accesorios": "🎧",
    "Sillas": "💺", "Juegos": "🕹️", "Ropa": "👕"
  };

  // -----------------------------------------------------------------------
  // 3. VALIDACIÓN (GUARD CLAUSE)
  // -----------------------------------------------------------------------
  
  // Si la lista de categorías está vacía o es nula, no dibujamos nada.
  // Esto evita errores de "undefined" al intentar hacer .map()
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-5 mb-5 fade-in">
      <div className="container">
        
        {/* Título de la Sección */}
        <h2 className="text-center fw-bold mb-5 text-white text-uppercase" style={{ letterSpacing: '2px' }}>
          Explora tu Mundo
        </h2>

        {/* =================================================================================
            VISTA DE ESCRITORIO (Desktop & Tablet)
            Clases Bootstrap: 'd-none d-md-flex' -> Oculto en móvil, Flexible en mediano+
           ================================================================================= */}
        <div className="d-none d-md-flex gap-2" style={{ height: '400px' }}>
          
          {categories.map((cat) => {
            // Variable booleana: ¿Es esta la tarjeta activa actualmente?
            const isActive = activeId === cat.id;
            
            return (
              <Link 
                key={cat.id} // Clave única obligatoria para listas en React
                to={`/categoria/${cat.nombre}`}
                className="text-decoration-none position-relative overflow-hidden rounded-4 shadow-lg"
                
                // --- MOUSE EVENTS ---
                // Cuando el mouse entra, guardamos el ID. Cuando sale, lo borramos (null).
                onMouseEnter={() => setActiveId(cat.id)}
                onMouseLeave={() => setActiveId(null)}
                
                // --- ESTILOS DINÁMICOS (La Magia de la Animación) ---
                style={{
                  // Flex-grow: Si está activo ocupa 5 partes del espacio, si no, solo 1.
                  flex: isActive ? 5 : 1, 
                  transition: 'flex 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Suavizado profesional
                  backgroundImage: cat.imagenUrl ? `url(${cat.imagenUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#212529', // Gris oscuro (fallback)
                  cursor: 'pointer',
                  minWidth: '60px' // Evita que las tarjetas inactivas se aplasten demasiado
                }}
              >
                {/* 1. Capa Oscura (Overlay) para mejorar lectura del texto */}
                <div 
                    className="position-absolute w-100 h-100"
                    style={{
                        // Si está activo, degradado suave abajo. Si no, oscurecemos todo.
                        background: isActive 
                            ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)' 
                            : 'rgba(0,0,0,0.6)' 
                    }}
                ></div>

                {/* 2. Contenido de Texto (Nombre y Botón) */}
                <div className="position-absolute bottom-0 start-0 p-4 w-100">
                    {/* Título: Cambia de tamaño y opacidad según el estado */}
                    <h3 
                        className={`fw-bold text-white m-0 text-uppercase ${isActive ? 'display-6' : 'h5 text-truncate'}`}
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        {cat.nombre}
                    </h3>
                    
                    {/* Botón "Explorar": Solo visible si isActive es true */}
                    <div style={{
                        maxHeight: isActive ? '100px' : '0px', // Animación de altura
                        opacity: isActive ? 1 : 0,              // Animación de transparencia
                        overflow: 'hidden',
                        transition: 'all 0.5s ease'
                    }}>
                        <span className="btn btn-primary rounded-pill mt-3 px-4 fw-bold shadow">
                            Ver Productos {categoryIcons[cat.nombre] || "⚡"}
                        </span>
                    </div>
                </div>

                {/* 3. Icono Central (Fallback): Solo si NO hay imagen de fondo */}
                {!cat.imagenUrl && (
                    <div className="position-absolute top-50 start-50 translate-middle text-white opacity-25" style={{fontSize: '4rem'}}>
                        {categoryIcons[cat.nombre] || "⚡"}
                    </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* =================================================================================
            VISTA MÓVIL (Celulares)
            Clases Bootstrap: 'd-md-none' -> Visible solo en pantallas pequeñas
            En celular, el efecto acordeón es incómodo, así que usamos una grilla simple.
           ================================================================================= */}
        <div className="d-md-none row g-3">
            {categories.map((cat) => (
                <div key={cat.id} className="col-6">
                    <Link to={`/categoria/${cat.nombre}`} className="text-decoration-none">
                        <div className="card bg-dark text-white border-0 shadow rounded-4 overflow-hidden position-relative" style={{height: '150px'}}>
                            
                            {/* Imagen de fondo o Color sólido */}
                            {cat.imagenUrl ? (
                                <img src={cat.imagenUrl} alt={cat.nombre} className="w-100 h-100" style={{objectFit: 'cover', opacity: 0.6}} />
                            ) : (
                                <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-secondary">
                                    <span style={{fontSize: '3rem'}}>{categoryIcons[cat.nombre] || "⚡"}</span>
                                </div>
                            )}
                            
                            {/* Texto superpuesto */}
                            <div className="card-img-overlay d-flex align-items-end p-3" style={{background: 'linear-gradient(to top, black, transparent)'}}>
                                <h5 className="card-title fw-bold m-0 text-shadow">{cat.nombre}</h5>
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