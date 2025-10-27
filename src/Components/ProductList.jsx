import ProductCard from "./ProductCard";
export default function ProductList({ products }) {
    return (
        <div className="container my-5">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map((product) => (
                    <div className="col" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
}