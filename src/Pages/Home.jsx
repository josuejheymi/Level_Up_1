import { useMemo, useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import ProductList from "../Components/common/ProductList";
import CategoryExpanding from "../Components/common/CategoryExpanding"; 
import { useCart } from "../Components/cart/CartContext";
import { useProducts } from "../Components/products/ProductContext";
import api from "../config/api"; 

export default function Home() {
    const { products, allProducts, loading } = useProducts();
    const { addToCart } = useCart();
    const [categories, setCategories] = useState([]);

    // 1. Cargar Categorías desde la Base de Datos
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

    // 2. Calcular Productos Destacados (Aleatorios)
    const featuredProducts = useMemo(() => {
        if (!allProducts.length) return [];
        return [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [allProducts]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando tienda...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page fade-in">
            
            {/* === HERO SECTION (FONDO VERDE NEBULOSA) === */}
            <section 
                className="hero text-white py-5 mb-5" 
                style={{ 
                    // 🚨 AQUÍ ESTÁ EL CAMBIO: Ruta exacta a tu archivo .avif
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/hero-green.png.avif')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minHeight: "500px", // Aumenté un poco la altura para que luzca más la imagen
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <div className="container text-center">
                    <h1 className="display-2 fw-bold mb-3 text-uppercase" style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.6)' }}>
                        Level Up Your Game
                    </h1>
                    <p className="lead mb-5 fs-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        Descubre los mejores productos gaming con tecnología de última generación
                    </p>
                    <div className="hero-buttons d-flex justify-content-center gap-3">
                        <Link to="/categoria/todos" className="btn btn-primary btn-lg px-5 rounded-pill shadow fw-bold transition-transform hover-scale">
                            Explorar Productos
                        </Link>
                        <Link to="/about" className="btn btn-outline-light btn-lg px-5 rounded-pill fw-bold backdrop-blur hover-scale">
                            Conoce Más
                        </Link>
                    </div>
                </div>
            </section>

            {/* === DESTACADOS === */}
            {featuredProducts.length > 0 && (
                <section className="featured-products container mb-5">
                    <h2 className="text-center fw-bold mb-4 text-uppercase">🔥 Productos Destacados</h2>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="col">
                                <div className="card h-100 shadow-sm border-0 position-relative group hover-lift">
                                    {/* Imagen del Producto */}
                                    <div className="position-relative overflow-hidden bg-white rounded-top">
                                        <Link to={`/producto/${product.id}`}>
                                            <img 
                                                src={product.imagenUrl} 
                                                alt={product.nombre}
                                                className="card-img-top p-4"
                                                style={{ 
                                                    height: "250px", 
                                                    objectFit: "contain", 
                                                    transition: "transform 0.3s",
                                                    opacity: product.stock === 0 ? 0.5 : 1 
                                                }}
                                            />
                                        </Link>
                                        <div className="position-absolute top-0 end-0 p-2">
                                            {product.stock === 0 ? (
                                                <span className="badge bg-secondary shadow-sm">AGOTADO</span>
                                            ) : (
                                                <span className="badge bg-danger shadow-sm animate-pulse">HOT</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Cuerpo de la Tarjeta */}
                                    <div className="card-body text-center d-flex flex-column">
                                        <Link to={`/producto/${product.id}`} className="text-decoration-none text-dark">
                                            <h5 className="card-title fw-bold text-truncate hover-primary mb-1">{product.nombre}</h5>
                                        </Link>
                                        
                                        <p className="product-category text-muted small text-uppercase mb-2">
                                            {product.categoria?.nombre || 'General'}
                                        </p>
                                        
                                        <div className="mt-auto">
                                            <p className="fw-bold fs-4 text-primary mb-3">${product.precio?.toLocaleString()}</p>
                                            <button 
                                                className={`btn w-100 rounded-pill fw-bold ${product.stock === 0 ? 'btn-secondary' : 'btn-outline-primary'}`}
                                                onClick={() => addToCart(product)}
                                                disabled={product.stock === 0}
                                            >
                                                {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* === CATEGORÍAS EXPANDIBLES (NUEVO COMPONENTE) === */}
            <CategoryExpanding categories={categories} />

            {/* === CATÁLOGO COMPLETO === */}
            <section className="all-products-section container mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h3 className="fw-bold m-0 text-uppercase">Catálogo Completo</h3>
                    <span className="text-muted small">{products.length} productos disponibles</span>
                </div>
                
                {products.length > 0 ? (
                    <ProductList products={products} />
                ) : (
                    <div className="text-center py-5 bg-light rounded border border-secondary border-opacity-25">
                        <div className="display-1 mb-3">🔍</div>
                        <h3>No se encontraron productos</h3>
                        <p className="text-muted">Intenta cambiar los términos de búsqueda.</p>
                        <button onClick={() => window.location.reload()} className="btn btn-secondary mt-2 rounded-pill px-4">
                            Limpiar Filtros
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}