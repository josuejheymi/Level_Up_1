import React, { useState, useMemo } from "react";
import { useProducts } from "../products/ProductContext"; 

export default function ProductForm({ onSuccess }) {
  // 1. Traemos 'allProducts' para leer las categorías existentes
  const { addProduct, allProducts } = useProducts();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "",
    imagenUrl: "",
  });

  const [mensaje, setMensaje] = useState("");

  // 2. Lógica para obtener categorías únicas dinámicamente
  const categoriasDisponibles = useMemo(() => {
    // Categorías base que siempre queremos que estén
    const defaults = ["Consolas", "Juegos", "Accesorios", "PC Gamer", "Sillas", "Ropa"];
    
    // Extraemos las categorías que ya existen en la base de datos
    const existentes = allProducts.map(p => p.categoria);
    
    // Unimos todo y eliminamos duplicados con Set
    const unicas = [...new Set([...defaults, ...existentes])];
    
    // Las ordenamos alfabéticamente
    return unicas.sort();
  }, [allProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); 

    const resultado = await addProduct(formData);

    if (resultado.success) {
      setMensaje("✅ Producto creado exitosamente");
      setFormData({
        nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "", imagenUrl: ""
      });

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } else {
      console.error("Error:", resultado.error);
      setMensaje("❌ Error al crear producto");
    }
  };

  return (
    <div className="card p-4 border-0">
      <h4 className="mb-4 fw-bold text-primary">Agregar Nuevo Producto</h4>
      
      {mensaje && (
        <div className={`alert ${mensaje.includes("✅") ? "alert-success" : "alert-danger"}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre del Producto</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} required rows="3" />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Precio</label>
            <div className="input-group">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required min="0" />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Stock</label>
            <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
          </div>
        </div>

        {/* --- SELECCIÓN DINÁMICA DE CATEGORÍA --- */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Categoría</label>
          <input 
            className="form-control" 
            list="categoryOptions" 
            name="categoria" 
            value={formData.categoria} 
            onChange={handleChange} 
            placeholder="Selecciona o escribe una nueva..." 
            required 
          />
          
          {/* Aquí renderizamos las opciones dinámicas */}
          <datalist id="categoryOptions">
            {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat} />
            ))}
          </datalist>
          
          <div className="form-text text-muted small">
            💡 Si escribes un nombre nuevo (ej: "Figuras"), se creará esa categoría automáticamente.
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">URL de Imagen</label>
          <input type="text" className="form-control" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="https://..." required />
          {formData.imagenUrl && (
              <div className="mt-2 text-center border rounded p-2 bg-light">
                  <small className="text-muted d-block mb-1">Vista previa:</small>
                  <img src={formData.imagenUrl} alt="Vista previa" style={{height: '100px', objectFit: 'contain'}} onError={(e) => e.target.style.display = 'none'} />
              </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
            Guardar Producto
        </button>
      </form>
    </div>
  );
}