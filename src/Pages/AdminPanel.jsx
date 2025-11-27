import React, { useState } from "react";
import ProductForm from "../Components/forms/ProductForm";
import { useProducts } from "../Components/products/ProductContext";

export default function AdminPanel() {
  // 1. Traemos también la función 'deleteProduct'
  const { allProducts, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);

  // Función para manejar el borrado
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      const result = await deleteProduct(id);
      if (result.success) {
        alert("Producto eliminado correctamente");
      } else {
        alert("Error al eliminar el producto");
      }
    }
  };

  return (
    <div className="container my-5 fade-in">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0">Panel de Administración</h1>
          <p className="text-muted">Gestiona el inventario de la tienda</p>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-secondary' : 'btn-success'} shadow-sm`}
          onClick={() => setShowForm(!showForm)}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-2`}></i>
          {showForm ? "Cerrar Formulario" : "Nuevo Producto"}
        </button>
      </div>

      {/* Formulario Desplegable */}
      {showForm && (
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body">
            <ProductForm onSuccess={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Tabla de Inventario */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">Inventario Actual ({allProducts.length})</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" className="ps-4">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col" className="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.length > 0 ? (
                allProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <img 
                          src={product.imagenUrl} 
                          alt={product.nombre} 
                          className="rounded me-3 border"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        />
                        <span className="fw-semibold text-dark">{product.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {product.categoria}
                      </span>
                    </td>
                    <td className="fw-bold text-primary">
                      ${product.precio?.toLocaleString()}
                    </td>
                    <td>
                      {/* Lógica visual de Stock: Rojo si hay poco */}
                      <span className={`fw-bold ${product.stock < 5 ? 'text-danger' : 'text-success'}`}>
                        {product.stock} u.
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(product.id, product.nombre)}
                        title="Eliminar producto"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No hay productos en el inventario. ¡Agrega uno!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}