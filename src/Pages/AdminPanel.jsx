import React, { useState } from "react";
import ProductForm from "../Components/forms/ProductForm";
import ProductList from "../Components/common/ProductList";
// 1. Conectamos al contexto
import { useProducts } from "../Components/products/ProductContext";

export default function AdminPanel() {
  // 2. Obtenemos los datos y la función para agregar
  const { allProducts, addProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Panel de Administración</h1>
        <button 
          className={`btn ${showForm ? 'btn-secondary' : 'btn-success'}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "+ Nuevo Producto"}
        </button>
      </div>

      {/* Formulario desplegable */}
      {showForm && (
        <div className="mb-5 fade-in">
          <ProductForm 
            onSuccess={() => setShowForm(false)} // Opcional: cerrar al terminar
            // Nota: ProductForm ya usa el contexto internamente, 
            // pero si tu ProductForm espera props, puedes pasarle 'addProduct'
          />
        </div>
      )}

      <h3 className="border-bottom pb-2 mb-3">Inventario Actual ({allProducts.length})</h3>
      
      <div className="bg-light p-3 rounded">
        <ProductList products={allProducts} />
      </div>
    </div>
  );
}