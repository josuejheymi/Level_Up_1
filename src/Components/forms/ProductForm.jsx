// Importando lógica separada para pruebas y mantenimiento
import "../forms/ProductForm.logic.js";
import { useState } from "react";

// Componente formulario para agregar nuevos productos
export default function ProductForm({ onAddProduct }) {
    // Estados para cada campo del formulario
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita recarga de página

        // Usa la lógica externa para crear el producto
        const newProduct = window.ProductFormLogic.createProduct(
            nombre, categoria, precio, imagen, descripcion
        );

        // Si el producto es válido, lo agrega y limpia el formulario
        if (newProduct) {
            onAddProduct(newProduct); // Callback al componente padre
            // Limpia todos los campos usando la lógica externa
            window.ProductFormLogic.resetForm(
                setNombre, setCategoria, setPrecio, setImagen, setDescripcion
            );
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campo Nombre */}
            <div>
                <label>Nombre:</label>
                <input 
                    type="text" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    required 
                />
            </div>

            {/* Campo Categoría */}
            <div>
                <label>Categoría:</label>
                <input 
                    type="text" 
                    value={categoria} 
                    onChange={(e) => setCategoria(e.target.value)} 
                    required 
                />
            </div>

            {/* Campo Precio */}
            <div>
                <label>Precio:</label>
                <input 
                    type="number" 
                    value={precio} 
                    onChange={(e) => setPrecio(e.target.value)} 
                    required 
                />
            </div>

            {/* Campo Imagen (URL) */}
            <div>
                <label>Imagen (URL):</label>
                <input 
                    type="text" 
                    value={imagen} 
                    onChange={(e) => setImagen(e.target.value)} 
                    required 
                />
            </div>

            {/* Campo Descripción */}
            <div>
                <label>Descripción:</label>
                <textarea 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    required
                ></textarea>
            </div>

            {/* Botón de envío */}
            <button type="submit">Agregar Producto</button>
        </form>
    );
}