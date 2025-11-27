import { useState } from "react";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");

    // Maneja el envío con Enter o botón Lupa
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query.trim());
        }
    };

    // Búsqueda en tiempo real mientras escribes
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        
        if (onSearch) {
            onSearch(value); // Enviamos el valor tal cual para que filtre mientras escribes
        }
    };

    // Limpiar búsqueda
    const handleClear = () => {
        setQuery("");
        if (onSearch) {
            onSearch(""); // Resetea el filtro global
        }
    };

    return (
        <form className="d-flex w-100" onSubmit={handleSubmit}>
            <div className="input-group">
                <input
                    className="form-control border-0"
                    type="search"
                    placeholder="Buscar productos..."
                    aria-label="Buscar"
                    value={query}
                    onChange={handleChange}
                    style={{ paddingRight: "40px" }} // Espacio para la X
                />
                
                {/* Botón X para limpiar (aparece solo si hay texto) */}
                {query && (
                    <button 
                        type="button" 
                        className="btn bg-white border-0 text-secondary"
                        style={{ 
                            position: "absolute", 
                            right: "50px", 
                            zIndex: 5,
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                        onClick={handleClear}
                    >
                        ✕
                    </button>
                )}

                <button 
                    className="btn btn-primary" 
                    type="submit"
                    style={{ zIndex: 4 }}
                >
                    🔍
                </button>
            </div>
        </form>
    );
}