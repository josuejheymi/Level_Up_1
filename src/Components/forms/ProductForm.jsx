import React, { useState } from "react";
import api from "../../config/api"; // Tu conexión a Axios

export default function ProductForm() {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "Consolas", // Valor por defecto válido en tu Backend
    imagenUrl: "",
  });

  const [mensaje, setMensaje] = useState("");

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ENVÍO DE DATOS AL BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST /api/productos
      // Spring Boot espera un JSON con los nombres exactos del objeto formData
      await api.post("/productos", formData);
      
      setMensaje("✅ Producto creado con éxito en la Base de Datos");
      
      // Limpiar formulario
      setFormData({
        nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "Consolas", imagenUrl: ""
      });
    } catch (error) {
      console.error("Error creando producto:", error);
      setMensaje("❌ Error al crear producto. Revisa la consola.");
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h3 className="mb-4">Agregar Nuevo Producto</h3>
      
      {mensaje && <div className="alert alert-info">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Producto</label>
          <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Precio</label>
            <input type="number" className="form-control" name="precio" value={formData.precio} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Stock</label>
            <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          {/* Este select asegura que enviemos una categoría que el Backend entienda */}
          <select className="form-select" name="categoria" value={formData.categoria} onChange={handleChange}>
            <option value="Consolas">Consolas</option>
            <option value="Juegos">Juegos</option>
            <option value="Accesorios">Accesorios</option>
            <option value="PC Gamer">PC Gamer</option>
            <option value="Sillas">Sillas</option>
            <option value="Ropa">Ropa</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">URL de Imagen</label>
          <input type="text" className="form-control" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="https://..." required />
        </div>

        <button type="submit" className="btn btn-primary w-100">Guardar en Base de Datos</button>
      </form>
    </div>
  );
}