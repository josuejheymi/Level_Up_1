// src/utils/ProductForm.logic.js
// Lógica pura para ProductForm, separando los handlers y funciones internas

// Exportamos al objeto global para que sea accesible desde el componente
window.ProductFormLogic = {

    // Función para crear un nuevo producto con validación
    createProduct: function (nombre, categoria, precio, imagen, descripcion) {
        // Validación: todos los campos son requeridos
        if (!nombre || !categoria || !precio || !imagen || !descripcion) {
            return null; // retorna null si algún campo está vacío
        }

        // Retorna objeto producto con estructura definida
        return {
            id: Date.now(), // ID único basado en timestamp
            nombre,
            categoria,
            precio: parseFloat(precio), // Convierte string a número
            imagen,
            descripcion
        };
    },

    // Función para limpiar todos los campos del formulario
    resetForm: function (setNombre, setCategoria, setPrecio, setImagen, setDescripcion) {
        setNombre("");
        setCategoria("");
        setPrecio("");
        setImagen("");
        setDescripcion("");
    }
};