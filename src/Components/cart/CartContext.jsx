//Context API para manejar el estado del carrito de compras, permite agregar/remover productos globalmente.
import { createContext, useContext, useState, useEffect } from "react";

// Creamos un contexto para el carrito de compras
// Un contexto nos permite compartir datos entre componentes sin tener que pasar props manualmente.
const CartContext = createContext();

// Creamos un proveedor de contexto que envolverá nuestra app o parte de ella
// Esto permite que cualquier componente dentro pueda acceder a la información del carrito
export const CartProvider = ({ children }) => {
    // Estado para los productos del carrito
    // Se inicializa desde localStorage si hay datos guardados, sino empieza como arreglo vacío
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // useEffect se ejecuta cada vez que 'cartItems' cambia
    // Guarda los cambios del carrito en localStorage para que persistan al recargar la página
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Función para agregar un producto al carrito
    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Verificamos si el producto ya está en el carrito
            const existingItem = prevItems.find((item) => item.id === product.id);

            if (existingItem) {
                // Si ya está, solo aumentamos la cantidad
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Si no está, lo agregamos con cantidad inicial 1
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    // Función para eliminar un producto del carrito por su id
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    };

    // Función para vaciar completamente el carrito
    const clearCart = () => {
        setCartItems([]);
    };

    // Retornamos el proveedor con todas las funciones y el estado disponibles
    // 'children' representa los componentes hijos que estarán dentro del proveedor
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el contexto de carrito en cualquier componente
// Esto nos permite hacer: const { cartItems, addToCart } = useCart();
export const useCart = () => useContext(CartContext);
