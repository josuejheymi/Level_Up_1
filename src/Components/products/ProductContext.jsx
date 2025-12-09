import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import api from "../../config/api";

// 1. CREACIÓN DEL CONTEXTO
// "La Nube" donde vivirán los datos de los productos.
const ProductContext = createContext();

// 2. CUSTOM HOOK
// Para consumir los productos fácilmente en cualquier componente.
export const useProducts = () => useContext(ProductContext);

// 3. PROVIDER (El Proveedor de Datos)
export const ProductProvider = ({ children }) => {
  
  // --- ESTADOS GLOBALES ---
  const [allProducts, setAllProducts] = useState([]); // Fuente de la verdad (Raw Data)
  const [loading, setLoading] = useState(true);       // Spinner de carga
  const [searchTerm, setSearchTerm] = useState("");   // Texto del buscador (Navbar)

  /**
   * FUNCIÓN: Cargar Productos (READ)
   * Usamos useCallback para "memorizar" esta función.
   * Esto permite pasarla a otros componentes sin que React piense que es una función nueva
   * cada vez que se renderiza, evitando recargas infinitas.
   */
  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/productos");
      setAllProducts(res.data);
    } catch (error) {
      console.error("Error crítico cargando productos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // EFECTO INICIAL: Cargar datos al abrir la página
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * LÓGICA DE FILTRADO INTELIGENTE (useMemo)
   * -----------------------------------------------------------
   * Problema: Si tenemos 1000 productos y el usuario escribe una letra,
   * no queremos recalcular el filtro en cada micro-renderizado si los datos no han cambiado.
   * * Solución: useMemo memoriza el resultado ('products'). Solo se recalcula si:
   * 1. Cambia la lista de productos ('allProducts')
   * 2. Cambia el texto de búsqueda ('searchTerm')
   */
  const products = useMemo(() => {
    // Si no hay búsqueda, devolvemos todo (optimización rápida)
    if (!searchTerm) return allProducts;

    const term = searchTerm.toLowerCase();

    return allProducts.filter((product) => {
      // A. Búsqueda por Nombre (Uso de ?. para evitar error si es null)
      const nombreMatch = product.nombre?.toLowerCase().includes(term);
      
      // B. Búsqueda por Categoría (Defensiva)
      // La API a veces devuelve la categoría como Objeto {id, nombre} y a veces como String "Nombre".
      // Este código maneja ambos casos para que la app no se rompa.
      let categoriaMatch = false;
      
      if (product.categoria) {
          if (typeof product.categoria === 'string') {
              // Caso 1: Backend envió solo el nombre
              categoriaMatch = product.categoria.toLowerCase().includes(term);
          } else if (product.categoria.nombre) {
              // Caso 2: Backend envió el objeto completo (Lo correcto)
              categoriaMatch = product.categoria.nombre.toLowerCase().includes(term);
          }
      }

      // Devolvemos TRUE si coincide con el nombre O con la categoría
      return nombreMatch || categoriaMatch;
    });
  }, [allProducts, searchTerm]);

  // --- ACCIONES CRUD (Modifican el servidor y el estado local) ---
  
  // 1. CREATE
  const addProduct = async (productData) => {
    try {
      const res = await api.post("/productos", productData);
      // Actualización Inmutable: Copiamos el array viejo y agregamos el nuevo al final
      setAllProducts([...allProducts, res.data]);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // 2. UPDATE
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.put(`/productos/${id}`, updatedData);
      
      // Actualización Inmutable con .map():
      // "Recorre la lista. Si el ID coincide, reemplázalo con el nuevo (res.data). Si no, déjalo igual."
      setAllProducts(allProducts.map((p) => (p.id === id ? res.data : p)));
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // 3. DELETE
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/productos/${id}`);
      
      // Actualización Inmutable con .filter():
      // "Crea una lista nueva con todos los productos MENOS el que tiene este ID."
      setAllProducts(allProducts.filter((p) => p.id !== id));
      
      return { success: true };
    } catch (error) {
      console.error("Error eliminando:", error);
      return { success: false, error };
    }
  };

  // --- EXPOSICIÓN DE DATOS ---
  return (
    <ProductContext.Provider
      value={{
        allProducts, // Lista pura (útil para el Admin Panel que quiere ver todo)
        products,    // Lista filtrada (útil para el Home/Catálogo)
        loading,
        
        // Control del buscador
        searchTerm,
        setSearchTerm,
        
        // Acciones
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts: fetchProducts // Alias para recargar manualmente si se necesita
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};