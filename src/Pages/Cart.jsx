import React from "react";
import { useCart } from "../Components/cart/CartContext";

export default function Cart() {
  const { cart } = useCart();

  // Validación de seguridad: Si no hay items, muestra mensaje
  if (!cart?.items || cart.items.length === 0) {
    return <div className="container mt-5"><h3>Tu carrito está vacío</h3></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Tu Carrito de Compras</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {/* PROTECCIÓN: (cart.items || []).map */}
          {(cart.items || []).map((item) => (
            <tr key={item.id}>
              {/* Usamos ?. por si acaso el producto viene null */}
              <td>{item.producto?.nombre || "Producto desconocido"}</td>
              <td>${item.precioUnitario?.toLocaleString()}</td>
              <td>{item.cantidad}</td>
              <td>${(item.precioUnitario * item.cantidad).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-end mt-4">
        <div className="card p-3" style={{ width: "300px" }}>
          <h4>Total a Pagar:</h4>
          {/* Protección para cart.total */}
          <h2 className="text-primary">${(cart.total || 0).toLocaleString()}</h2>
        </div>
      </div>
    </div>
  );
}