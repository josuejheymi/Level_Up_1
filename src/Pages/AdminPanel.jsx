// Su propósito es proporcionar una interfaz para que los administradores gestionen productos.
import ProductForm from "../Components/forms/ProductForm";
import ProductList from "../Components/common/ProductList";

// Componente del panel de administración para gestionar productos
export default function AdminPanel({ products, onAddProduct }) {
    return (
        <section className="container my-5">
            {/* Título principal del panel */}
            <h1>Panel de Administración</h1>

            {/* Sección para agregar nuevos productos */}
            <div className="mb-5">
                <h2>Agregar Nuevo Producto</h2>
                {/* Formulario que recibe la función para agregar productos */}
                <ProductForm onAddProduct={onAddProduct} />
            </div>

            {/* Sección para visualizar todos los productos */}
            <div>
                <h2>Lista de Productos</h2>
                {/* Lista que muestra los productos existentes */}
                <ProductList products={products} />
            </div>
        </section>
    );
}