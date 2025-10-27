import ProductList from "../Components/ProductList";

export default function Home({ products }) {
    return (
        <section className="container my-5">
            <h1>Bienvenido</h1>
            <p>Tienda online de videojuegos, consolas, pc gamers y más . . .</p>
        <div>
            <h1>Productos en venta</h1>
            <ProductList products={products} />
        </div>
        </section>
    );
}
