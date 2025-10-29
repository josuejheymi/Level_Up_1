// Aun esta en proceso-Posteriormente -> Realizara búsquedas en tiempo real y buscara al presionar enter
import { useState } from "react";

// Componente de búsqueda que puede buscar al escribir o al enviar formulario
export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState(""); // Estado del texto de búsqueda

    // Maneja el envío del formulario (Enter o clic en botón)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(query.trim().toLowerCase()); // ✅ llamada segura
    };

    return (
        <form className="d-flex" onSubmit={handleSubmit}>
            <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar productos..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value); // Actualiza estado
                    // Búsqueda en tiempo real mientras escribe
                    if (onSearch) onSearch(e.target.value.trim().toLowerCase()); // ✅ protección
                }}
            />
            <button className="btn btn-outline-light" type="submit">
                🔍
            </button>
        </form>
    );
}