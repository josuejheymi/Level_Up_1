import React, { useState, useEffect } from "react";
import { useProducts } from "../products/ProductContext"; 
import api from "../../config/api"; 
import { useNavigate } from "react-router-dom"; 

/**
 * COMPONENTE: FORMULARIO DE PRODUCTO (CRUD)
 * ----------------------------------------------------------------------
 * Responsabilidad: Gestionar la Creación (Create) y Edición (Update) de productos.
 * * PATRONES DE DISEÑO UTILIZADOS:
 * 1. Componente Dual: Se comporta diferente si recibe la prop 'productToEdit' (Modo Edición)
 * o si no la recibe (Modo Creación).
 * 2. Componente Controlado: React es la "fuente de la verdad". Los inputs no guardan su propio
 * valor, sino que reflejan el estado (state) del componente.
 * 3. Validación de Tipos: Convierte strings de HTML a números (Integer/Float) para el Backend Java.
 */
export default function ProductForm({ productToEdit, onSuccess }) {
  
  // -------------------------------------------------------------------
  // 1. HOOKS DE CONTEXTO Y NAVEGACIÓN
  // -------------------------------------------------------------------
  const { addProduct, updateProduct } = useProducts(); // Funciones globales del contexto
  const navigate = useNavigate(); // Hook para redirigir al usuario programáticamente
  
  // -------------------------------------------------------------------
  // 2. ESTADOS LOCALES (State)
  // -------------------------------------------------------------------
  
  // Almacena las categorías traídas desde la API para llenar el <select>
  const [categories, setCategories] = useState([]);
  
  // Controla el mensaje de feedback visual (Éxito o Error)
  const [mensaje, setMensaje] = useState("");

  // Estado Único del Formulario: Agrupamos todos los campos en un solo objeto.
  // Inicializamos con valores "falsy" (vacíos o 0) para evitar warnings de React.
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "", 
    imagenUrl: "",
    videoUrl: "",
  });
  
  // -------------------------------------------------------------------
  // 3. EFECTOS (Side Effects / Ciclo de Vida)
  // -------------------------------------------------------------------

  /**
   * EFECTO 1: Cargar Categorías
   * Dependencia []: Se ejecuta solo una vez cuando el componente se monta.
   * Objetivo: Llenar el dropdown de categorías con datos reales del backend.
   */
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categorias');
            setCategories(res.data);
        } catch (error) {
            console.error("Error crítico cargando categorías:", error);
        }
    };
    fetchCategories();
  }, []); 

  /**
   * EFECTO 2: Inicialización del Formulario
   * Dependencia [productToEdit]: Se ejecuta cada vez que cambia el producto a editar.
   * Objetivo: Si estamos editando, rellenar los campos. Si no, limpiarlos.
   */
  useEffect(() => {
    if (productToEdit) {
      // MODO EDICIÓN: Copiamos los datos del producto al estado del formulario
      setFormData({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        // Optional Chaining (?.): Evita error si el producto no tiene categoría asignada
        categoria: productToEdit.categoria?.nombre || "", 
        imagenUrl: productToEdit.imagenUrl,
        videoUrl: productToEdit.videoUrl || "",
      });
    } else {
      // MODO CREACIÓN: Reseteamos el formulario a sus valores iniciales
      setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "", imagenUrl: "", videoUrl: "" });
    }
  }, [productToEdit]);
  
  // -------------------------------------------------------------------
  // 4. HANDLERS (Lógica de Negocio)
  // -------------------------------------------------------------------

  /**
   * Maneja los cambios en cualquier input del formulario.
   * Realiza la conversión de tipos necesaria para el Backend.
   * @param {Event} e - Evento del DOM
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let finalValue = value;

    // LÓGICA DE CASTING (Conversión de Tipos):
    // Los inputs HTML siempre devuelven texto (String). Java espera números.
    if (name === 'precio' || name === 'stock') {
        // Si está vacío, guardamos 0. Si no, convertimos.
        // parseInt: Para stock (enteros). parseFloat: Para precio (decimales).
        finalValue = value === '' ? 0 : (name === 'stock' ? parseInt(value, 10) : parseFloat(value));
        
        // Validación de seguridad: Si el usuario escribe algo inválido (NaN), forzamos 0.
        if (isNaN(finalValue)) finalValue = 0;
    }
    
    // Spread Operator (...formData): "Mantén todos los campos anteriores igual,
    // y sobrescribe solo el campo que cambió ([name]) con el nuevo valor."
    setFormData({ ...formData, [name]: finalValue });
  };

  /**
   * Maneja el envío del formulario al servidor.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga completa de la página
    setMensaje("");     // Limpia mensajes anteriores

    // Validación manual de Categoría
    if (!formData.categoria) {
      setMensaje(" Por favor, selecciona una categoría.");
      return;
    }

    let result;

    // Determinamos qué acción ejecutar según el modo
    if (productToEdit) {
        result = await updateProduct(productToEdit.id, formData); 
    } else {
        result = await addProduct(formData);
    }
    
    // Manejo de Respuesta
    if (result.success) {
      setMensaje("SUCCESS"); // Bandera para mostrar la alerta verde
      
      // Si creamos un producto nuevo, limpiamos el form para permitir ingresar otro rápidamente
      if (!productToEdit) {
          setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "", imagenUrl: "", videoUrl: "" });
      }

      // Ejecutamos el callback 'onSuccess' (ej: cerrar modal) después de 1.5s
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }

    } else {
      console.error("Error backend:", result.error);
      setMensaje("ERROR"); // Bandera para mostrar la alerta roja
    }
  };

  // -------------------------------------------------------------------
  // 5. RENDERIZADO (JSX)
  // -------------------------------------------------------------------
  return (
    <div className="card p-4 border border-secondary bg-dark shadow text-white">
      
      {/* Título Dinámico */}
      <h4 className="mb-4 fw-bold text-primary">
        {productToEdit ? "Editar Producto" : "Nuevo Producto"}
      </h4>
      
      {/* ALERTA DE ESTADO (Renderizado Condicional) */}
      {mensaje && (
        <div className={`alert fw-bold d-flex align-items-center gap-2 ${
          mensaje === "SUCCESS" ? "alert-success" : "alert-danger"
        }`}>
          
          {mensaje === "SUCCESS" ? (
            <>
              {/* Icono Check SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 10 8 14 16 4" />
              </svg>
              <span>{productToEdit ? "Producto actualizado" : "Producto creado"}</span>
            </>
          ) : (
            <>
              {/* Icono X SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="5" x2="15" y2="15" />
                <line x1="15" y1="5" x2="5" y2="15" />
              </svg>
              <span>Error: No se pudo procesar la solicitud</span>
            </>
          )}

        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* CAMPO: NOMBRE */}
        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">NOMBRE</label>
          <input 
            type="text" 
            className="form-control bg-black text-white border-secondary" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* CAMPO: DESCRIPCIÓN */}
        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">DESCRIPCIÓN</label>
          <textarea 
            className="form-control bg-black text-white border-secondary" 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange} 
            required 
            rows="3" 
          />
        </div>

        {/* CAMPOS: PRECIO Y STOCK (Agrupados en fila) */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label text-secondary small fw-bold">PRECIO</label>
            <div className="input-group">
                <span className="input-group-text bg-secondary border-secondary text-white">$</span>
                <input 
                    type="number" 
                    className="form-control bg-black text-white border-secondary" 
                    name="precio" 
                    value={formData.precio} 
                    onChange={handleChange} 
                    required 
                    min="0" 
                />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label text-secondary small fw-bold">STOCK</label>
            <input 
                type="number" 
                className="form-control bg-black text-white border-secondary" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                required 
                min="0" 
            />
          </div>
        </div>

        {/* CAMPO: CATEGORÍA (Dropdown Select) */}
        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">CATEGORÍA</label>
          <div className="input-group">
            <select 
                className="form-select bg-black text-white border-secondary" 
                name="categoria" 
                value={formData.categoria} 
                onChange={handleChange} 
                required
            >
                <option value="" disabled>-- Selecciona --</option>
                {/* Mapeo de Categorías: Transformamos el array de datos en opciones HTML */}
                {categories.map(cat => (
                    <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                    </option>
                ))}
            </select>

            {/* Botón de Acceso Rápido a Crear Categoría */}
            <button 
                type="button" 
                className="btn btn-outline-light" 
                onClick={() => {
                    onSuccess(); // Cierra el modal actual
                    navigate('/admin?tab=categories'); // Navega a la gestión de categorías
                }}
                title="Ir a gestionar categorías"
            >
                ＋
            </button>
          </div>
        </div>
        
        {/* CAMPO: URL IMAGEN */}
        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">URL IMAGEN</label>
          <input 
            type="text" 
            className="form-control bg-black text-white border-secondary" 
            name="imagenUrl" 
            value={formData.imagenUrl} 
            onChange={handleChange} 
            placeholder="https://..." 
            required 
          />

          {/* Previsualización de Imagen (Renderizado Condicional) */}
          {formData.imagenUrl && (
              <div className="mt-2 text-center p-2 bg-black border border-secondary rounded">
                  <img 
                    src={formData.imagenUrl} 
                    alt="Previsualización" 
                    style={{height: '100px', objectFit: 'contain'}} 
                    onError={(e) => e.target.style.display = 'none'} // Oculta imagen si URL es inválida
                  />
              </div>
          )}
        </div>
        
        {/* CAMPO: VIDEO (Opcional) */}
        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">VIDEO YOUTUBE (Opcional)</label>
          <input 
            type="url" 
            className="form-control bg-black text-white border-secondary" 
            name="videoUrl" 
            value={formData.videoUrl} 
            onChange={handleChange} 
            placeholder="https://www.youtube.com/embed/..." 
          />
        </div>

        <button type="submit" className="btn btn-success w-100 fw-bold py-2 mt-3 shadow-sm hover-scale">
          {productToEdit ? "Guardar Cambios" : "Guardar Producto"}
        </button>
      </form>
    </div>
  );
}