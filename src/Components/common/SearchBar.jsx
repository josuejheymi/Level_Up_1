import { useState } from "react";

/**
 * Componente: Barra de Búsqueda
 * Responsabilidad: Capturar lo que escribe el usuario y enviarlo al componente padre (Navbar).
 * * @param {Function} onSearch - Función que se ejecuta cada vez que el texto cambia o se envía.
 */
export default function SearchBar({ onSearch }) {
    // ESTADO LOCAL: Controla el texto del input.
    // Inicializamos con string vacío "" para evitar errores de 'uncontrolled input'.
    const [query, setQuery] = useState("");

    /**
     * HANDLER: Cambio en el Input (Real-time)
     * Se ejecuta cada vez que el usuario presiona una tecla.
     */
    const handleChange = (e) => {
        const newValue = e.target.value;
        
        // 1. Actualizamos el estado local (para que el input muestre la letra)
        setQuery(newValue);
        
        // 2. Comunicación Hijo -> Padre
        // Si el padre nos pasó la función 'onSearch', la ejecutamos con el nuevo valor.
        if (onSearch) {
            onSearch(newValue);
        }
    };

    /**
     * HANDLER: Envío del Formulario (Enter o Click en Lupa)
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML form)
        if (onSearch) {
            onSearch(query.trim()); // .trim() elimina espacios vacíos al inicio y final
        }
    };

    /**
     * HANDLER: Limpiar Búsqueda (Botón X)
     */
    const handleClear = () => {
        setQuery(""); // Borra el texto visualmente
        if (onSearch) {
            onSearch(""); // Avisa al padre que ya no hay filtro (vuelve a mostrar todo)
        }
    };

    return (
        <form className="d-flex w-100" onSubmit={handleSubmit}>
            {/* 'position-relative' es necesario para que el botón X se posicione dentro de este bloque */}
            <div className="input-group position-relative">
                
                {/* INPUT CONTROLADO */}
                <input
                    className="form-control border-0 shadow-none" // shadow-none quita el brillo azul de Bootstrap al hacer click
                    type="search"
                    placeholder="Buscar productos..."
                    aria-label="Buscar"
                    value={query}          // El valor lo dicta el Estado
                    onChange={handleChange} // El cambio actualiza el Estado
                    style={{ 
                        paddingRight: "40px", // Espacio reservado a la derecha para que el texto no tape la X
                        borderRadius: "50px 0 0 50px" // Bordes redondeados solo a la izquierda
                    }} 
                />
                
                {/* BOTÓN LIMPIAR (X) - Renderizado Condicional */}
                {/* Solo se muestra si 'query' tiene texto (es verdadero) */}
                {query && (
                    <button 
                        type="button" 
                        className="btn text-secondary border-0 bg-transparent p-0"
                        onClick={handleClear}
                        title="Limpiar búsqueda"
                        style={{ 
                            position: "absolute", 
                            right: "60px", // Ajustado para no chocar con la lupa
                            top: "50%",
                            transform: "translateY(-50%)", // Centrado vertical perfecto
                            zIndex: 10, // Asegura que esté por encima del input
                            fontWeight: "bold"
                        }}
                    >
                        ✕
                    </button>
                )}

                {/* BOTÓN BUSCAR (LUPA) */}
                <button 
  className="btn btn-primary px-4" 
  type="submit"
  style={{ 
    zIndex: 5,
    borderRadius: "0 50px 50px 0" 
  }}
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
  </svg>
</button>

            </div>
        </form>
    );
}