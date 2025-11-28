import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../config/api";

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) throw new Error("useBlog debe usarse dentro de BlogProvider");
  return context;
};

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar Noticias
  const refreshPosts = useCallback(async () => {
    try {
      const response = await api.get("/blog");
      // Ordenamos por ID descendente (las nuevas primero)
      const sortedPosts = response.data.sort((a, b) => b.id - a.id);
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error cargando blog:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  // 2. Crear Noticia (Admin)
  const addPost = async (postData) => {
    try {
      await api.post("/blog", postData);
      await refreshPosts();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // 3. Eliminar Noticia (Admin)
  const deletePost = async (id) => {
    try {
      await api.delete(`/blog/${id}`);
      await refreshPosts();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <BlogContext.Provider value={{ posts, loading, addPost, deletePost }}>
      {children}
    </BlogContext.Provider>
  );
};