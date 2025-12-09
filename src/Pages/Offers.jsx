import React, { useMemo, useEffect } from "react";
import ProductList from "../Components/common/ProductList"; 
import { useProducts } from "../Components/products/ProductContext"; 

/**
 * Componente: Página de Ofertas
 * Responsabilidad: Filtrar y mostrar productos destacados por precio o stock crítico.
 * * Conceptos Clave:
 * 1. Estado Derivado: Calculamos las ofertas al vuelo basándonos en los datos existentes.
 * 2. useMemo: Importante para no volver a filtrar miles de productos si el usuario solo hace click en algo irrelevante.
 * 3. UX Visual: Uso de Banners llamativos para indicar promociones.
 */
export default function Offers() {
  
  // 1. CONSUMO DE DATOS
  const { allProducts, loading } = useProducts();

  // 2. EFECTO: Scroll Up
  // Al entrar a la sección de ofertas, aseguramos que la vista inicie arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * 3. LÓGICA DE FILTRADO (Simulación de Ofertas)
   * En un e-commerce real, esto podría venir marcado desde el Backend.
   * Aquí usamos lógica de negocio frontend:
   * - Stock Crítico: Menos de 10 unidades (Liquidación).
   * - Precio Bajo: Menor a $50.000 (Ganga).
   */
  const offerProducts = useMemo(() => {
    if (!allProducts) return [];
    
    return allProducts.filter(p => {
        // Excluimos productos sin stock (0) para no frustrar al usuario
        const tieneStock = p.stock > 0;
        const esLiquidacion = p.stock < 10;
        const esBarato = p.precio < 50000;
        
        return tieneStock && (esLiquidacion || esBarato);
    });
  }, [allProducts]);

  // --- RENDERIZADO: CARGA ---
  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
            <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Buscando ofertas...</span>
            </div>
        </div>
    );
  }

  // --- RENDERIZADO: PRINCIPAL ---
  return (
    <div className="container mt-4 mb-5 fade-in">
      
      {/* === BANNER PROMOCIONAL (HERO) === */}
      <div className="p-5 mb-5 rounded-4 text-white text-center shadow-lg position-relative overflow-hidden border border-secondary">
        
        {/* Contenido (z-index alto para estar sobre el fondo) */}
        <div className="position-relative" style={{ zIndex: 2 }}>
            <div className="d-flex justify-content-center align-items-center gap-3 mb-2">
                {/* Icono Fuego */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.5-3.3.3-1.4 1.8-2.575 3-3.2.5.8 1.1 1.7 1.1 2.5a2.5 2.5 0 0 1-1.1 2z"></path></svg>
                <h1 className="display-4 fw-bold text-uppercase fst-italic m-0" style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.8)" }}>
                    Cyber Level Up
                </h1>
                {/* Icono Rayo */}
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            
            <p className="fs-4 text-light opacity-90">
                Hasta <span className="fw-bold text-warning">40% OFF</span> en productos seleccionados y liquidación de stock.
            </p>
        </div>

        {/* Fondo Decorativo (Gradiente Rojo Gamer) */}
        <div 
            className="position-absolute top-0 start-0 w-100 h-100" 
            style={{ 
                background: "linear-gradient(135deg, #7f1d1d 0%, #000000 100%)", 
                zIndex: 1,
                opacity: 0.9 
            }}
        ></div>
        
        {/* Patrón de fondo (opcional, círculos decorativos) */}
        <div className="position-absolute top-0 end-0 p-5 opacity-25" style={{ zIndex: 1 }}>
             <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="2" />
             </svg>
        </div>
      </div>

      {/* TÍTULO DE LISTADO */}
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary pb-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--bs-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
        <h2 className="text-uppercase fw-bold text-white m-0">Oportunidades Relámpago</h2>
      </div>

      {/* LISTADO O ESTADO VACÍO */}
      {offerProducts.length > 0 ? (
        <ProductList products={offerProducts} />
      ) : (
        <div className="alert alert-dark text-center border border-secondary py-5">
            <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h4 className="text-white">¡Se agotaron las ofertas!</h4>
            <p className="text-secondary">Nuestros precios eran tan buenos que volaron. Revisa más tarde.</p>
        </div>
      )}
    </div>
  );
}