import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/api";

export default function BlogPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blog/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error al cargar noticia:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center mt-5 text-white">Cargando noticia...</div>;
  if (!post) return <div className="text-center mt-5 text-white">Noticia no encontrada 😕</div>;

  return (
    <div className="container my-5 fade-in">
      <Link to="/blog" className="btn btn-outline-secondary mb-4">← Volver a Noticias</Link>
      
      <div className="card bg-dark text-white border border-secondary shadow-lg overflow-hidden">
        <img 
            src={post.imagenUrl} 
            alt={post.titulo} 
            className="w-100" 
            style={{ maxHeight: "400px", objectFit: "cover" }} 
        />
        <div className="card-body p-5">
            <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
                <span>📅 {new Date(post.fechaPublicacion).toLocaleDateString()}</span>
                <span>✍️ {post.autor || "Admin"}</span>
            </div>
            
            <h1 className="fw-bold mb-4 text-success">{post.titulo}</h1>
            
            {/* Renderizado del contenido con saltos de línea */}
            <div className="lead" style={{ whiteSpace: "pre-line" }}>
                {post.contenido}
            </div>
        </div>
      </div>
    </div>
  );
}