import React from "react";
import { useCart } from "../Components/cart/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  
  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container mt-5 text-center fade-in">
        <div style={{ fontSize: "4rem" }}>🛒</div>
        <h3 className="mt-3 text-white">Tu carrito está vacío</h3>
        <p className="text-muted">¡Agrega algunos productos para comenzar!</p>
        <Link to="/" className="btn btn-primary mt-3 px-4 rounded-pill fw-bold">
          Ir a la Tienda
        </Link>
      </div>
    );
  }

  // Cálculos de descuento
  const subtotalReal = (cart.items || []).reduce((acc, item) => {
    return acc + (item.precioUnitario * item.cantidad);
  }, 0);
  const hayDescuento = (cart.total || 0) < subtotalReal;
  const montoDescuento = subtotalReal - (cart.total || 0);

  return (
    <div className="container mt-5 mb-5 fade-in">
      <h2 className="mb-4 fw-bold text-white">Tu Carrito de Compras</h2>
      
      <div className="row">
        {/* === TABLA DE PRODUCTOS (Estilo Oscuro) === */}
        <div className="col-lg-8">
          <div className="table-responsive shadow-sm rounded border border-secondary">
            <table className="table table-hover table-dark align-middle mb-0 bg-transparent">
              <thead>
                <tr>
                  <th scope="col" className="ps-4 text-success">Producto</th>
                  <th scope="col" className="text-success">Precio</th>
                  <th scope="col" className="text-center text-success">Cantidad</th>
                  <th scope="col" className="text-end text-success">Subtotal</th>
                  <th scope="col" className="text-center pe-4"></th>
                </tr>
              </thead>
              <tbody>
                {(cart.items || []).map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                        <div className="fw-bold text-white">
                            {item.producto?.nombre || "Producto desconocido"}
                        </div>
                        {/* 🚨 CORRECCIÓN CLAVE AQUÍ: Acceder a .categoria.nombre 🚨 */}
                        <small className="text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>
                            {item.producto?.categoria?.nombre} 
                        </small>
                    </td>
                    
                    <td>${item.precioUnitario?.toLocaleString()}</td>
                    
                    <td className="text-center">
                        <div className="btn-group btn-group-sm border border-secondary rounded" role="group">
                            <button 
                                className="btn btn-outline-light"
                                onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                disabled={item.cantidad <= 1}
                            >
                                -
                            </button>
                            <span className="btn btn-dark disabled text-white border-0 fw-bold" style={{ width: "40px", opacity: 1 }}>{item.cantidad}</span>
                            <button className="btn btn-outline-light" onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}>+</button>
                        </div>
                    </td>

                    <td className="text-end fw-bold">
                      ${(item.precioUnitario * item.cantidad).toLocaleString()}
                    </td>

                    <td className="text-center pe-4">
                        <button 
                            className="btn btn-outline-danger btn-sm border-0 rounded-circle"
                            onClick={() => removeFromCart(item.producto.id)}
                            title="Eliminar del carrito"
                        >
                            🗑️
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* === RESUMEN DE PAGO (Derecha) === */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border border-secondary bg-dark p-4 sticky-top shadow-lg" style={{ top: "100px", zIndex: 1 }}>
            <h4 className="mb-3 fw-bold text-white">Resumen del Pedido</h4>
            
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="fw-bold text-white">${subtotalReal.toLocaleString()}</span>
            </div>

            {hayDescuento && (
              <div className="d-flex justify-content-between mb-3 text-success">
                <span>Descuento Duoc (20%)</span>
                <span className="fw-bold">- ${montoDescuento.toLocaleString()}</span>
              </div>
            )}

            <hr className="my-2 border-secondary" />

            <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
              <span className="h5 mb-0 text-white">Total a Pagar</span>
              <span className="h3 mb-0 text-success fw-bold">
                ${(cart.total || 0).toLocaleString()}
              </span>
            </div>

            <Link 
                to="/checkout" 
                className="btn btn-primary w-100 py-3 fw-bold shadow-sm rounded-pill transition-transform hover-scale"
            >
              Proceder al Pago
            </Link>
            
            <div className="text-center mt-3">
                <small className="text-muted">
                     Compra 100% Segura
                </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}