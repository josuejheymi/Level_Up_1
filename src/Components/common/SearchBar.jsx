// SearchBar.jsx - Versión mejorada
import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch && query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        
        // Búsqueda en tiempo real
        if (onSearch) {
            onSearch(value.trim());
        }
    };

    const handleClear = () => {
        setQuery("");
        if (onSearch) {
            onSearch(""); // Limpiar búsqueda
        }
    };

    return (
        <form className="d-flex align-items-center" onSubmit={handleSubmit}>
            <div className="input-group">
                <input
                    className="form-control"
                    type="search"
                    placeholder="Buscar productos..."
                    value={query}
                    onChange={handleChange}
                />
                {/* Botón para limpiar búsqueda */}
                {query && (
                    <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={handleClear}
                    >
                        ✕
                    </button>
                )}
                <button className="btn btn-outline-light" type="submit">
                    🔍
                </button>
            </div>
        </form>
    );
}