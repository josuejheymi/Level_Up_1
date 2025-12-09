import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../config/api";
import { useUser } from "../user/UserContext";

// 1. CREACIÓN DEL CONTEXTO
// Almacén global para los datos del carrito.
const CartContext = createContext();

/**
 * 2. CUSTOM HOOK: useCart
 * Facilita el acceso al contexto y protege contra usos fuera del Provider.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

/**
 * 3. PROVIDER
 * Maneja toda la lógica de negocio del carrito: agregar, quitar, sumar totales y comprar.
 */
export const CartProvider = ({ children }) => {
  const { user } = useUser();
  
  // --- ESTADO PRINCIPAL ---
  // Guardamos la estructura exacta que devuelve el Backend (items + total)
  const [cart, setCart] = useState({ items: [], total: 0 });

  /**
   * FUNCIÓN: Actualizar Carrito (READ)
   * Obtiene el estado actual del carrito desde la base de datos.
   * * Concepto clave: useCallback
   * Memorizamos esta función para que no cambie en cada renderizado.
   * Esto evita bucles infinitos cuando la ponemos en el useEffect.
   */
  const refreshCart = useCallback(async () => {
    // Si no hay usuario, el carrito debe estar vacío (Seguridad visual)
    if (!user?.id) {
      setCart({ items: [], total: 0 });
      return;
    }

    try {
      const response = await api.get(`/carrito/${user.id}`);
      const data = response.data;
      
      // Validación defensiva: Aseguramos que items sea siempre un array
      setCart({
        ...data,
        items: Array.isArray(data?.items) ? data.items : [], 
        total: data?.total || 0
      });
    } catch (error) {
      console.error("Error sincronizando carrito:", error);
      // No reseteamos a cero aquí para evitar parpadeos si falla la red momentáneamente
    }
  }, [user]);

  /**
   * EFECTO: Sincronización Automática
   * Cada vez que cambia el usuario (login/logout) o carga la app, refrescamos el carrito.
   */
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  /**
   * ACCIÓN: Agregar al Carrito (CREATE)
   * Valida stock localmente antes de llamar al servidor para ahorrar peticiones.
   */
  const addToCart = async (product, cantidad = 1) => {
    if (!user) {
      alert(" >:V Por favor, inicia sesión para comprar.");
      return;
    }

    // 1. Verificamos si ya tenemos este producto en el carrito local
    const itemEnCarrito = cart.items.find(item => item.producto.id === product.id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    // 2. Validación de Stock (Frontend)
    if (cantidadActual + cantidad > product.stock) {
      alert(` :( Stock insuficiente. Disponible: ${product.stock}`);
      return;
    }

    try {
      const payload = {
        usuarioId: user.id,
        productoId: product.id,
        cantidad: cantidad
      };

      // 3. Enviamos al Backend
      const response = await api.post("/carrito/agregar", payload);
      const data = response.data;

      // 4. Actualizamos el estado con la respuesta del servidor (Fuente de verdad)
      setCart({
        ...data,
        items: Array.isArray(data?.items) ? data.items : [],
        total: data?.total || 0
      });
      
    } catch (error) {
      console.error("Error al agregar:", error);
      alert(error.response?.data?.error || "Error al agregar al carrito");
    }
  };

  /**
   * ACCIÓN: Eliminar Item (DELETE)
   */
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

  /**
   * ACCIÓN: Actualizar Cantidad (UPDATE)
   * Se usa para los botones (+) y (-) dentro del carrito.
   */
  const updateQuantity = async (productId, newQuantity) => {
    if (!user?.id) return;
    try {
      // Usamos PUT para modificar un recurso existente
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

  /**
   * UTILIDAD: Limpiar Carrito Local
   * Se usa después de un checkout exitoso para resetear la vista inmediatamente.
   */
  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  /**
   * PROCESO DE PAGO (CHECKOUT)
   * Coordina el envío de la orden y la limpieza del carrito.
   */
  const checkout = async (datosEnvio) => {
    if (!user?.id) return { success: false, message: "Usuario no identificado" };

    try {
      const payload = {
        usuarioId: user.id,
        ...datosEnvio // Esparce: { direccion, region, comuna }
      };

      const response = await api.post("/ordenes/checkout", payload);
      
      clearCart(); // Si tuvo éxito, limpiamos visualmente
      return { success: true, orden: response.data };

    } catch (error) {
      console.error("Error en checkout:", error);
      
      // Manejo robusto de errores para mostrar mensaje claro al usuario
      let msg = "Error al procesar la compra";
      if (error.response?.data) {
         msg = typeof error.response.data === 'string' 
               ? error.response.data 
               : (error.response.data.error || JSON.stringify(error.response.data));
      }
      return { success: false, message: msg };
    }
  };

  /**
   * ESTADO DERIVADO: Total de Items
   * Concepto: No necesitamos un state para esto.
   * Se calcula al vuelo (on-the-fly) cada vez que 'cart.items' cambia.
   * Usamos .reduce() para sumar todas las cantidades.
   */
  const safeItems = Array.isArray(cart?.items) ? cart.items : [];
  const totalItems = safeItems.reduce((acc, item) => acc + (item?.cantidad || 0), 0);

  // Exponemos las funciones y datos al resto de la app
  return (
    <CartContext.Provider value={{ 
        cart, 
        addToCart, 
        refreshCart, 
        totalItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};