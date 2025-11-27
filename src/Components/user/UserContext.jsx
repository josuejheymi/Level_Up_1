import { createContext, useState, useEffect, useContext } from "react";
// Importamos la instancia de Axios configurada (base URL: http://localhost:8080/api)
import api from "../../config/api"; 

// 1. Creación del Contexto:
// Esto crea un "almacén" de datos que estará disponible para toda la aplicación.
export const UserContext = createContext();

// 2. Custom Hook "useUser":
// Este es un patrón profesional para consumir el contexto.
// Evita tener que importar 'useContext' y 'UserContext' en cada componente.
// Si un componente intenta usarlo fuera del Provider, lanzará un error útil para debugging.
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

// 3. Provider (El Proveedor de Datos):
// Este componente envolverá a toda tu App (en index.js o App.js) para dar acceso al usuario.
export const UserProvider = ({ children }) => {
  // Estado local para guardar el objeto usuario (id, nombre, email, rol, etc.)
  const [user, setUser] = useState(null);

  /**
   * 📡 FUNCIÓN LOGIN
   * Se comunica con el endpoint POST /api/usuarios/login de Spring Boot.
   */
  const login = async (email, password) => {
    try {
      // LLAMADA AL BACKEND: Enviamos el JSON { email, password }
      const response = await api.post("/usuarios/login", { email, password });
      
      // Si Spring Boot responde 200 OK, 'response.data' contiene el objeto Usuario completo.
      setUser(response.data);
      
      // PERSISTENCIA: Guardamos el usuario en el navegador para no perder la sesión al recargar.
      localStorage.setItem("usuario", JSON.stringify(response.data));
      
      return { success: true };
    } catch (error) {
      // Manejo de errores (ej: 401 Unauthorized desde Java)
      console.error("Error en login:", error);
      return { success: false, message: "Credenciales incorrectas o error de conexión" };
    }
  };

  /**
   * 📡 FUNCIÓN REGISTER
   * Se comunica con el endpoint POST /api/usuarios/registro de Spring Boot.
   */
  const register = async (datosUsuario) => {
    try {
        // LLAMADA AL BACKEND: Enviamos el objeto con nombre, email, password, etc.
        // Spring Boot se encargará de validar la edad, el correo Duoc y crear el código de referido.
        const response = await api.post("/usuarios/registro", datosUsuario);
        
        // Actualizamos el estado con el nuevo usuario creado
        setUser(response.data);
        localStorage.setItem("usuario", JSON.stringify(response.data));
        
        return { success: true };
    } catch (error) {
        // Capturamos el mensaje de error personalizado que enviamos desde Java (ej: "Debes ser mayor de 18")
        // 'error.response.data' es el cuerpo del error que definimos en el Controller de Spring.
        const mensajeError = error.response?.data?.error || "Error desconocido al registrar";
        return { success: false, message: mensajeError };
    }
  };

  // Función para cerrar sesión (Limpieza local)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario"); // Borramos la "sesión" del navegador
  };

  // EFECTO DE MONTAJE:
  // Se ejecuta una sola vez al cargar la página.
  // Verifica si ya había un usuario guardado en localStorage para restaurar la sesión automáticamente.
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Retornamos el Provider con todas las funciones y el estado expuestos
  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};