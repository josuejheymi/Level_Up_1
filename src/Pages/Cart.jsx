import { useCart } from "../Components/cart/CartContext";

export default function Cart() {
    // Obtiene los items del carrito y funciones del contexto
    const { cartItems, removeFromCart, clearCart } = useCart();

    // Calcula el total sumando precio * cantidad de cada item
    const total = cartItems.reduce(
        (sum, item) => sum + item.precio * item.quantity,
        0
    );

    return (
        <div className="container mt-4">
            <h2>Tu carrito</h2>

            {/* Si el carrito está vacío */}
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                /* Si hay productos en el carrito */
                <>
                    {/* Lista de productos en el carrito */}
                    <ul className="list-group">
                        {cartItems.map((item) => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {/* Información del producto */}
                                <div>
                                    <h5>{item.nombre}</h5>
                                    <p>Cantidad: {item.quantity}</p>
                                    <p>Precio unitario: ${item.precio.toLocaleString()}</p>
                                    <p>Subtotal: ${(item.precio * item.quantity).toLocaleString()}</p>
                                </div>

                                {/* Botón para eliminar producto */}
                                <button
                                    className="btn btn-danger"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Resumen y acciones del carrito */}
                    <div className="mt-3">
                        <h4>Total: ${total.toLocaleString()}</h4>
                        <button className="btn btn-secondary" onClick={clearCart}>
                            Vaciar carrito
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}