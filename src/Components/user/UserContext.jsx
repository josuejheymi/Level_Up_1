import { createContext, useState, useContext } from "react";
import api from "../../config/api";

/**
 * 1. CREACIÓN DEL CONTEXTO
 * Creamos el "espacio global" donde vivirán los datos del usuario.
 */
export const UserContext = createContext();

/**
 * 2. CUSTOM HOOK: useUser
 * Hook personalizado para facilitar el consumo del contexto.
 * Incluye una validación de seguridad para evitar errores si se usa fuera del Provider.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

/**
 * 3. PROVIDER (Proveedor de Autenticación)
 * Encapsula la lógica de inicio de sesión, registro y persistencia de sesión.
 */
export const UserProvider = ({ children }) => {
  
  /**
   * ESTADO: USUARIO (Inicialización Perezosa / Lazy Initialization)
   * ---------------------------------------------------------------
   * En lugar de iniciar en 'null', pasamos una función a useState.
   * Esto hace que la lectura del localStorage se ejecute SOLO UNA VEZ
   * (al cargar la página), evitando lentitud en cada renderizado.
   */
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error al recuperar sesión:", error);
      return null;
    }
  });

  /**
   * FUNCIÓN: INICIAR SESIÓN (Login)
   * Envía credenciales al backend y guarda la respuesta en memoria y disco.
   */
  const login = async (email, password) => {
    try {
      // 1. Petición al Backend
      const response = await api.post("/usuarios/login", { email, password });

      // 2. Actualizar Estado Global (React)
      setUser(response.data);
      
      // 3. Persistencia (Guardar en navegador para no perder sesión al recargar)
      localStorage.setItem("usuario", JSON.stringify(response.data));

      return { success: true };

    } catch (error) {
      console.error("Error de autenticación:", error);
      return { 
        success: false, 
        message: "Credenciales incorrectas o error de conexión." 
      };
    }
  };

  /**
   * FUNCIÓN: REGISTRO (Sign Up)
   * Crea el usuario en BD y automáticamente inicia sesión.
   */
  const register = async (datosUsuario) => {
    try {
      const response = await api.post("/usuarios/registro", datosUsuario);

      setUser(response.data);
      localStorage.setItem("usuario", JSON.stringify(response.data));

      return { success: true };

    } catch (error) {
      // Extraemos el mensaje de error específico del backend si existe
      const mensajeError = error.response?.data?.error || "Error desconocido al registrar.";
      
      return { 
        success: false, 
        message: mensajeError 
      };
    }
  };

  /**
   * FUNCIÓN: CERRAR SESIÓN (Logout)
   * Limpia tanto el estado de React como el almacenamiento local.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
  };

  /**
   * EXPOSICIÓN DE DATOS
   * Todo lo que pongamos en 'value' será accesible por cualquier componente de la app.
   */
  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};