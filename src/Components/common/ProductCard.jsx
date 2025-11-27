import { useCart } from "../cart/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="card h-100">
            {/* CAMBIO IMPORTANTE: product.imagenUrl */}
            <img
                src={product.imagenUrl} 
                className="card-img-top"
                alt={product.nombre}
                style={{ objectFit: "contain", height: "200px" }} // Un tip de estilo extra
            />

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.nombre}</h5>
                <p className="card-text flex-grow-1">{product.descripcion}</p>

                <div className="mt-auto">
                    <p className="card-text">
                        <strong>Precio:</strong> ${product.precio?.toLocaleString()}
                    </p>

                    <button
                        className="btn btn-primary w-100"
                        onClick={() => addToCart(product)}
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
}