import { useMemo, useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import ProductList from "../Components/common/ProductList";
import CategoryExpanding from "../Components/common/CategoryExpanding"; 
import { useCart } from "../Components/cart/CartContext";
import { useProducts } from "../Components/products/ProductContext";
import api from "../config/api"; 

/**
 * Componente: HOME (Página Principal)
 * Responsabilidad: Landing page que muestra Hero, Productos Destacados y Catálogo.
 * * Conceptos Clave:
 * 1. Algoritmos Aleatorios: Usamos sort() con Math.random() para mezclar productos.
 * 2. Rendimiento (useMemo): Evitamos re-calcular el orden aleatorio en cada render.
 * 3. Diseño Visual: Uso de gradientes sobre imágenes (Overlay) para mejorar lectura de texto.
 */
export default function Home() {
  
  // 1. HOOKS Y CONTEXTO
  const { products, allProducts, loading } = useProducts(); // Productos filtrados y totales
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]); // Estado local para categorías del Hero

  // 2. EFECTO: Cargar Categorías
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categorias');
            setCategories(res.data);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };
    fetchCategories();
  }, []);

  /**
   * LÓGICA: Productos Destacados (Random Shuffle)
   * Usamos useMemo para que la lista aleatoria se calcule SOLO cuando cambia 'allProducts'.
   * Si no usamos useMemo, cada vez que el usuario escriba en el buscador (que actualiza el componente),
   * los productos destacados cambiarían de posición, lo cual marea al usuario.
   */
  const featuredProducts = useMemo(() => {
    if (!allProducts.length) return [];
    // [...allProducts] crea una copia para no mutar el array original
    return [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [allProducts]);

  // --- RENDERIZADO: CARGA ---
  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
            <div className="spinner-border text-success" role="status" style={{width: "3rem", height: "3rem"}}>
                <span className="visually-hidden">Cargando tienda...</span>
            </div>
        </div>
    );
  }

  // --- RENDERIZADO: PRINCIPAL ---
  return (
    <div className="home-page fade-in">
        
        {/* =================================================================
            HERO SECTION (Portada)
           ================================================================= */}
        <section 
            className="hero text-white py-5 mb-5 position-relative" 
            style={{ 
                // Gradiente oscuro sobre la imagen para que el texto blanco resalte
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9)), url('/hero-green.png.avif')`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
                minHeight: "600px", 
                display: "flex",
                alignItems: "center"
            }}
        >
            <div className="container text-center position-relative" style={{ zIndex: 2 }}>
                {/* Título con sombra neón */}
                <h1 className="display-1 fw-bold mb-3 text-uppercase tracking-wide" style={{ textShadow: '0 0 25px rgba(0, 255, 0, 0.5)' }}>
                    Level Up Your Game
                </h1>
                <p className="lead mb-5 fs-3 text-light opacity-75" style={{ textShadow: '2px 2px 4px rgba(0,0,0,1)' }}>
                    El hardware definitivo para dominar el ranking.
                </p>
                
                {/* Botones de Acción (CTA) */}
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link to="/categoria/todos" className="btn btn-primary btn-lg px-5 rounded-pill shadow fw-bold transition-transform hover-scale d-flex align-items-center gap-2">
                        {/* Icono Cohete */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>
                        Explorar Catálogo
                    </Link>
                    <Link to="/about" className="btn btn-outline-light btn-lg px-5 rounded-pill fw-bold backdrop-blur hover-scale d-flex align-items-center gap-2">
                        Conoce Más
                        {/* Icono Flecha */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Link>
                </div>
            </div>
        </section>

        {/* =================================================================
            PRODUCTOS DESTACADOS
           ================================================================= */}
        {featuredProducts.length > 0 && (
            <section className="featured-products container mb-5">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                    {/* Icono Fuego */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3-1.4 1.8-2.575 3-3.2.5.8 1.1 1.7 1.1 2.5a2.5 2.5 0 0 1-1.1 2z"></path></svg>
                    <h2 className="text-center fw-bold m-0 text-uppercase text-white">Destacados del Mes</h2>
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="col">
                            <div className="card h-100 shadow border-0 position-relative group hover-lift bg-dark text-white border-secondary">
                                
                                {/* Imagen con Efecto Hover */}
                                <div className="position-relative overflow-hidden bg-white rounded-top">
                                    <Link to={`/producto/${product.id}`}>
                                        <img 
                                            src={product.imagenUrl} 
                                            alt={product.nombre}
                                            className="card-img-top p-4 transition-transform hover-zoom"
                                            style={{ 
                                                height: "250px", 
                                                objectFit: "contain", 
                                                opacity: product.stock === 0 ? 0.5 : 1 
                                            }}
                                        />
                                    </Link>
                                    
                                    {/* Badges Flotantes */}
                                    <div className="position-absolute top-0 end-0 p-2">
                                        {product.stock === 0 ? (
                                            <span className="badge bg-secondary shadow-sm text-uppercase">AGOTADO</span>
                                        ) : (
                                            <span className="badge bg-danger shadow-sm animate-pulse d-flex align-items-center gap-1">
                                                HOT
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16z"/></svg>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info Producto */}
                                <div className="card-body text-center d-flex flex-column">
                                    <Link to={`/producto/${product.id}`} className="text-decoration-none text-white">
                                        <h5 className="card-title fw-bold text-truncate hover-text-primary mb-1">{product.nombre}</h5>
                                    </Link>
                                    
                                    <p className="product-category text-muted small text-uppercase mb-2">
                                        {product.categoria?.nombre || 'General'}
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <p className="fw-bold fs-4 text-success mb-3">${product.precio?.toLocaleString()}</p>
                                        
                                        <button 
                                            className={`btn w-100 rounded-pill fw-bold d-flex justify-content-center align-items-center gap-2 ${product.stock === 0 ? 'btn-secondary' : 'btn-outline-primary'}`}
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                        >
                                            {product.stock === 0 ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                                    Sin Stock
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                                    Agregar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* =================================================================
            CATEGORÍAS EXPANDIBLES
           ================================================================= */}
        <CategoryExpanding categories={categories} />

        {/* =================================================================
            CATÁLOGO COMPLETO
           ================================================================= */}
        <section className="all-products-section container mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-2">
                <div className="d-flex align-items-center gap-2">
                    {/* Icono Grid */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <h3 className="fw-bold m-0 text-uppercase text-white">Catálogo Completo</h3>
                </div>
                <span className="badge bg-dark border border-secondary text-light">{products.length} items</span>
            </div>
            
            {/* Listado o Estado Vacío */}
            {products.length > 0 ? (
                <ProductList products={products} />
            ) : (
                <div className="text-center py-5 bg-dark rounded border border-secondary border-opacity-50">
                    <div className="mb-3">
                        {/* Icono Lupa Vacía */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" stroke="var(--bs-gray-600)" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><path d="M8 11h6"></path></svg>
                    </div>
                    <h3 className="text-white">No se encontraron productos</h3>
                    <p className="text-secondary">Intenta cambiar los términos de búsqueda o filtros.</p>
                    <button onClick={() => window.location.reload()} className="btn btn-outline-light mt-2 rounded-pill px-4 hover-scale">
                        Limpiar Filtros
                    </button>
                </div>
            )}
        </section>
    </div>
  );
}