import React, { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";

export default function CartWidget() {
    const { cartItems } = useCart(); // <- usamos cartItems del context
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Calculamos el total de items cada vez que cartItems cambie
        const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
    }, [cartItems]); // <- escuchamos cartItems

    return (
        <div className="position-relative">
            <i className="bi bi-cart4 fs-4"></i>
            {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                    <span className="visually-hidden">items en el carrito</span>
                </span>
            )}
        </div>
    );
}
