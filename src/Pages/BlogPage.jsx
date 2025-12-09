import React from "react";
import { Link } from "react-router-dom"; // Importamos Link para navegación interna (SPA)
import { useBlog } from "../Components/blog/BlogContext";

/**
 * Componente: BlogPage (Noticias)
 * Responsabilidad: Mostrar el listado de artículos disponibles.
 * * Conceptos Clave:
 * 1. Renderizado de Listas: Usamos .map() para transformar datos en HTML.
 * 2. Renderizado Condicional: Mostramos un "Cargando..." mientras llegan los datos.
 * 3. Trucos CSS: Usamos 'WebkitLineClamp' para recortar textos largos automáticamente.
 */
export default function BlogPage() {
  
  // 1. CONSUMO DEL CONTEXTO
  // Obtenemos los posts y el estado de carga desde nuestra "Nube" (BlogContext).
  const { posts, loading } = useBlog();

  // 2. ESTADO DE CARGA (Loading State)
  // Si los datos no han llegado, mostramos un spinner para mejorar la UX.
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando noticias...</span>
        </div>
    </div>
  );

  // 3. RENDERIZADO PRINCIPAL
  return (
    <div className="container my-5 fade-in">
      
      {/* CABECERA DE SECCIÓN */}
      <div className="text-center mb-5">
        <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
            {/* Icono Minimalista: Noticias */}
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <h1 className="fw-bold display-4 text-uppercase m-0">LevelUp News</h1>
        </div>
        <p className="lead text-secondary">Entérate de lo último en el mundo gamer</p>
      </div>

      {/* GRILLA DE TARJETAS */}
      <div className="row g-4">
        {/* Iteramos sobre el array de 'posts' */}
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm hover-lift bg-dark text-white border-secondary">
              
              {/* A. IMAGEN (Linkeada) */}
              <Link to={`/blog/${post.id}`} className="overflow-hidden rounded-top">
                  <img 
                    src={post.imagenUrl} 
                    className="card-img-top transition-transform hover-zoom" 
                    alt={post.titulo}
                    style={{height: "220px", objectFit: "cover"}}
                  />
              </Link>

              <div className="card-body d-flex flex-column p-4">
                
                {/* B. METADATA (Fecha) */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary text-black fw-bold">Noticia</span>
                    <small className="text-muted d-flex align-items-center gap-1">
                        {/* Icono Calendario */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        {new Date(post.fechaPublicacion).toLocaleDateString()}
                    </small>
                </div>

                {/* C. TÍTULO */}
                <Link to={`/blog/${post.id}`} className="text-decoration-none text-white">
                    <h4 className="card-title fw-bold mb-3 hover-text-primary transition-colors">
                        {post.titulo}
                    </h4>
                </Link>

                {/* D. RESUMEN (Truncamiento de texto) */}
                {/* Usamos estilos webkit para mostrar solo 3 líneas y poner "..." al final */}
                <p className="card-text text-secondary flex-grow-1" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {post.contenido}
                </p>
                
                {/* E. BOTÓN DE ACCIÓN */}
                <Link to={`/blog/${post.id}`} className="btn btn-outline-light mt-4 w-100 rounded-pill fw-bold d-flex justify-content-center align-items-center gap-2 group-hover-arrow">
                    Leer Nota
                    {/* Icono Flecha */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
              </div>

              {/* F. PIE DE TARJETA (Autor) */}
              <div className="card-footer bg-transparent border-top border-secondary py-3 px-4">
                <small className="text-muted d-flex align-items-center gap-2">
                    {/* Icono Usuario */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Escrito por: <strong className="text-white">{post.autor || "Admin"}</strong>
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}