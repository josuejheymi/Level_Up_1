import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../config/api";

/**
 * Componente: Detalle de Orden (Comprobante)
 * Responsabilidad: Mostrar la información completa de una compra pasada.
 * * Concepto de Negocio Clave: SNAPSHOT DE PRECIO
 * Al mostrar una orden antigua, NO debemos mostrar el precio actual del producto,
 * sino el precio que tenía EL DÍA QUE SE COMPRÓ. Por eso leemos 'precioUnitario'
 * del detalle de la orden, no del producto.
 */
export default function OrderDetail() {
  
  // 1. OBTENER ID DE LA URL
  // Si la ruta es /ordenes/5, id será "5".
  const { id } = useParams(); 
  
  // 2. ESTADOS
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 3. CARGAR DATOS
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Petición al endpoint seguro. 
        // Gracias a SecurityConfig, el usuario solo puede ver SUS propias órdenes (o ser Admin).
        const res = await api.get(`/ordenes/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error cargando orden:", err);
        setError("No pudimos cargar la orden. Verifica que el ID sea correcto o que tengas permisos.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // --- RENDERIZADO DE ESTADOS DE CARGA ---
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-black">
        <div className="spinner-border text-success" role="status"></div>
    </div>
  );

  if (error) return (
    <div className="container text-center mt-5 text-white fade-in">
        <div className="display-1">🚫</div>
        <h3 className="mt-3 text-danger">{error}</h3>
        <Link to="/" className="btn btn-outline-light mt-3 rounded-pill px-4">Volver al Inicio</Link>
    </div>
  );

  if (!order) return null;

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="container py-5 fade-in">
      
      {/* TARJETA PRINCIPAL (Tipo Ticket) */}
      <div className="card bg-dark border-secondary shadow-lg overflow-hidden">
        
        {/* CABECERA: ID y Estado */}
        <div className="card-header bg-success text-black d-flex flex-wrap justify-content-between align-items-center p-4">
            <div>
                <h6 className="m-0 fw-bold opacity-75 text-uppercase">Comprobante de Compra</h6>
                <h2 className="m-0 fw-bold">ORDEN #{order.id}</h2>
                <small className="fw-bold">
                    {/* Formateo de fecha seguro */}
                    {order.fechaCreacion ? new Date(order.fechaCreacion).toLocaleString() : "Fecha no disponible"}
                </small>
            </div>
            <div className="text-end mt-2 mt-md-0">
                <span className="badge bg-black text-white px-3 py-2 fs-6 border border-white">
                    PAGADO ✅
                </span>
            </div>
        </div>

        <div className="card-body p-4 text-white">
            
            {/* SECCIÓN 1: DATOS DE ENVÍO Y CLIENTE */}
            <div className="row mb-5 g-4">
                {/* Columna Izquierda: Envío */}
                <div className="col-md-6">
                    <h5 className="text-primary fw-bold mb-3 border-bottom border-secondary pb-2 d-inline-block">
                        📍 Dirección de Envío
                    </h5>
                    <div className="text-light opacity-90">
                        <p className="mb-1"><strong>Región:</strong> {order.region || "No especificada"}</p>
                        <p className="mb-1"><strong>Comuna:</strong> {order.comuna || "No especificada"}</p>
                        <p className="fs-5 mt-2 fw-semibold text-white">
                            {order.direccion || "Retiro en tienda"}
                        </p>
                    </div>
                </div>
                
                {/* Columna Derecha: Cliente */}
                <div className="col-md-6 text-md-end">
                    <h5 className="text-primary fw-bold mb-3 border-bottom border-secondary pb-2 d-inline-block">
                        Datos del Cliente
                    </h5>
                    <p className="mb-0 fs-5">{order.usuario?.nombre}</p>
                    <p className="text-muted">{order.usuario?.email}</p>
                </div>
            </div>

            {/* SECCIÓN 2: TABLA DE PRODUCTOS */}
            <h5 className="text-white fw-bold mb-3">Detalle de Productos</h5>
            <div className="table-responsive border border-secondary rounded mb-4">
                <table className="table table-dark table-striped mb-0 align-middle">
                    <thead className="bg-black">
                        <tr>
                            <th className="ps-4 text-secondary">PRODUCTO</th>
                            <th className="text-center text-secondary">CANT.</th>
                            <th className="text-end text-secondary">PRECIO UNIT.</th>
                            <th className="text-end pe-4 text-secondary">SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.detalles?.map((detalle, index) => {
                            // Lógica de seguridad para el precio
                            // Prioridad: 1. Precio guardado en detalle (Histórico) -> 2. Precio actual (si falló el guardado) -> 3. Cero
                            const precioHistorico = detalle.precioUnitario || detalle.precioAlMomento || 0;
                            
                            return (
                                <tr key={index}>
                                    <td className="ps-4">
                                        <div className="fw-bold text-white">{detalle.producto?.nombre || "Producto eliminado"}</div>
                                        <small className="text-muted">ID: {detalle.producto?.id}</small>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge bg-secondary rounded-pill text-black">{detalle.cantidad}</span>
                                    </td>
                                    <td className="text-end text-muted">
                                        ${precioHistorico.toLocaleString()}
                                    </td>
                                    <td className="text-end fw-bold text-success pe-4">
                                        ${(precioHistorico * detalle.cantidad).toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* SECCIÓN 3: TOTALES */}
            <div className="d-flex justify-content-end align-items-center mb-4">
                <div className="text-end p-3 border border-secondary rounded bg-black">
                    <p className="mb-0 text-muted text-uppercase small fw-bold">Total Pagado</p>
                    <h2 className="text-success fw-bold m-0 display-6">
                        ${order.total?.toLocaleString()}
                    </h2>
                </div>
            </div>

            {/* BOTÓN DE RETORNO */}
            <div className="text-center mt-5 border-top border-secondary pt-4">
                <Link to="/profile" className="btn btn-outline-light px-5 rounded-pill fw-bold hover-scale">
                    ← Volver a Mis Pedidos
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}