import React, { useState } from "react";
import { useCart } from "../Components/cart/CartContext";
import { useUser } from "../Components/user/UserContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, checkout } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState("");
  const [loading, setLoading] = useState(false);

  // Si entra directo y no tiene carrito, lo sacamos
  if (!cart?.items || cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleFinalizar = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Llamamos al contexto con la dirección escrita
    const resultado = await checkout(direccion);

    setLoading(false);

    if (resultado.success) {
      alert(`🎉 ¡Felicidades! Tu pedido #${resultado.orden.id} va en camino a: ${direccion}`);
      navigate("/profile"); // Lo mandamos a su perfil para ver el historial
    } else {
      alert("❌ Error: " + resultado.message);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Finalizar Compra</h2>
      
      <div className="row">
        {/* Columna Izquierda: Formulario */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4 border-0">
            <h4 className="mb-3">Datos de Envío</h4>
            <form onSubmit={handleFinalizar}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" value={user?.nombre} disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="text" className="form-control" value={user?.email} disabled />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Dirección de Entrega</label>
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Ej: Av. Siempreviva 742, Springfield"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                ></textarea>
              </div>

              <h4 className="mt-4 mb-3">Método de Pago</h4>
              <div className="alert alert-info">
                💳 Simulación: El pago se procesará con la tarjeta terminada en **1234
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 py-3 fw-bold mt-2"
                disabled={loading}
              >
                {loading ? "Procesando..." : `Pagar $${cart.total?.toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>

        {/* Columna Derecha: Resumen */}
        <div className="col-md-5">
          <div className="card bg-light border-0 p-4">
            <h5 className="mb-3">Resumen del Pedido</h5>
            <ul className="list-group mb-3">
              {cart.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">{item.producto.nombre}</h6>
                    <small className="text-muted">Cant: {item.cantidad}</small>
                  </div>
                  <span className="text-muted">${(item.precioUnitario * item.cantidad).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Total (CLP)</span>
              <strong className="text-primary fs-4">${cart.total?.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}