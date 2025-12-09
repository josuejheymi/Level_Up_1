import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../config/api";
import { useCart } from "../Components/cart/CartContext";
import { useUser } from "../Components/user/UserContext";

/**
 * Componente: Detalle de Producto
 * Responsabilidad: Mostrar información detallada, video, reseñas y permitir la compra.
 * * Conceptos Clave:
 * 1. Manipulación de Strings: Transformamos URLs de YouTube para activar el Autoplay.
 * 2. Carga Paralela: Pedimos el producto y las reseñas al mismo tiempo.
 * 3. Actualización Optimista: Al comentar, agregamos la reseña a la lista visualmente sin recargar toda la página.
 */
export default function ProductDetail() {
  
  // 1. HOOKS
  const { id } = useParams(); // Capturamos el ID de la URL (ej: /producto/5)
  const { addToCart } = useCart();
  const { user } = useUser();

  // 2. ESTADOS
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario de nueva reseña
  const [newReview, setNewReview] = useState({ calificacion: 5, comentario: "" });

  /**
   * HELPER: Transformar URL de YouTube
   * Los navegadores modernos (Chrome/Edge) BLOQUEAN los videos que se reproducen solos con sonido.
   * Para que el autoplay funcione, es obligatorio agregar 'mute=1'.
   */
  const getAutoPlayUrl = (url) => {
    if (!url) return null;
    // Si la URL ya tiene parámetros (?), usamos &; si no, usamos ?.
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}autoplay=1&mute=1`;
  };

  // 3. EFECTO: Carga de Datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos las peticiones secuenciales (primero producto, luego reseñas)
        // Nota Pro: Podríamos usar Promise.all() para hacerlas paralelas y ganar velocidad.
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

  /**
   * HANDLER: Enviar Reseña
   */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Validación de Sesión
    if (!user) return alert("🔒 Debes iniciar sesión para dejar una opinión.");

    try {
      const payload = {
        usuarioId: user.id,
        productoId: parseInt(id),
        calificacion: parseInt(newReview.calificacion),
        comentario: newReview.comentario
      };
      
      const res = await api.post("/resenas", payload);

      // ACTUALIZACIÓN DEL ESTADO (Sin recargar):
      // Creamos un nuevo array copiando los anteriores (...reviews)
      // y agregando el nuevo objeto al final.
      // * Truco: Como el backend a veces devuelve solo el ID del usuario,
      // inyectamos manualmente el nombre del usuario actual para que se vea al instante.
      setReviews([...reviews, {...res.data, usuario: { nombre: user.nombre } } ]);
      
      // Limpiamos el formulario
      setNewReview({ calificacion: 5, comentario: "" }); 
      alert("✅ ¡Gracias por tu opinión!");

    } catch (error) {
      console.error(error);
      alert("❌ Error al enviar: " + (error.response?.data || "Intenta de nuevo"));
    }
  };

  // --- RENDERIZADO DE CARGA ---
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
        <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  // --- RENDERIZADO DE ERROR (Si el ID no existe) ---
  if (!product) return (
    <div className="container mt-5 text-center text-white fade-in">
        <h2>Producto no encontrado 😕</h2>
    </div>
  );

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="container my-5 fade-in">
      
      {/* === SECCIÓN SUPERIOR: IMAGEN E INFORMACIÓN === */}
      <div className="row g-5">
        
        {/* COLUMNA IZQ: IMAGEN GRANDE */}
        <div className="col-md-6">
          <div className="card bg-white border-0 p-4 shadow-lg rounded-4 overflow-hidden position-relative">
              <img 
                src={product.imagenUrl} 
                alt={product.nombre} 
                className="img-fluid hover-zoom transition-transform"
                style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
              />
              {product.stock === 0 && (
                  <div className="position-absolute top-50 start-50 translate-middle badge bg-dark fs-1 opacity-75">AGOTADO</div>
              )}
          </div>
        </div>

        {/* COLUMNA DER: DETALLES Y COMPRA */}
        <div className="col-md-6 text-white d-flex flex-column justify-content-center">
          <h1 className="fw-bold display-5 mb-2">{product.nombre}</h1>
          
          {/* Categoría (Badge) */}
          <div className="mb-3">
            <span className="badge bg-dark border border-secondary text-uppercase ls-1">
                {product.categoria?.nombre || 'General'}
            </span>
          </div>

          <h2 className="text-primary fw-bold my-3 display-4">
            ${product.precio?.toLocaleString()}
          </h2>
          
          <p className="lead text-secondary mb-4">{product.descripcion}</p>
          
          {/* BOTÓN DE ACCIÓN (Lógica de Stock) */}
          <div className="mt-2">
            {product.stock > 0 ? (
                <>
                    <div className="d-flex align-items-center gap-2 mb-3 text-success fw-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Stock Disponible: {product.stock} unidades
                    </div>
                    <button 
                        className="btn btn-primary btn-lg w-100 rounded-pill shadow-lg hover-scale fw-bold d-flex justify-content-center align-items-center gap-2"
                        onClick={() => addToCart(product)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                        Agregar al Carrito
                    </button>
                </>
            ) : (
                <button className="btn btn-secondary btn-lg w-100 rounded-pill disabled cursor-not-allowed">
                    🚫 Producto Agotado
                </button>
            )}
          </div>
        </div>
      </div>

      <hr className="my-5 border-secondary" />

      {/* === SECCIÓN INFERIOR: VIDEO Y COMENTARIOS === */}
      <div className="row g-5">
        
        {/* COLUMNA VIDEO (Renderizado Condicional) */}
        {/* Si hay video, ocupa la mitad. Si no, los comentarios ocupan todo el ancho. */}
        {product.videoUrl && (
            <div className="col-lg-6 mb-4">
                <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    Review en Video
                </h4>
                <div className="ratio ratio-16x9 shadow-lg rounded-4 overflow-hidden border border-secondary">
                    <iframe 
                        src={getAutoPlayUrl(product.videoUrl)} 
                        title="Video del Producto" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        style={{ border: 0 }}
                    ></iframe>
                </div>
            </div>
        )}

        {/* COLUMNA RESEÑAS */}
        <div className={`col-md-12 ${product.videoUrl ? 'col-lg-6' : 'col-lg-8 mx-auto'}`}> 
          <h3 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Opiniones de la Comunidad ({reviews.length})
          </h3>
          
          {/* LISTA DE COMENTARIOS (Scrollable) */}
          <div className="mb-4 pe-2 custom-scrollbar" style={{maxHeight: '400px', overflowY: 'auto'}}>
            {reviews.length === 0 ? (
              <div className="text-center py-4 border border-secondary border-dashed rounded text-muted">
                  Aún no hay opiniones. ¡Sé el primero en comentar! :V
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="card mb-3 border-secondary shadow-sm bg-dark">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
                          <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style={{width: 24, height: 24, fontSize: 12}}>
                              {rev.usuario?.nombre?.charAt(0) || "?"}
                          </div>
                          {rev.usuario?.nombre || "Anónimo"}
                      </h6>
                      <span className="text-warning">{"★".repeat(rev.calificacion)}<span className="text-secondary opacity-25">{"★".repeat(5-rev.calificacion)}</span></span>
                    </div>
                    <p className="mb-1 text-light opacity-75 small">{rev.comentario}</p>
                    <small className="text-muted" style={{fontSize: "0.7rem"}}>{new Date(rev.fecha).toLocaleDateString()}</small>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* FORMULARIO DE NUEVA RESEÑA */}
          <div className="card border-secondary shadow p-4 bg-black">
            <h5 className="mb-3 text-white fw-bold small text-uppercase">Deja tu valoración</h5>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">CALIFICACIÓN</label>
                <select 
                    className="form-select bg-dark border-secondary text-white"
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
                <label className="form-label text-secondary small fw-bold">TU COMENTARIO</label>
                <textarea 
                    className="form-control bg-dark border-secondary text-white" 
                    rows="3" 
                    placeholder="Cuéntanos tu experiencia con el producto..."
                    value={newReview.comentario}
                    onChange={e => setNewReview({...newReview, comentario: e.target.value})}
                    required
                ></textarea>
              </div>
              <button className="btn btn-outline-light w-100 fw-bold hover-bg-white hover-text-black transition-colors">
                  Publicar Opinión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}