import React from "react";
import { Link } from "react-router-dom"; // Importamos Link para navegación
import { useCart } from "../cart/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    // Verificamos si hay stock
    const sinStock = product.stock === 0;

    return (
        <div className="card h-100 shadow-sm border-0 position-relative hover-lift">
            
            {/* 1. Imagen Clickeable con Badge AGOTADO */}
            <div className="position-relative overflow-hidden">
                <Link to={`/producto/${product.id}`}>
                    <img
                        src={product.imagenUrl}
                        className="card-img-top p-3"
                        alt={product.nombre}
                        style={{ 
                            height: "200px", 
                            objectFit: "contain",
                            opacity: sinStock ? 0.5 : 1,
                            transition: "transform 0.3s ease"
                        }}
                    />
                </Link>
                
                {/* Badge Visual de Agotado */}
                {sinStock && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
                        <span className="badge bg-secondary fs-5 shadow text-uppercase">Agotado</span>
                    </div>
                )}
            </div>

            <div className="card-body d-flex flex-column text-center">
                {/* Título Clickeable */}
                <Link to={`/producto/${product.id}`} className="text-decoration-none text-dark">
                    <h5 className="card-title fw-bold text-truncate mb-1">{product.nombre}</h5>
                </Link>
                
                {/* CATEGORIA CORREGIDA: Accedemos al campo nombre */}
                <p className="text-muted small mb-3 text-uppercase fw-semibold" style={{fontSize: "0.75rem"}}>
                    {product.categoria?.nombre || 'Sin Categoría'}
                </p>
                
                {/* Precio */}
                <div className="mb-3">
                    <span className={`fs-4 fw-bold ${sinStock ? 'text-muted text-decoration-line-through' : 'text-primary'}`}>
                        ${product.precio?.toLocaleString()}
                    </span>
                </div>

                <div className="mt-auto">
                    {/* 2. BOTÓN CONDICIONAL */}
                    <button
                        className={`btn w-100 fw-bold rounded-pill shadow-sm transition-all ${sinStock ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => addToCart(product)}
                        disabled={sinStock} 
                        style={{ cursor: sinStock ? "not-allowed" : "pointer" }}
                    >
                        {sinStock ? "Sin Stock" : "Agregar al Carrito"}
                    </button>
                    
                    {/* Mensaje de "Quedan pocos" */}
                    {!sinStock && product.stock > 0 && product.stock < 5 && (
                        <small className="text-danger d-block mt-2 fw-bold animate-pulse">
                            ¡Solo quedan {product.stock}!
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
}