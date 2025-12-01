import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductList from "../Components/common/ProductList";
import { useCart } from "../Components/cart/CartContext";
// IMPORTANTE: Conectamos con el contexto de productos
import { useProducts } from "../Components/products/ProductContext";

export default function Home() {
    // 1. Obtenemos datos y funciones de los Contextos
    const { products, allProducts, loading } = useProducts();
    const { addToCart } = useCart();

    // 2. Lógica para Productos Destacados (Random 3)
    // Usamos useMemo para que no se recalculen cada vez que escribes en el buscador
    const featuredProducts = useMemo(() => {
        if (!allProducts.length) return [];
        // Creamos una copia [...] para no mutar el original al ordenar
        return [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [allProducts]);

    // 3. Lógica para Categorías Únicas
    const categories = useMemo(() => {
        if (!allProducts.length) return [];
        // Set elimina duplicados, luego convertimos a Array y tomamos 4
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

    // Spinner de Carga
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
                        <Link to="/categoria/todos" className="btn btn-primary btn-lg me-3 px-4 rounded-pill shadow-sm">
                            Explorar Productos
                        </Link>
                        <Link to="/about" className="btn btn-outline-light btn-lg px-4 rounded-pill">
                            Conoce Más
                        </Link>
                    </div>
                </div>
            </section>

            {/* === FEATURED PRODUCTS (DESTACADOS) === */}
            {featuredProducts.length > 0 && (
                <section className="featured-products container mb-5">
                    <h2 className="text-center fw-bold mb-4">🔥 PRODUCTOS DESTACADOS</h2>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {featuredProducts.map(product => (
                            <div key={product.id} className="col">
                                <div className="card h-100 shadow-sm border-0 position-relative group">
                                    
                                    {/* 1. Contenedor de Imagen (Con Link) */}
                                    <div className="position-relative overflow-hidden">
                                        {/* ENLACE EN LA IMAGEN */}
                                        <Link to={`/producto/${product.id}`}>
                                            <img 
                                                src={product.imagenUrl} 
                                                alt={product.nombre}
                                                className="card-img-top p-3"
                                                style={{ 
                                                    height: "250px", 
                                                    objectFit: "contain", 
                                                    transition: "transform 0.3s",
                                                    // Opacidad si no hay stock
                                                    opacity: product.stock === 0 ? 0.5 : 1
                                                }}
                                            />
                                        </Link>
                                        
                                        {/* Badge de Estado */}
                                        <div className="position-absolute top-0 end-0 p-2" style={{pointerEvents: 'none'}}>
                                            {product.stock === 0 ? (
                                                <span className="badge bg-secondary shadow-sm">AGOTADO</span>
                                            ) : (
                                                <span className="badge bg-danger shadow-sm">HOT</span>
                                            )}
                                        </div>

                                        {/* Botón Overlay (Solo aparece si hay stock) */}
                                        {product.stock > 0 && (
                                            <div className="product-overlay d-none d-md-flex justify-content-center align-items-center position-absolute w-100 h-100 top-0 start-0 bg-dark bg-opacity-25 opacity-0 hover-opacity-100 transition-opacity">
                                                <button 
                                                    className="btn btn-light rounded-pill fw-bold shadow"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    🛒 Agregar Rápido
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Cuerpo de la Tarjeta (Con Link en Título) */}
                                    <div className="card-body text-center">
                                        {/* ENLACE EN EL TÍTULO */}
                                        <Link to={`/producto/${product.id}`} className="text-decoration-none text-dark">
                                            <h5 className="card-title fw-bold text-truncate hover-primary">
                                                {product.nombre}
                                            </h5>
                                        </Link>

                                        <p className="product-category text-muted mb-1 small text-uppercase">{product.categoria}</p>
                                        
                                        {/* Precio con estilo condicional */}
                                        <p className={`fw-bold fs-4 my-2 ${product.stock === 0 ? 'text-muted text-decoration-line-through' : 'text-primary'}`}>
                                            ${product.precio?.toLocaleString()}
                                        </p>
                                        
                                        {/* Botón Principal (Abajo) - LOGICA DE STOCK AQUI */}
                                        <button 
                                            className={`btn w-100 rounded-pill fw-bold ${product.stock === 0 ? 'btn-secondary disabled' : 'btn-outline-primary'}`}
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0} // Se bloquea si no hay stock
                                            style={{ cursor: product.stock === 0 ? "not-allowed" : "pointer" }}
                                        >
                                            {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
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
                                    <Link to={`/categoria/${category}`} className="text-decoration-none text-dark">
                                        <div className="card h-100 border-0 shadow-sm text-center p-4 hover-lift transition-transform">
                                            <div className="display-4 mb-3">
                                                {categoryIcons[category] || "⚡"}
                                            </div>
                                            <h5 className="fw-bold m-0">{category}</h5>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* === ALL PRODUCTS SECTION (Filtrable por Buscador) === */}
            <section className="all-products-section container mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h3 className="fw-bold m-0">CATÁLOGO COMPLETO</h3>
                    <span className="text-muted">
                        {products.length} producto{products.length !== 1 ? 's' : ''} encontrados
                    </span>
                </div>
                
                {products.length > 0 ? (
                    // ProductList ya maneja sus propias tarjetas internamente
                    <ProductList products={products} />
                ) : (
                    <div className="text-center py-5 bg-light rounded">
                        <div className="display-1 mb-3">🔍</div>
                        <h3>No se encontraron productos</h3>
                        <p className="text-muted">Intenta con otros términos de búsqueda</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn btn-secondary mt-2"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}