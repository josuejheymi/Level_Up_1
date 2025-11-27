import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../config/api";
import { useUser } from "../user/UserContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  
  // 1. ESTADO INICIAL
  const [cart, setCart] = useState({ items: [], total: 0 });

  // 2. REFRESH CART
  const refreshCart = useCallback(async () => {
    if (!user?.id) {
      setCart({ items: [], total: 0 });
      return;
    }

    try {
      const response = await api.get(`/carrito/${user.id}`);
      const data = response.data;
      
      setCart({
        ...data,
        items: Array.isArray(data?.items) ? data.items : [], 
        total: data?.total || 0
      });
    } catch (error) {
      console.error("Error cargando carrito:", error);
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  // 3. EFECTO
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // 4. ADD TO CART
  const addToCart = async (product, cantidad = 1) => {
    if (!user) {
      alert("Por favor, inicia sesión para comprar.");
      return;
    }

    // Validación local de stock
    const itemEnCarrito = cart.items.find(item => item.producto.id === product.id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    if (cantidadActual + cantidad > product.stock) {
      alert(`⚠️ No puedes agregar más. Stock disponible: ${product.stock}`);
      return;
    }

    try {
      const payload = {
        usuarioId: user.id,
        productoId: product.id,
        cantidad: cantidad
      };

      const response = await api.post("/carrito/agregar", payload);
      const data = response.data;

      setCart({
        ...data,
        items: Array.isArray(data?.items) ? data.items : [],
        total: data?.total || 0
      });
      
      alert("Producto agregado correctamente");
    } catch (error) {
      console.error("Error al agregar:", error);
      alert(error.response?.data?.error || "Error al agregar al carrito");
    }
  };

  // 5. REMOVE FROM CART
  const removeFromCart = async (productId) => {
    if (!user?.id) return;
    try {
      const response = await api.delete(`/carrito/${user.id}/producto/${productId}`);
      const data = response.data;

      setCart({
        ...data,
        items: Array.isArray(data?.items) ? data.items : [],
        total: data?.total || 0
      });
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // 6. UPDATE QUANTITY
  const updateQuantity = async (productId, newQuantity) => {
    if (!user?.id) return;
    try {
      const response = await api.put(`/carrito/${user.id}/producto/${productId}`, null, {
        params: { cantidad: newQuantity }
      });
      const data = response.data;

      setCart({
        ...data,
        items: Array.isArray(data?.items) ? data.items : [],
        total: data?.total || 0
      });
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      alert(error.response?.data?.error || "No se pudo actualizar la cantidad");
    }
  };

  // 7. FUNCIÓN CHECKOUT (FINALIZAR COMPRA)
  const checkout = async () => {
    if (!user?.id) return { success: false, message: "Usuario no identificado" };

    try {
      const response = await api.post("/ordenes/checkout", { usuarioId: user.id });
      setCart({ items: [], total: 0 });
      return { success: true, orden: response.data };
    } catch (error) {
      console.error("Error en checkout:", error);
      
      // --- MAGIA PARA LEER EL ERROR REAL ---
      let msg = "Error al procesar la compra";
      
      if (error.response) {
          // Si el backend mandó un mensaje de texto plano
          if (typeof error.response.data === 'string') {
              msg = error.response.data;
          } 
          // Si mandó un objeto JSON (ej: { error: "Stock insuficiente" })
          else if (typeof error.response.data === 'object') {
              msg = error.response.data.error || error.response.data.message || JSON.stringify(error.response.data);
          }
      }
      
      return { success: false, message: msg };
    }
  };

  // 8. CÁLCULO DE TOTAL ITEMS (Solo una vez)
  const safeItems = Array.isArray(cart?.items) ? cart.items : [];
  const totalItems = safeItems.reduce((acc, item) => {
    const cantidad = item?.cantidad || 0;
    return acc + cantidad;
  }, 0);

  return (
    <CartContext.Provider value={{ 
        cart, 
        addToCart, 
        refreshCart, 
        totalItems,
        removeFromCart,
        updateQuantity,
        checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};