import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/api";

/**
 * Componente: Detalle de Blog
 * Responsabilidad: Mostrar el contenido completo de una noticia específica.
 * * Conceptos Clave:
 * 1. Rutas Dinámicas: Usamos 'useParams' para capturar el ID de la URL (ej: /blog/5).
 * 2. Fetching por ID: Pedimos al servidor solo los datos de ESA noticia.
 * 3. Formato de Texto: Usamos CSS para respetar los párrafos que escribió el usuario.
 */
export default function BlogPostDetail() {
  
  // 1. HOOK: useParams
  // Extrae los parámetros definidos en la ruta (en App.js definimos "/blog/:id").
  const { id } = useParams();
  
  // 2. ESTADOS LOCALES
  const [post, setPost] = useState(null); // Almacena el objeto noticia
  const [loading, setLoading] = useState(true); // Controla el spinner

  // 3. EFECTO: Cargar Noticia
  // Se ejecuta cada vez que el ID cambia (por si navegamos de una noticia a otra).
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

  // --- RENDERIZADO CONDICIONAL: CARGA ---
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 text-primary">
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
        </div>
    </div>
  );

  // --- RENDERIZADO CONDICIONAL: NO ENCONTRADO ---
  if (!post) return (
    <div className="container text-center mt-5 text-white fade-in">
        <h1>😕</h1>
        <h3 className="mt-3">Noticia no encontrada</h3>
        <Link to="/blog" className="btn btn-outline-light mt-3">Volver al Blog</Link>
    </div>
  );

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="container my-5 fade-in">
      
      {/* Botón de Retorno */}
      <Link to="/blog" className="btn btn-outline-secondary mb-4 rounded-pill px-4 hover-scale">
        ← Volver a Noticias
      </Link>
      
      <div className="card bg-dark text-white border border-secondary shadow-lg overflow-hidden">
        
        {/* IMAGEN DE PORTADA */}
        <img 
            src={post.imagenUrl} 
            alt={post.titulo} 
            className="w-100" 
            style={{ maxHeight: "500px", objectFit: "cover" }} 
        />
        
        <div className="card-body p-4 p-md-5">
            
            {/* METADATA (Fecha y Autor) */}
            <div className="d-flex justify-content-between align-items-center mb-4 text-muted small border-bottom border-secondary pb-3">
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary text-black">Noticia</span>
                    <span>📅 {new Date(post.fechaPublicacion).toLocaleDateString()}</span>
                </div>
                <span className="fst-italic">Escrito por: <strong className="text-white">{post.autor || "Admin"}</strong></span>
            </div>
            
            {/* TÍTULO PRINCIPAL */}
            <h1 className="fw-bold mb-4 display-5 text-white">{post.titulo}</h1>
            
            {/* CONTENIDO DEL ARTÍCULO */}
            {/* style={{ whiteSpace: "pre-line" }}: 
                Crucial para que los saltos de línea (\n) del textarea se vean como párrafos reales en HTML. 
            */}
            <div className="lead text-secondary" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
                {post.contenido}
            </div>

        </div>
      </div>
    </div>
  );
}