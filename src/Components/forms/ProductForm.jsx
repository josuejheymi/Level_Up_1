import React, { useState } from "react";
import { useProducts } from "../products/ProductContext"; 

// 1. Recibimos la prop 'onSuccess' (función para cerrar el formulario)
export default function ProductForm({ onSuccess }) {
  const { addProduct } = useProducts();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    categoria: "Consolas",
    imagenUrl: "",
  });

  const [mensaje, setMensaje] = useState("");

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
      
      // Limpiar formulario
      setFormData({
        nombre: "", descripcion: "", precio: 0, stock: 0, categoria: "Consolas", imagenUrl: ""
      });

      // 2. MAGIA UX: Si nos pasaron la función onSuccess, la ejecutamos tras 1.5 seg
      // Esto permite que el usuario lea el mensaje "✅" antes de que se cierre el formulario.
      if (onSuccess) {
        setTimeout(() => {
            onSuccess(); 
        }, 1500);
      }

    } else {
      console.error("Error:", resultado.error);
      setMensaje("❌ Error al crear producto");
    }
  };

  return (
    <div className="card p-4 border-0"> {/* Le quité la sombra aquí para que no choque con la del contenedor padre */}
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

        <div className="mb-3">
          <label className="form-label fw-semibold">Categoría</label>
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
          <label className="form-label fw-semibold">URL de Imagen</label>
          <input type="text" className="form-control" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="https://..." required />
          {formData.imagenUrl && (
              <div className="mt-2 text-center">
                  <small className="text-muted">Vista previa:</small><br/>
                  <img src={formData.imagenUrl} alt="Vista previa" style={{height: '80px', objectFit: 'contain'}} onError={(e) => e.target.style.display = 'none'} />
              </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
            Guardar Producto
        </button>
      </form>
    </div>
  );
}