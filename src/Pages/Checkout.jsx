import React, { useState } from "react";
import { useCart } from "../Components/cart/CartContext";
import { useUser } from "../Components/user/UserContext";
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  const { cart, checkout } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Si el carrito está vacío, lo enviamos de vuelta
  if (!cart?.items || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleFinalizar = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!direccion || direccion.trim() === "") {
      setError("La dirección de envío es obligatoria.");
      setLoading(false);
      return;
    }

    const resultado = await checkout(direccion);

    setLoading(false);

    if (resultado.success) {
      alert(`🎉 ¡Felicidades! Tu pedido #${resultado.orden.id} va en camino a: ${direccion}`);
      navigate("/profile");
    } else {
      const errorMsg = resultado.message.replace("Error en la compra: ", "");
      setError(errorMsg);
    }
  };

  const subtotalReal = (cart.items || []).reduce((acc, item) => {
    return acc + (item.precioUnitario * item.cantidad);
  }, 0);
  const montoDescuento = subtotalReal - (cart.total || 0);
  const hayDescuento = montoDescuento > 0.01; // Usamos un margen pequeño

  return (
    <div className="container my-5 fade-in">
      <h2 className="mb-4 fw-bold text-white">Finalizar Compra y Envío</h2>
      
      <div className="row">
        {/* === COLUMNA IZQUIERDA: FORMULARIO === */}
        <div className="col-md-7 mb-4">
          {/* Tarjeta de Formulario: Fondo Oscuro, Borde Secundario */}
          <div className="card shadow-lg p-4 bg-dark border border-secondary">
            <h4 className="mb-3 text-white fw-bold">Datos de Envío</h4>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleFinalizar}>
              <div className="mb-3">
                <label className="form-label text-white">Nombre</label>
                <input type="text" className="form-control" value={user?.nombre || ''} disabled />
              </div>
              <div className="mb-3">
                <label className="form-label text-white">Email</label>
                <input type="email" className="form-control" value={user?.email || ''} disabled />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold text-white">Dirección de Entrega</label>
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Ej: Av. Siempreviva 742, Springfield"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                ></textarea>
                <div className="form-text text-secondary">
                    Recuerda incluir calle, número y comuna.
                </div>
              </div>

              <h4 className="mt-4 mb-3 text-white fw-bold">Método de Pago</h4>
              {/* ALERTA CORREGIDA */}
              <div className="alert bg-secondary text-white border-primary">
                💳 **Simulación:** El pago se procesará con la tarjeta de prueba.
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-3 fw-bold mt-4" // btn-primary es Verde Neón en tu tema
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Procesando Pago...
                  </span>
                ) : (
                  `🔒 Pagar $${cart.total?.toLocaleString()}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* === COLUMNA DERECHA: RESUMEN === */}
        <div className="col-md-5 mt-4 mt-md-0">
          <div className="card bg-dark border-secondary p-4 sticky-top shadow-lg" style={{ top: "100px", zIndex: 1 }}>
            <h5 className="mb-3 text-white fw-bold">Resumen del Carrito</h5>
            
            {/* Lista de Items */}
            <ul className="list-group list-group-flush mb-3">
              {cart.items.map((item) => (
                // Items de la lista oscuros
                <li key={item.id} className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white">
                  <div className="text-truncate" style={{maxWidth: '70%'}}>
                    <small>{item.cantidad}x {item.producto.nombre}</small>
                  </div>
                  <small className="text-secondary">${(item.precioUnitario * item.cantidad).toLocaleString()}</small>
                </li>
              ))}
            </ul>
            
            <hr className="my-2 border-secondary" />

            {/* Desglose de Precios */}
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Subtotal (sin descuento):</span>
              <span className="fw-bold text-white">${subtotalReal.toLocaleString()}</span>
            </div>

            {hayDescuento && (
              <div className="d-flex justify-content-between mb-3 text-success">
                <span className="fw-bold">Descuento Duoc (20%):</span>
                <span className="fw-bold">- ${montoDescuento.toLocaleString()}</span>
              </div>
            )}

            <hr className="my-2 border-secondary" />

            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="h5 mb-0 text-white">Total a Pagar</span>
              <span className="h3 mb-0 text-success fw-bold">
                ${cart.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}