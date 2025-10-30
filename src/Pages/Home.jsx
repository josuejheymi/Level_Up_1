import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductList from "../Components/common/ProductList";

export default function Home({ products }) {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // Seleccionar productos destacados y categorías al cargar
    useEffect(() => {
        if (products.length > 0) {
            // Tomar los primeros 6 productos como destacados
            setFeaturedProducts(products.slice(0, 6));
            
            // Obtener categorías únicas
            const uniqueCategories = [...new Set(products.map(p => p.categoria))].slice(0, 4);
            setCategories(uniqueCategories);
        }
    }, [products]);

    return (
        <div className="home-page">
            {/* === HERO SECTION === */}
            <section className="hero">
                <div className="container">
                    <h2>LEVEL UP YOUR GAME</h2>
                    <p>Descubre los mejores productos gaming con tecnología de última generación</p>
                    <div className="hero-buttons">
                        <Link to="/categoria/todos" className="btn-custom me-3">
                            Explorar Productos
                        </Link>
                        <Link to="/about" className="btn-custom btn-outline">
                            Conoce Más
                        </Link>
                    </div>
                </div>
            </section>

            {/* === FEATURED PRODUCTS === */}
            <section className="featured-products">
                <div className="container">
                    <h2>PRODUCTOS DESTACADOS</h2>
                    <p className="section-subtitle">Los favoritos de nuestra comunidad gamer</p>
                    
                    {featuredProducts.length > 0 ? (
                        <div className="products-grid">
                            {featuredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image-container">
                                        <img 
                                            src={product.imagen} 
                                            alt={product.nombre}
                                            className="product-img"
                                        />
                                        <div className="product-overlay">
                                            <Link 
                                                to={`/categoria/${product.categoria}`}
                                                className="btn-overlay"
                                            >
                                                Ver Similar
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-title">{product.nombre}</h3>
                                        <p className="product-description">
                                            {product.descripcion.length > 80 
                                                ? `${product.descripcion.substring(0, 80)}...` 
                                                : product.descripcion
                                            }
                                        </p>
                                        <div className="product-footer">
                                            <span className="product-price">
                                                ${product.precio.toLocaleString()}
                                            </span>
                                            <button className="add-to-cart">
                                                🛒 Agregar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <h3>No hay productos disponibles</h3>
                            <p>Prueba ajustando tus términos de búsqueda</p>
                        </div>
                    )}
                </div>
            </section>

            {/* === CATEGORIES SECTION === */}
            {categories.length > 0 && (
                <section className="categories-section">
                    <div className="container">
                        <h2>EXPLORA CATEGORÍAS</h2>
                        <p className="section-subtitle">Encuentra lo que necesitas por tipo de producto</p>
                        
                        <div className="categories-grid">
                            {categories.map((category, index) => {
                                const categoryProducts = products.filter(p => p.categoria === category);
                                const categoryIcons = ["🎮", "🖥️", "⌨️", "🎧", "📱", "🕹️"];
                                
                                return (
                                    <Link 
                                        key={category} 
                                        to={`/categoria/${category}`}
                                        className="category-card"
                                    >
                                        <div className="category-icon">
                                            {categoryIcons[index] || "⚡"}
                                        </div>
                                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                                        <p>{categoryProducts.length} productos</p>
                                        <div className="category-hover">
                                            <span>Explorar →</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* === ALL PRODUCTS SECTION === */}
            <section className="all-products-section">
                <div className="container">
                    <div className="section-header">
                        <h2>TODOS LOS PRODUCTOS</h2>
                        <p className="section-subtitle">
                            Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    
                    {products.length > 0 ? (
                        <ProductList products={products} />
                    ) : (
                        <div className="no-products-message">
                            <div className="no-products-icon">🔍</div>
                            <h3>No se encontraron productos</h3>
                            <p>Intenta con otros términos de búsqueda o revisa nuestras categorías</p>
                            <Link to="/categoria/todos" className="btn-custom">
                                Ver Todos los Productos
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* === CTA SECTION === */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>¿LISTO PARA ELEVAR TU EXPERIENCIA GAMING?</h2>
                        <p>Únete a miles de gamers que ya confían en nosotros</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn-custom btn-cta">
                                Crear Cuenta
                            </Link>
                            <Link to="/about" className="btn-custom btn-outline">
                                Saber Más
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}