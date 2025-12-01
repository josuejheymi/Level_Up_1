import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../products/ProductContext"; 

// Recibimos 'productToEdit' (si es null, es modo creación)
export default function ProductForm({ productToEdit, onSuccess }) {
  const { addProduct, updateProduct, allProducts } = useProducts();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "",
    imagenUrl: "",
  });

  const [mensaje, setMensaje] = useState("");

  // 1. DETECTAR MODO EDICIÓN
  // Si nos pasan un producto, llenamos el formulario con sus datos
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        categoria: productToEdit.categoria,
        imagenUrl: productToEdit.imagenUrl
      });
    } else {
      // Si no, limpiamos
      setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "", imagenUrl: "" });
    }
  }, [productToEdit]);

  // 2. LISTA DINÁMICA DE CATEGORÍAS
  // Lee las que ya existen en la BD para sugerirlas
  const categoriasDisponibles = useMemo(() => {
    const defaults = ["Consolas", "Juegos", "Accesorios", "PC Gamer", "Sillas", "Ropa"];
    const existentes = allProducts.map(p => p.categoria);
    const unicas = [...new Set([...defaults, ...existentes])];
    return unicas.sort();
  }, [allProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); 

    let result;

    // 3. DECIDIR SI CREAR O ACTUALIZAR
    if (productToEdit) {
        result = await updateProduct(productToEdit.id, formData);
    } else {
        result = await addProduct(formData);
    }

    if (result.success) {
      setMensaje(productToEdit ? "✅ Producto actualizado correctamente" : "✅ Producto creado exitosamente");
      
      if (!productToEdit) {
         // Limpiar solo si es creación nueva
         setFormData({ nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "", imagenUrl: "" });
      }

      // Cerrar automáticamente
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }

    } else {
      console.error("Error:", result.error);
      setMensaje("❌ Error al guardar");
    }
  };

  return (
    <div className="card p-4 border-0 bg-dark border-secondary shadow">
      <h4 className="mb-4 fw-bold text-white">
        {productToEdit ? "✏️ Editar Producto" : "➕ Agregar Nuevo Producto"}
      </h4>
      
      {mensaje && (
        <div className={`alert ${mensaje.includes("✅") ? "alert-success" : "alert-danger"}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold text-white">Nombre del Producto</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold text-white">Descripción</label>
          <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} required rows="3" />
        </div>

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

        {/* SELECCIÓN DE CATEGORÍA INTELIGENTE */}
        <div className="mb-3">
          <label className="form-label fw-semibold text-white">Categoría</label>
          <input 
            className="form-control" 
            list="categoryOptions" 
            name="categoria" 
            value={formData.categoria} 
            onChange={handleChange} 
            placeholder="Selecciona o escribe una nueva..." 
            required 
          />
          <datalist id="categoryOptions">
            {categoriasDisponibles.map((cat) => <option key={cat} value={cat} />)}
          </datalist>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold text-white">URL de Imagen</label>
          <input type="text" className="form-control" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="https://..." required />
          {formData.imagenUrl && (
              <div className="mt-2 text-center border border-secondary rounded p-2 bg-black">
                  <img src={formData.imagenUrl} alt="Vista previa" style={{height: '100px', objectFit: 'contain'}} onError={(e) => e.target.style.display = 'none'} />
              </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
            {productToEdit ? "Guardar Cambios" : "Guardar Producto"}
        </button>
      </form>
    </div>
  );
}