import ProductCard from "./ProductCard";

// Componente que muestra una lista de productos en grid responsive
export default function ProductList({ products }) {
    return (
        <div className="container my-5">
            {/* Grid: 1 columna en móvil, 3 en desktop con espacio entre elementos */}
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map((product) => (
                    // Columna con key única para cada producto
                    <div className="col" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}