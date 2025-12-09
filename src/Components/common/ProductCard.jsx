import React from "react";
import { Link } from "react-router-dom"; 
import { useCart } from "../cart/CartContext";

/**
 * Componente Tarjeta de Producto
 * Muestra la información resumida de un producto en el catálogo.
 * * Concepto Clave: Props
 * Recibe un objeto 'product' completo desde el componente padre (ProductList).
 */
export default function ProductCard({ product }) {
  // Hook del carrito para la función de agregar
  const { addToCart } = useCart();

  // Lógica derivada: ¿Está agotado?
  const sinStock = product.stock === 0;

  return (
    <div className="card h-100 shadow-sm border-0 position-relative hover-lift transition-all">
      
      {/* 1. SECCIÓN DE IMAGEN (Clickeable) */}
      <div className="position-relative overflow-hidden bg-white rounded-top">
        <Link to={`/producto/${product.id}`}>
            <img
                src={product.imagenUrl}
                className="card-img-top p-4"
                alt={product.nombre}
                style={{ 
                    height: "220px",        // Altura fija para uniformidad
                    objectFit: "contain",   // La imagen se ajusta sin recortarse
                    opacity: sinStock ? 0.5 : 1, // Efecto visual si no hay stock
                    transition: "transform 0.3s ease"
                }}
            />
        </Link>
        
        {/* Badge "AGOTADO" superpuesto */}
        {sinStock && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                 style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                <span className="badge bg-secondary fs-5 shadow text-uppercase border border-white">
                    Agotado
                </span>
            </div>
        )}

        {/* Badge "HOT" si hay poco stock (y no está agotado) */}
        {!sinStock && product.stock < 5 && (
            <span className="position-absolute top-0 end-0 m-2 badge bg-danger animate-pulse shadow-sm">
                ¡Quedan {product.stock}!
            </span>
        )}
      </div>

      {/* 2. CUERPO DE LA TARJETA */}
      <div className="card-body d-flex flex-column text-center bg-light">
        
        {/* Título: Link al detalle */}
        <Link to={`/producto/${product.id}`} className="text-decoration-none text-dark hover-text-primary">
            <h5 className="card-title fw-bold text-truncate mb-1" title={product.nombre}>
                {product.nombre}
            </h5>
        </Link>
        
        {/* Categoría: Renderizado seguro (Optional Chaining ?.) */}
        <p className="text-muted small mb-3 text-uppercase fw-semibold" style={{fontSize: "0.75rem"}}>
            {product.categoria?.nombre || 'General'}
        </p>
        
        {/* Precio */}
        <div className="mb-3">
            <span className={`fs-4 fw-bold ${sinStock ? 'text-muted text-decoration-line-through' : 'text-primary'}`}>
                ${product.precio?.toLocaleString('es-CL')}
            </span>
        </div>

        {/* Botón de Acción (Push to bottom) */}
        <div className="mt-auto">
            <button
                className={`btn w-100 fw-bold rounded-pill shadow-sm transition-transform active-scale 
                    ${sinStock ? 'btn-secondary disabled-cursor' : 'btn-primary'}`}
                
                // Evento Click: Llama a la función del contexto
                onClick={() => addToCart(product)}
                
                // Atributo disabled: Evita clicks si no hay stock
                disabled={sinStock} 
            >
                {sinStock ? "Sin Stock" : "Agregar al Carrito"}
            </button>
        </div>
      </div>
    </div>
  );
}