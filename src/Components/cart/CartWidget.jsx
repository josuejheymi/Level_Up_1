//Obtiene datos, calcula y muestra el número total de productos en el carrito de compras.
// Importamos las herramientas necesarias de React
import React, { useEffect, useState } from "react";
// Importamos nuestro hook personalizado para acceder al carrito
import { useCart } from "../cart/CartContext";

// Este componente muestra un icono de carrito con un contador de productos
export default function CartWidget() {
    // Obtenemos los items del carrito desde nuestro contexto global
    // cartItems es un array de objetos: [{id, name, quantity, price}, ...]
    const { cartItems } = useCart();

    // Creamos un estado local para almacenar el total de productos en el carrito
    // cartCount guarda el número total, setCartCount es la función para actualizarlo
    const [cartCount, setCartCount] = useState(0);

    // useEffect se ejecuta cuando el componente se monta y cuando cartItems cambia
    useEffect(() => {
        // Calculamos la suma total de todas las cantidades de productos
        // reduce() recorre cada item y acumula la suma de las quantities
        const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // Actualizamos el estado con el nuevo total calculado
        setCartCount(total);
    }, [cartItems]); // <- Este efecto se ejecuta cada vez que cartItems cambie

    // Renderizamos el componente
    return (
        // Contenedor principal con posición relativa para posicionar el badge
        <div className="position-relative">
            {/* Icono del carrito de Bootstrap */}
            <i className="bi bi-cart4 fs-4"></i>

            {/* Mostramos el badge solo si hay productos en el carrito */}
            {cartCount > 0 && (
                // Badge posicionado en la esquina superior derecha del icono
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {/* Mostramos el número total de productos */}
                    {cartCount}
                    {/* Texto oculto para accesibilidad (lectores de pantalla) */}
                    <span className="visually-hidden">items en el carrito</span>
                </span>
            )}
        </div>
    );
}