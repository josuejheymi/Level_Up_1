import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/api";
import { useCart } from "../Components/cart/CartContext";
import { useUser } from "../Components/user/UserContext";

export default function ProductDetail() {
  const { id } = useParams(); // Obtener ID de la URL
  const { addToCart } = useCart();
  const { user } = useUser();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ calificacion: 5, comentario: "" });
  const [loading, setLoading] = useState(true);
  // AGREGAR ESTA FUNCIÓN DENTRO DEL COMPONENTE ProductDetail
const getAutoPlayUrl = (url) => {
    if (!url) return null;
    
    // 1. Determina si usar '?' (primer parámetro) o '&' (parámetro adicional)
    const separator = url.includes('?') ? '&' : '?';
    
    // 2. Agrega autoplay=1 y mute=1 (necesario para que Chrome/Safari lo permitan)
    return `${url}${separator}autoplay=1&mute=1`;
};

  // Cargar Producto y Reseñas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get(`/productos/${id}`); 
        setProduct(prodRes.data);

        const revRes = await api.get(`/resenas/producto/${id}`);
        setReviews(revRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Enviar Reseña
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para opinar.");

    try {
      const payload = {
        usuarioId: user.id,
        productoId: parseInt(id),
        calificacion: parseInt(newReview.calificacion),
        comentario: newReview.comentario
      };
      
      const res = await api.post("/resenas", payload);

      // Usar los datos de la respuesta para el nombre del autor
      setReviews([...reviews, {...res.data, usuario: { nombre: user.nombre } } ]);
      setNewReview({ calificacion: 5, comentario: "" }); 
      alert("¡Gracias por tu opinión!");
    } catch (error) {
      console.error(error);
      alert("Error al enviar reseña: " + (error.response?.data || "Intenta de nuevo"));
    }
  };

  if (loading) return <div className="container mt-5 text-center text-white">Cargando...</div>;
  if (!product) return <div className="container mt-5 text-white">Producto no encontrado</div>;

  return (
    <div className="container my-5 fade-in">
      
      {/* SECCIÓN SUPERIOR: DETALLE PRODUCTO */}
      <div className="row">
        {/* Imagen Grande */}
        <div className="col-md-6 mb-4">
          <div className="card bg-dark border-secondary p-3 h-100">
              <img 
                src={product.imagenUrl} 
                alt={product.nombre} 
                className="img-fluid rounded border-secondary"
                style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
              />
          </div>
        </div>

        {/* Info y Compra */}
        <div className="col-md-6 text-white">
          <h1 className="fw-bold text-white">{product.nombre}</h1>
          <p className="text-secondary text-uppercase">{product.categoria}</p>
          <h2 className="text-primary fw-bold my-3">${product.precio?.toLocaleString()}</h2>
          
          <p className="lead text-white">{product.descripcion}</p>
          
          {/* Stock y Botón */}
          <div className="mt-4">
            {product.stock > 0 ? (
                <>
                    <p className="text-success fw-bold">✅ Stock Disponible: {product.stock}</p>
                    <button 
                        className="btn btn-primary btn-lg w-100 rounded-pill shadow"
                        onClick={() => addToCart(product)}
                    >
                        Agregar al Carrito
                    </button>
                </>
            ) : (
                <button className="btn btn-secondary btn-lg w-100 rounded-pill" disabled>
                    Agotado
                </button>
            )}
          </div>
        </div>
      </div>

      <hr className="my-5 border-secondary" />

      {/* === SECCIÓN INFERIOR: VIDEO Y RESEÑAS === */}
      <div className="row">
        
        {/* Columna de Video (Si existe el URL) */}
        {product.videoUrl && (
    <div className="col-lg-6 mb-4">
        <h4 className="text-white fw-bold mb-3">Video Presentación</h4>
        <div className="ratio ratio-16x9 shadow-lg rounded-3 overflow-hidden border border-secondary">
            <iframe 
                width="100%" 
                height="100%" 
                // AHORA USAMOS LA FUNCIÓN QUE FUERZA EL AUTO-PLAY Y EL MUTE
                src={getAutoPlayUrl(product.videoUrl)} 
                title="Video del Producto" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
            ></iframe>
        </div>
    </div>
)}

        {/* Columna de Reseñas */}
        <div className={`col-md-6 ${product.videoUrl ? 'col-lg-6' : 'col-lg-12'}`}> 
          <h3 className="text-white fw-bold mb-4">Opiniones de Clientes ({reviews.length})</h3>
          
          {/* Lista de Reseñas */}
          <div className="mb-4" style={{maxHeight: '400px', overflowY: 'auto'}}>
            {reviews.length === 0 ? (
              <p className="text-secondary">No hay opiniones todavía. ¡Sé el primero!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="card mb-3 border-secondary shadow-sm bg-dark">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="fw-bold text-white mb-1">{rev.usuario?.nombre || "Anónimo"}</h6>
                      <span className="text-warning">{"★".repeat(rev.calificacion)}</span>
                    </div>
                    <p className="mb-1 text-secondary">{rev.comentario}</p>
                    <small className="text-muted">{new Date(rev.fecha).toLocaleDateString()}</small>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Formulario de Reseña */}
          <div className="card border-secondary shadow p-4 bg-dark">
            <h5 className="mb-3 text-white fw-bold">Escribe tu opinión</h5>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label text-white">Calificación</label>
                <select 
                    className="form-select bg-tertiary border-secondary text-white"
                    value={newReview.calificacion}
                    onChange={e => setNewReview({...newReview, calificacion: e.target.value})}
                >
                    <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
                    <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
                    <option value="3">⭐⭐⭐ Regular</option>
                    <option value="2">⭐⭐ Malo</option>
                    <option value="1">⭐ Pésimo</option>
                </select>
              </div>
              <div className="mb-3">
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="¿Qué te pareció el producto?"
                    value={newReview.comentario}
                    onChange={e => setNewReview({...newReview, comentario: e.target.value})}
                    required
                ></textarea>
              </div>
              <button className="btn btn-primary w-100 fw-bold">Publicar Opinión</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}