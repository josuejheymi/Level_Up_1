import ProductForm from "../Components/ProductForm";
import ProductList from "../Components/ProductList";
export default function AdminPanel({ products, onAddProduct }) {
    return (
        <section className="container my-5">
            <h1>Panel de Administración</h1>
            <div className="mb-5">
                <h2>Agregar Nuevo Producto</h2>
                <ProductForm onAddProduct={onAddProduct} />
            </div>
            <div>
                <h2>Lista de Productos</h2>
                <ProductList products={products} />
            </div>
        </section>
    );
}