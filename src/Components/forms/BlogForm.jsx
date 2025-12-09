import React, { useState } from "react";
import { useBlog } from "../blog/BlogContext";
import { useUser } from "../user/UserContext";

/**
 * Componente: Formulario de Blog
 * Responsabilidad: Recopilar datos para crear una nueva noticia.
 * * Concepto Clave: Manejo de Estado de Objeto.
 * En lugar de tener 4 variables useState separadas (titulo, contenido, etc.),
 * usamos un solo objeto 'formData' que agrupa todo. Es más limpio.
 */
export default function BlogForm({ onSuccess }) {
  // 1. HOOKS DE CONTEXTO
  const { addPost } = useBlog(); // Función del contexto para enviar a la API
  const { user } = useUser();    // Obtenemos el usuario para firmar la noticia como Autor

  // 2. ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    imagenUrl: "",
    autor: user?.nombre || "Admin" // Valor por defecto si no hay nombre
  });

  // Estado de carga local (UX: Evitar doble click)
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * HANDLER: Envío del Formulario
   * Se ejecuta al presionar "Publicar Noticia".
   */
  const handleSubmit = async (e) => {
    // A. Prevenir comportamiento nativo (Recarga de página)
    e.preventDefault();
    
    setIsSubmitting(true); // Bloqueamos el botón

    // B. Llamada Asíncrona al Contexto
    // Esperamos a que el servidor responda antes de limpiar el formulario.
    const result = await addPost(formData);
    
    if (result.success) {
      alert("✅ Noticia publicada con éxito");
      
      // C. Resetear Formulario (Limpiar campos)
      setFormData({ 
        titulo: "", 
        contenido: "", 
        imagenUrl: "", 
        autor: user?.nombre || "Admin" 
      });
      
      // D. Callback de éxito (ej: para cerrar el formulario en el padre)
      if (onSuccess) onSuccess();
    } else {
      alert("❌ Error al publicar: " + (result.error || "Intente nuevamente"));
    }

    setIsSubmitting(false); // Desbloqueamos el botón
  };

  /**
   * HANDLER GENÉRICO DE CAMBIOS (Opcional, pero muy pro)
   * Actualiza cualquier campo dinámicamente.
   */
  const handleChange = (e) => {
      const { name, value } = e.target;
      // Spread Operator (...formData): "Copia todo lo que había antes, y sobrescribe solo este campo"
      setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="card p-4 border border-secondary bg-dark shadow text-white">
      <h4 className="mb-3 fw-bold text-primary">Redactar Noticia</h4>
      
      <form onSubmit={handleSubmit}>
        
        {/* CAMPO: TÍTULO */}
        <div className="mb-3">
          <label className="form-label fw-bold text-secondary small">TÍTULO</label>
          <input 
            type="text" 
            className="form-control bg-black text-white border-secondary" 
            required 
            name="titulo" // Importante para el handleChange
            value={formData.titulo} 
            onChange={handleChange}
            placeholder="Ej: Nuevo lanzamiento de consola..."
          />
        </div>

        {/* CAMPO: CONTENIDO */}
        <div className="mb-3">
          <label className="form-label fw-bold text-secondary small">CONTENIDO</label>
          <textarea 
            className="form-control bg-black text-white border-secondary" 
            rows="5" 
            required 
            name="contenido"
            value={formData.contenido} 
            onChange={handleChange}
            placeholder="Escribe el cuerpo de la noticia aquí..."
          />
        </div>

        {/* CAMPO: URL IMAGEN */}
        <div className="mb-3">
          <label className="form-label fw-bold text-secondary small">URL IMAGEN</label>
          <input 
            type="url" 
            className="form-control bg-black text-white border-secondary" 
            required 
            name="imagenUrl"
            value={formData.imagenUrl} 
            onChange={handleChange} 
            placeholder="https://i.imgur.com/..."
          />
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <button 
            className="btn btn-success w-100 fw-bold py-2 mt-2" 
            disabled={isSubmitting} // Deshabilitado si está enviando
        >
            {isSubmitting ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Publicando...</span>
            ) : (
                " Publicar Noticia"
            )}
        </button>
      </form>
    </div>
  );
}