import { useState } from "react";
import ProductList from "../Components/common/ProductList";

export default function Categoria({ products }) {
    const [selectedCategory, setSelectedCategory] = useState("todos");

    // Obtener categorías únicas de los productos
    const categories = ["todos", ...new Set(products.map(p => p.categoria))];

    // Filtrar productos por categoría seleccionada
    const filteredProducts = selectedCategory === "todos"
        ? products
        : products.filter(product => product.categoria === selectedCategory);

    return (
        <div className="container mt-4">
            <h1>Productos por Categoría</h1>

            {/* Submenú de categorías - estilo horizontal */}
            <div className="mb-4">
                <nav className="nav nav-pills justify-content-center">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`nav-link ${selectedCategory === category ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === "todos" ? "Todos los Productos" :
                                category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Información de la categoría seleccionada */}
            <div className="mb-3">
                <h3>
                    {selectedCategory === "todos"
                        ? "Todos los productos"
                        : `Categoría: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
                    }
                    <span className="badge bg-secondary ms-2">
                        {filteredProducts.length} productos
                    </span>
                </h3>
            </div>

            {/* Lista de productos filtrados */}
            <ProductList products={filteredProducts} />
        </div>
    );
}