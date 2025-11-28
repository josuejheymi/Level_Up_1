import React from "react";
import { useBlog } from "../Components/blog/BlogContext";

export default function BlogPage() {
  const { posts, loading } = useBlog();

  if (loading) return <div className="text-center mt-5">Cargando noticias...</div>;

  return (
    <div className="container my-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-4">LevelUp News 📰</h1>
        <p className="lead text-muted">Entérate de lo último en el mundo gamer</p>
      </div>

      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.id} className="col-md-4">
            <div className="card h-100 border-0 shadow-sm hover-lift">
              <img 
                src={post.imagenUrl} 
                className="card-img-top" 
                alt={post.titulo}
                style={{height: "200px", objectFit: "cover"}}
              />
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary">Noticia</span>
                    <small className="text-muted">{new Date(post.fechaPublicacion).toLocaleDateString()}</small>
                </div>
                <h4 className="card-title fw-bold">{post.titulo}</h4>
                <p className="card-text text-secondary">{post.contenido}</p>
              </div>
              <div className="card-footer bg-white border-0 pb-3">
                <small className="text-muted">Por: <strong>{post.autor}</strong></small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}