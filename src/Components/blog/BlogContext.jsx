import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../config/api";

/**
 * 1. CREACIÓN DEL CONTEXTO
 * Piensa en esto como crear una "estación de radio" exclusiva para noticias.
 * Este objeto almacenará los datos que queremos compartir globalmente.
 */
const BlogContext = createContext();

/**
 * 2. CUSTOM HOOK (El "Receptor")
 * Este es un atajo profesional. En lugar de importar 'useContext' y 'BlogContext'
 * en cada componente, solo importamos 'useBlog()'.
 * Además, validamos que se use dentro del lugar correcto.
 */
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog debe usarse dentro de un BlogProvider");
  return context;
};

/**
 * 3. PROVIDER (El "Proveedor" o "Antena")
 * Este componente envuelve a otros componentes (children) y les "inyecta"
 * la lógica y los datos. Todo lo que esté dentro de <BlogProvider> podrá acceder a las noticias.
 */
export const BlogProvider = ({ children }) => {
  // --- ESTADOS GLOBALES ---
  const [posts, setPosts] = useState([]); // Almacena la lista de noticias
  const [loading, setLoading] = useState(true); // Controla el spinner de carga

  /**
   * FUNCIÓN DE CARGA (READ)
   * Usamos 'useCallback' para memorizar esta función.
   * ¿Por qué? Porque la usamos dentro de un useEffect. Si no usamos useCallback,
   * React crearía una función nueva en cada render, disparando el efecto infinitamente.
   */
  const refreshPosts = useCallback(async () => {
    try {
      const response = await api.get("/blog");
      
      // Ordenamos las noticias: ID más alto (más nuevo) primero.
      // Es mejor hacer esto aquí una vez, que hacerlo en cada vista.
      const sortedPosts = response.data.sort((a, b) => b.id - a.id);
      
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error crítico cargando blog:", error);
    } finally {
      // finally se ejecuta SIEMPRE, haya error o éxito.
      // Es el lugar perfecto para apagar el 'loading'.
      setLoading(false);
    }
  }, []);

  /**
   * EFECTO DE INICIALIZACIÓN
   * Este useEffect se ejecuta una sola vez cuando la aplicación carga
   * (o cuando se monta el proveedor), llamando a los datos iniciales.
   */
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  /**
   * CREAR NOTICIA (CREATE) - Solo Admin
   * Recibe los datos, los envía al servidor y recarga la lista.
   */
  const addPost = async (postData) => {
    try {
      await api.post("/blog", postData);
      
      // Recargamos los datos para asegurar que la lista esté sincronizada con la BD real
      await refreshPosts(); 
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data || "Error al crear" };
    }
  };

  /**
   * ELIMINAR NOTICIA (DELETE) - Solo Admin
   */
  const deletePost = async (id) => {
    try {
      await api.delete(`/blog/${id}`);
      
      // Actualización Optimista (Opcional):
      // Podríamos hacer: setPosts(posts.filter(p => p.id !== id));
      // Pero por seguridad de consistencia, preferimos recargar desde el servidor:
      await refreshPosts();
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data || "Error al eliminar" };
    }
  };

  /**
   * RETORNO DEL COMPONENTE
   * El 'value' es el objeto que se comparte con toda la aplicación.
   * 'children' representa todos los componentes que están dentro del Provider (App, Navbar, etc).
   */
  return (
    <BlogContext.Provider value={{ posts, loading, addPost, deletePost }}>
      {children}
    </BlogContext.Provider>
  );
};