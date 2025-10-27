import { useState } from "react";
export default function ProductForm({ onAddProduct }) {
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState("");
    const [descripcion, setDescripcion] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            id: Date.now(),
            nombre,
            categoria,
            precio: parseFloat(precio),
            imagen,
            descripcion
        };
        onAddProduct(newProduct);
        setNombre("");
        setCategoria("");
        setPrecio("");
        setImagen("");
        setDescripcion("");
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
                <label>Categoría:</label>
                <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
            </div>
            <div>
                <label>Precio:</label>
                <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
            </div>
            <div>
                <label>Imagen (URL):</label>
                <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} required />
            </div>
            <div>
                <label>Descripción:</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
            </div>
            <button type="submit">Agregar Producto</button>
        </form>
    );
}