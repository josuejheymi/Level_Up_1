// Este archivo define el componente ProductCard, 
// que muestra la información de un producto individual y permite agregarlo al carrito de compras.

// Importamos el hook para acceder al contexto del carrito
import { useCart } from "../cart/CartContext";

// Este componente muestra una tarjeta individual de producto
// Recibe como prop un objeto 'product' con toda la información del producto
export default function ProductCard({ product }) {
    // Obtenemos la función addToCart del contexto del carrito
    // Esta función permite agregar productos al carrito
    const { addToCart } = useCart();

    // Renderizamos la tarjeta del producto
    return (
        // Contenedor principal de la tarjeta con clases de Bootstrap
        // 'h-100' hace que todas las tarjetas tengan la misma altura
        <div className="card h-100">

            {/* Imagen del producto */}
            <img
                src={product.imagen}  // URL de la imagen del producto
                className="card-img-top"  // Clase para estilo de imagen superior
                alt={product.nombre}  // Texto alternativo para accesibilidad
            />

            {/* Cuerpo de la tarjeta - contenido textual */}
            <div className="card-body d-flex flex-column">

                {/* Nombre del producto */}
                <h5 className="card-title">{product.nombre}</h5>

                {/* Descripción del producto */}
                {/* 'flex-grow-1' hace que la descripción ocupe el espacio disponible */}
                <p className="card-text flex-grow-1">{product.descripcion}</p>

                {/* Sección inferior de la tarjeta (precio y botón) */}
                {/* 'mt-auto' empuja este contenido hacia abajo */}
                <div className="mt-auto">

                    {/* Precio del producto formateado con separadores de miles */}
                    <p className="card-text">
                        <strong>Precio:</strong> ${product.precio.toLocaleString()}
                    </p>

                    {/* Botón para agregar al carrito */}
                    <button
                        className="btn btn-primary w-100"  // Botón azul que ocupa todo el ancho
                        onClick={() => addToCart(product)}  // Al hacer clic, agrega el producto al carrito
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
}