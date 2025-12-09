import React, { useState } from "react";
import { useCart } from "../Components/cart/CartContext";
import { useUser } from "../Components/user/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../config/api"; 

/**
 * Componente: Checkout (Finalizar Compra)
 * Responsabilidad: Recopilar datos de envío, procesar el pago (simulado) y crear la orden.
 * * Conceptos Clave:
 * 1. Formularios Controlados: Manejamos inputs de dirección/región.
 * 2. Validación de Sesión: Si no hay usuario, redirigimos al login.
 * 3. Comunicación con API: Enviamos un POST para guardar la venta en la base de datos.
 */
export default function Checkout() {
  
  // 1. HOOKS
  const { cart, clearCart } = useCart(); // Datos del carrito
  const { user } = useUser();            // Datos del usuario logueado
  const navigate = useNavigate();        // Para redirigir tras la compra

  // 2. ESTADO DEL FORMULARIO DE ENVÍO
  const [formData, setFormData] = useState({
    direccion: "",
    region: "",
    comuna: ""
  });
  
  // Estado de carga para el botón "Pagar"
  const [loading, setLoading] = useState(false);

  // 3. CÁLCULOS DE TOTALES (Frontend)
  // Calculamos subtotal sumando (precio * cantidad) de cada item.
  // Usamos || 0 para evitar NaN si algún dato viene corrupto.
  const subtotal = (cart.items || []).reduce((acc, item) => {
      const precio = item.precioUnitario || item.producto?.precio || 0;
      return acc + (precio * item.cantidad);
  }, 0);
  
  const total = cart.total || subtotal; 

  // --- HANDLERS ---

  // Actualiza los campos del formulario al escribir
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * PROCESO DE PAGO
   * Se ejecuta al enviar el formulario.
   */
  const handlePayment = async (e) => {
    e.preventDefault(); // Evita recarga
    setLoading(true);   // Bloquea el botón

    // Validación de seguridad: Usuario debe estar logueado
    if (!user) {
        alert("🔒 Debes iniciar sesión para comprar.");
        navigate("/login");
        return;
    }

    try {
      // A. Preparamos el payload (JSON) para el Backend
      // Debe coincidir con lo que espera el OrdenController.java
      const payload = {
        usuarioId: user.id,
        direccion: formData.direccion,
        region: formData.region,
        comuna: formData.comuna
      };

      console.log("Enviando orden:", payload); // Debug

      // B. Enviamos la petición POST
      const res = await api.post("/ordenes/checkout", payload);

      // C. Si todo sale bien (Status 200 OK):
      clearCart(); // 1. Vaciamos el carrito visualmente
      alert("¡Compra Exitosa! Gracias por preferir Level Up.");
      
      // 2. Redirigimos a la página de detalle de la orden recién creada.
      // El backend nos devuelve el objeto orden creado, que incluye el nuevo ID.
      navigate(`/ordenes/${res.data.id}`); 

    } catch (error) {
      console.error("Error procesando pago:", error);
      // Mostramos el mensaje de error que viene del backend (ej: "Stock insuficiente")
      const msg = error.response?.data || "Hubo un error al procesar tu compra.";
      alert("X " + msg);
    } finally {
      setLoading(false); // Desbloqueamos el botón pase lo que pase
    }
  };

  // --- RENDERIZADO: CARRITO VACÍO ---
  if (!cart.items || cart.items.length === 0) {
    return (
        <div className="container text-center mt-5 text-white fade-in">
            <div style={{fontSize: "4rem"}}>🛒</div>
            <h2 className="mt-3">Tu carrito está vacío</h2>
            <button onClick={() => navigate("/")} className="btn btn-primary mt-3 rounded-pill fw-bold">
                Volver a la Tienda
            </button>
        </div>
    );
  }

  // --- RENDERIZADO: FORMULARIO ---
  return (
    <div className="container py-5 fade-in">
      <h2 className="text-uppercase fw-bold text-white mb-4">Finalizar Compra</h2>
      
      <div className="row">
        
        {/* COLUMNA IZQUIERDA: Formulario de Envío */}
        <div className="col-md-7">
          <div className="card bg-dark border-secondary p-4 text-white shadow-lg">
            <h4 className="mb-3 text-primary">Datos de Envío</h4>
            <form onSubmit={handlePayment}>
              
              <div className="row">
                {/* Selector de Región */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Región</label>
                    <select 
                        className="form-select bg-secondary text-white border-0" 
                        name="region" 
                        value={formData.region}
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Selecciona...</option>
                        <option value="Metropolitana">Metropolitana</option>
                        <option value="Valparaíso">Valparaíso</option>
                        <option value="Biobío">Biobío</option>
                        <option value="Araucanía">Araucanía</option>
                        <option value="Los Lagos">Los Lagos</option>
                    </select>
                </div>
                
                {/* Input de Comuna */}
                <div className="col-md-6 mb-3">
                    <label className="form-label">Comuna</label>
                    <input 
                        type="text" 
                        className="form-control bg-secondary text-white border-0" 
                        name="comuna" 
                        value={formData.comuna}
                        onChange={handleChange} 
                        required 
                        placeholder="Ej: Providencia" 
                    />
                </div>
              </div>

              {/* Input de Dirección Exacta */}
              <div className="mb-3">
                <label className="form-label">Dirección Exacta</label>
                <input 
                    type="text" 
                    className="form-control bg-secondary text-white border-0" 
                    name="direccion" 
                    value={formData.direccion}
                    onChange={handleChange} 
                    required 
                    placeholder="Calle, Número, Depto..." 
                />
              </div>

              <h4 className="mt-4 mb-3 text-primary">Método de Pago</h4>
              <div className="p-3 border border-success rounded mb-3 bg-opacity-10 bg-success d-flex align-items-center gap-3">
                <div className="form-check m-0">
                    <input className="form-check-input" type="radio" name="pago" id="webpay" defaultChecked readOnly />
                    <label className="form-check-label fw-bold" htmlFor="webpay">
                        WebPay Plus (Simulado)
                    </label>
                </div>
                {/* Icono de Tarjeta */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </div>

              {/* Botón de Pago */}
              <button 
                type="submit" 
                className="btn btn-success w-100 py-3 fw-bold fs-5 mt-2 shadow-lg hover-scale" 
                disabled={loading}
              >
                {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span>Procesando...</span>
                ) : (
                    `Pagar $${total.toLocaleString()}`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen de Pedido (Sticky) */}
        <div className="col-md-5 mt-4 mt-md-0">
          <div className="card bg-black border border-secondary p-4 text-white sticky-top shadow" style={{top: "100px"}}>
            <h4 className="mb-3 border-bottom border-secondary pb-2">Resumen del Pedido</h4>
            
            <ul className="list-group list-group-flush mb-3">
              {cart.items.map((item) => {
                  const precio = item.precioUnitario || item.producto?.precio || 0;
                  return (
                    <li key={item.id} className="list-group-item bg-black text-white d-flex justify-content-between align-items-center border-secondary px-0 py-3">
                      <div className="d-flex align-items-center gap-3">
                         <span className="badge bg-secondary rounded-pill">{item.cantidad}</span>
                         <span className="fw-semibold">{item.producto?.nombre}</span>
                      </div>
                      <span className="text-success">${(precio * item.cantidad).toLocaleString()}</span>
                    </li>
                  );
              })}
            </ul>
            
            <div className="d-flex justify-content-between fw-bold fs-4 text-white border-top border-secondary pt-3">
              <span>Total a Pagar</span>
              <span className="text-success">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}