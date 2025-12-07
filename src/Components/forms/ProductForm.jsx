import React, { useState, useEffect } from "react";
import { useProducts } from "../products/ProductContext"; 
import api from "../../config/api"; // Necesario para la nueva API de categorías
import { useNavigate } from "react-router-dom"; // Hook para la navegación

export default function ProductForm({ productToEdit, onSuccess }) {
  const { addProduct, updateProduct } = useProducts();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: productToEdit?.categoria?.nombre || "", 
    imagenUrl: productToEdit?.imagenUrl || "",
    videoUrl: productToEdit?.videoUrl || "",
  });
  
  // ====================================================================
  // 1. CARGA INICIAL DE CATEGORÍAS (desde la API)
  // ====================================================================
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categorias');
            setCategories(res.data); // Guarda la lista de objetos Categoria
        } catch (error) {
            console.error("Error al cargar categorías para el formulario:", error);
        }
    };
    fetchCategories();
  }, []); 

  // 2. DETECTAR MODO EDICIÓN 
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        categoria: productToEdit.categoria?.nombre || "", 
        imagenUrl: productToEdit.imagenUrl,
        videoUrl: productToEdit.videoUrl || "",
      });
    } else {
      setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "", imagenUrl: "", videoUrl: "" });
    }
  }, [productToEdit]);
  
  // 🚨 CORRECCIÓN CLAVE: CONVERSIÓN DE TIPO DE DATOS 🚨
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let finalValue = value;

    // Si el campo es precio o stock, lo convertimos de String a Number
    if (name === 'precio' || name === 'stock') {
        // Usamos parseFloat para precio (puede tener decimales) y parseInt para stock (entero)
        // CRÍTICO: Si el valor es vacío (''), lo forzamos a 0 para evitar que el Backend reciba String y falle el cast a Number.
        finalValue = value === '' ? 0 : parseFloat(value); 
        
        // Manejo específico de stock como entero
        if (name === 'stock') {
            finalValue = value === '' ? 0 : parseInt(value, 10);
        }
        
        // Si la conversión resulta en NaN (ej: alguien teclea "abc"), lo forzamos a 0
        if (isNaN(finalValue)) finalValue = 0;
    }
    
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); 

    if (!formData.categoria) {
      setMensaje("❌ Debe seleccionar una categoría.");
      return;
    }

    let result;

    // Nota: El formData ya contiene los valores 'precio' y 'stock' como números (gracias al handleChange corregido)
    if (productToEdit) {
        result = await updateProduct(productToEdit.id, formData); 
    } else {
        result = await addProduct(formData);
    }
    
    if (result.success) {
      setMensaje(productToEdit ? "✅ Producto actualizado correctamente" : "✅ Producto creado exitosamente");
      
      if (!productToEdit) {
          setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "", imagenUrl: "", videoUrl: "" });
      }

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }

    } else {
      console.error("Error:", result.error);
      // Muestra el mensaje de error específico del Backend para debug
      setMensaje("❌ Error al guardar: " + (result.error.response?.data || result.error.message));
    }
  };

  return (
    <div className="card p-4 border-0 bg-dark border-secondary shadow">
      <h4 className="mb-4 fw-bold text-white">
        {productToEdit ? "✏️ Editar Producto" : "➕ Agregar Nuevo Producto"}
      </h4>
      
      {mensaje && (<div className={`alert ${mensaje.includes("✅") ? "alert-success" : "alert-danger"}`}>{mensaje}</div>)}

      <form onSubmit={handleSubmit}>
        
        {/* 1. CAMPO: NOMBRE DEL PRODUCTO */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-white">Nombre del Producto</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        {/* 2. CAMPO: DESCRIPCIÓN */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-white">Descripción</label>
          <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} required rows="3" />
        </div>

        {/* 3. CAMPOS: PRECIO Y STOCK */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-white">Precio</label>
            <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required min="0" />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold text-white">Stock</label>
            <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
          </div>
        </div>

        {/* 🚨 4. DROPDOWN DE CATEGORÍAS (Integración) 🚨 */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-white">Categoría</label>
          <div className="input-group">
            <select 
                className="form-select bg-dark border-secondary text-white" 
                name="categoria" 
                value={formData.categoria} 
                onChange={handleChange} 
                required
            >
                <option value="" disabled>Seleccione una categoría existente</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.nombre}>
                        {cat.nombre}
                    </option>
                ))}
            </select>
            {/* Botón para ir a crear nuevas categorías */}
            <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                    onSuccess(); 
                    navigate('/admin?tab=categories'); 
                }}
            >
                ➕ Crear
            </button>
          </div>
          <div className="form-text text-secondary small">
            Si la categoría no existe, créala usando el botón 'Crear'.
          </div>
        </div>
        
        {/* 5. CAMPO: URL de IMAGEN */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-white">URL de Imagen</label>
          <input type="text" className="form-control" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="https://..." required />
          {formData.imagenUrl && (
              <div className="mt-2 text-center border border-secondary rounded p-2 bg-black">
                  <img src={formData.imagenUrl} alt="Vista previa" style={{height: '100px', objectFit: 'contain'}} onError={(e) => e.target.style.display = 'none'} />
              </div>
          )}
        </div>
        
        {/* 6. CAMPO: LINK DE YOUTUBE */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-white">Link de YouTube (Embed)</label>
          <input 
            type="url" 
            className="form-control" 
            name="videoUrl" 
            value={formData.videoUrl} 
            onChange={handleChange} 
            placeholder="Ej: https://www.youtube.com/embed/..." 
          />
          <div className="form-text text-secondary small">
            💡 Usa el link de 'Insertar' de YouTube (Ej: https://www.youtube.com/embed/ID)
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
          {productToEdit ? "Guardar Cambios" : "Guardar Producto"}
        </button>
      </form>
    </div>
  );
}