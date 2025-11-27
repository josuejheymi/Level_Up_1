import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { productService } from "../../services/productService";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts debe usarse dentro de ProductProvider");
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cargar productos al inicio
  const refreshProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  // 2. Lógica de Filtrado (La movimos de App.js aquí)
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(p => 
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // 3. Crear producto (Para el Admin)
  const addProduct = async (newProductData) => {
    try {
      await productService.create(newProductData);
      await refreshProducts(); // Recargamos la lista oficial
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products: filteredProducts, // Exportamos YA filtrados
      allProducts: products,      // Por si acaso necesitamos los crudos
      searchQuery, 
      setSearchQuery, 
      addProduct,
      loading 
    }}>
      {children}
    </ProductContext.Provider>
  );
};