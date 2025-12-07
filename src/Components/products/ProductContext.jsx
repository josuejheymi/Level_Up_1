import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import api from "../../config/api";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]); // Todos los productos (crudos)
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado del buscador global

  // 1. CARGAR PRODUCTOS DEL BACKEND
  const fetchProducts = async () => {
    try {
      const res = await api.get("/productos");
      setAllProducts(res.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. LÓGICA DE FILTRADO (AQUÍ ESTABA EL ERROR)
  const products = useMemo(() => {
    if (!searchTerm) return allProducts;

    const term = searchTerm.toLowerCase();

    return allProducts.filter((product) => {
      // Validación defensiva del nombre
      const nombreMatch = product.nombre?.toLowerCase().includes(term);
      
      // 🚨 CORRECCIÓN CLAVE: Validación de categoría (Soporta Objeto y String)
      let categoriaMatch = false;
      
      if (product.categoria) {
          if (typeof product.categoria === 'string') {
              // Si por error quedó como string
              categoriaMatch = product.categoria.toLowerCase().includes(term);
          } else if (product.categoria.nombre) {
              // LA FORMA CORRECTA: Es objeto, leemos .nombre
              categoriaMatch = product.categoria.nombre.toLowerCase().includes(term);
          }
      }

      return nombreMatch || categoriaMatch;
    });
  }, [allProducts, searchTerm]);

  // 3. ACCIONES CRUD (Crear, Editar, Eliminar)
  
  // Agregar Producto
  const addProduct = async (productData) => {
    try {
      const res = await api.post("/productos", productData);
      setAllProducts([...allProducts, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Actualizar Producto
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.put(`/productos/${id}`, updatedData);
      setAllProducts(allProducts.map((p) => (p.id === id ? res.data : p)));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Eliminar Producto
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/productos/${id}`);
      setAllProducts(allProducts.filter((p) => p.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error eliminando:", error);
      return { success: false, error };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        allProducts, // Lista completa sin filtrar (para AdminPanel)
        products,    // Lista filtrada por buscador (para Home/Catálogo)
        loading,
        searchTerm,
        setSearchTerm,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};