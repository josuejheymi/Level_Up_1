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
  
  // 1. ESTADO INICIAL SEGURO: Siempre tiene items como array vacío
  const [cart, setCart] = useState({ items: [], total: 0 });

  // 2. USO DE USECALLBACK:
  // Esto arregla el warning del useEffect. Memoriza la función para que no cambie en cada render.
  const refreshCart = useCallback(async () => {
    // Si no hay usuario logueado o no tiene ID, limpiamos el carrito y salimos
    if (!user?.id) {
      setCart({ items: [], total: 0 });
      return;
    }

    try {
      const response = await api.get(`/carrito/${user.id}`);
      const data = response.data;
      
      // BLINDAJE: Si el backend devuelve null o undefined, forzamos un array vacío
      setCart({
        ...data,
        items: Array.isArray(data?.items) ? data.items : [], 
        total: data?.total || 0
      });
    } catch (error) {
      console.error("Error cargando carrito:", error);
      // En caso de error, volvemos al estado seguro
      setCart({ items: [], total: 0 });
    }
  }, [user]); // Solo se recrea si cambia el usuario

  // 3. EFECTO CONTROLADO
  // Ahora es seguro poner refreshCart en las dependencias
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // 4. FUNCIÓN ADD TO CART
  const addToCart = async (product, cantidad = 1) => {
    if (!user) {
      alert("Por favor, inicia sesión para comprar.");
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

      // BLINDAJE AL ACTUALIZAR
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

  // 5. CÁLCULO DE TOTAL ITEMS (EL ERROR ESTABA AQUÍ)
  // Creamos una variable auxiliar segura antes de hacer el reduce
  const safeItems = Array.isArray(cart?.items) ? cart.items : [];
  
  const totalItems = safeItems.reduce((acc, item) => {
    // Protección extra: asegurarse de que item y item.cantidad existen
    const cantidad = item?.cantidad || 0;
    return acc + cantidad;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, refreshCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};