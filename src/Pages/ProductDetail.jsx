import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

  // Cargar Producto y Reseñas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get(`/productos/${id}`); // Necesitamos este endpoint en Java
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

      setReviews([...reviews, res.data]); // Agregar visualmente
      setNewReview({ calificacion: 5, comentario: "" }); // Limpiar
      alert("¡Gracias por tu opinión!");
    } catch (error) {
      console.error(error);
      alert("Error al enviar reseña: " + (error.response?.data || "Intenta de nuevo"));
    }
  };

  if (loading) return <div className="container mt-5 text-center">Cargando...</div>;
  if (!product) return <div className="container mt-5">Producto no encontrado</div>;

  return (
    <div className="container my-5 fade-in">
      {/* SECCIÓN SUPERIOR: DETALLE PRODUCTO */}
      <div className="row">
        {/* Imagen Grande */}
        <div className="col-md-6 mb-4">
          <img 
            src={product.imagenUrl} 
            alt={product.nombre} 
            className="img-fluid rounded shadow-sm border"
            style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
          />
        </div>

        {/* Info y Compra */}
        <div className="col-md-6">
          <h1 className="fw-bold">{product.nombre}</h1>
          <p className="text-muted text-uppercase">{product.categoria}</p>
          <h2 className="text-primary fw-bold my-3">${product.precio?.toLocaleString()}</h2>
          
          <p className="lead">{product.descripcion}</p>
          
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

      <hr className="my-5" />

      {/* SECCIÓN INFERIOR: RESEÑAS */}
      <div className="row">
        <div className="col-md-8">
          <h3 className="mb-4">Opiniones de Clientes ({reviews.length})</h3>
          
          {/* Lista de Reseñas */}
          {reviews.length === 0 ? (
            <p className="text-muted">No hay opiniones todavía. ¡Sé el primero!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="card mb-3 border-0 shadow-sm bg-light">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="fw-bold">{rev.usuario?.nombre || "Anónimo"}</h6>
                    <span className="text-warning">{"★".repeat(rev.calificacion)}</span>
                  </div>
                  <p className="mb-1">{rev.comentario}</p>
                  <small className="text-muted">{new Date(rev.fecha).toLocaleDateString()}</small>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulario de Reseña */}
        <div className="col-md-4">
          <div className="card border-0 shadow p-4">
            <h5 className="mb-3">Escribe tu opinión</h5>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label">Calificación</label>
                <select 
                    className="form-select"
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
              <button className="btn btn-dark w-100">Publicar Opinión</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}