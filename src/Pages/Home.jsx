import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductList from "../Components/common/ProductList";
import { useCart } from "../Components/cart/CartContext";
// IMPORTANTE: Conectamos con el contexto de productos
import { useProducts } from "../Components/products/ProductContext";

export default function Home() {
    // Obtenemos:
    // - products: La lista filtrada por la búsqueda (para mostrar abajo)
    // - allProducts: La lista completa (para calcular destacados y categorías)
    // - loading: Para mostrar un spinner mientras carga Java
    const { products, allProducts, loading } = useProducts();
    const { addToCart } = useCart();

    // 1. Calcular Productos Destacados (Random)
    // Usamos useMemo para que no se recalculen cada vez que escribes en el buscador
    const featuredProducts = useMemo(() => {
        if (!allProducts.length) return [];
        return [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [allProducts]);

    // 2. Calcular Categorías Únicas
    const categories = useMemo(() => {
        if (!allProducts.length) return [];
        return [...new Set(allProducts.map(p => p.categoria))].slice(0, 4);
    }, [allProducts]);

    // Iconos para decorar categorías
    const categoryIcons = {
        "Consolas": "🎮",
        "PC Gamer": "🖥️",
        "Accesorios": "🎧",
        "Sillas": "💺",
        "Juegos": "🕹️",
        "Ropa": "👕"
    };

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
            {/* === HERO SECTION === */}
            <section className="hero bg-dark text-white py-5 mb-5" style={{ background: "linear-gradient(45deg, #1a1a1a, #2c3e50)" }}>
                <div className="container py-5 text-center">
                    <h1 className="display-3 fw-bold mb-3">LEVEL UP YOUR GAME</h1>
                    <p className="lead mb-4">Descubre los mejores productos gaming con tecnología de última generación</p>
                    <div className="hero-buttons">
                        <Link to="/categoria/todos" className="btn btn-primary btn-lg me-3 px-4 rounded-pill">
                            Explorar Productos
                        </Link>
                        <Link to="/about" className="btn btn-outline-light btn-lg px-4 rounded-pill">
                            Conoce Más
                        </Link>
                    </div>
                </div>
            </section>

            {/* === FEATURED PRODUCTS (Basado en allProducts) === */}
            {featuredProducts.length > 0 && (
                <section className="featured-products container mb-5">
                    <h2 className="text-center fw-bold mb-4">🔥 PRODUCTOS DESTACADOS</h2>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="col">
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="position-relative overflow-hidden group">
                                        <img 
                                            src={product.imagenUrl} 
                                            alt={product.nombre}
                                            className="card-img-top p-3"
                                            style={{ height: "250px", objectFit: "contain", transition: "transform 0.3s" }}
                                        />
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <span className="badge bg-danger">HOT</span>
                                        </div>
                                    </div>
                                    <div className="card-body text-center">
                                        <h5 className="card-title fw-bold">{product.nombre}</h5>
                                        <p className="text-primary fw-bold fs-5">${product.precio?.toLocaleString()}</p>
                                        <button 
                                            className="btn btn-outline-primary w-100 rounded-pill"
                                            onClick={() => addToCart(product)}
                                        >
                                            🛒 Agregar Rápido
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* === CATEGORIES SECTION === */}
            {categories.length > 0 && (
                <section className="categories-section bg-light py-5 mb-5">
                    <div className="container">
                        <h2 className="text-center fw-bold mb-5">EXPLORA CATEGORÍAS</h2>
                        <div className="row justify-content-center g-4">
                            {categories.map((category) => (
                                <div key={category} className="col-6 col-md-3">
                                    <Link to={`/categoria/${category}`} className="text-decoration-none">
                                        <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift">
                                            <div className="display-4 mb-3">
                                                {categoryIcons[category] || "⚡"}
                                            </div>
                                            <h5 className="text-dark fw-bold">{category}</h5>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* === ALL PRODUCTS SECTION (Filtrable) === */}
            <section className="all-products-section container mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h2 className="fw-bold m-0">CATÁLOGO COMPLETO</h2>
                    <span className="text-muted">
                        Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
                    </span>
                </div>
                
                {products.length > 0 ? (
                    <ProductList products={products} />
                ) : (
                    <div className="text-center py-5">
                        <div className="display-1 mb-3">🔍</div>
                        <h3>No se encontraron productos</h3>
                        <p className="text-muted">Intenta con otros términos de búsqueda</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-secondary"
                        >
                            Ver Todos
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}