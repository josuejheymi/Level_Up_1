import React from "react";
import { Link } from "react-router-dom"; // Importamos Link para navegar
import { useBlog } from "../Components/blog/BlogContext";

export default function BlogPage() {
  const { posts, loading } = useBlog();

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container my-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-4 text-uppercase">LevelUp News 📰</h1>
        <p className="lead text-secondary">Entérate de lo último en el mundo gamer</p>
      </div>

      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm hover-lift">
              
              {/* 1. Imagen con Link al detalle */}
              <Link to={`/blog/${post.id}`}>
                  <img 
                    src={post.imagenUrl} 
                    className="card-img-top" 
                    alt={post.titulo}
                    style={{height: "220px", objectFit: "cover"}}
                  />
              </Link>

              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-primary text-dark">Noticia</span>
                    <small className="text-muted">{new Date(post.fechaPublicacion).toLocaleDateString()}</small>
                </div>

                {/* 2. Título con Link */}
                <Link to={`/blog/${post.id}`} className="text-decoration-none text-white">
                    <h4 className="card-title fw-bold mb-3 hover-scale">{post.titulo}</h4>
                </Link>

                {/* 3. Resumen de texto (máximo 3 líneas) */}
                <p className="card-text text-secondary flex-grow-1" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {post.contenido}
                </p>
                
                <Link to={`/blog/${post.id}`} className="btn btn-outline-primary mt-3 w-100 rounded-pill fw-bold">
                    Leer Nota Completa
                </Link>
              </div>

              <div className="card-footer bg-transparent border-top border-secondary py-3">
                <small className="text-muted">Escrito por: <strong className="text-primary">{post.autor || "Admin"}</strong></small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}