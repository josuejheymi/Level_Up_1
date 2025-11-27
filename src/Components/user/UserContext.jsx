import { createContext, useState, useContext } from "react"; // Ya no necesitamos useEffect para esto
import api from "../../config/api";

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  // ✅ CAMBIO CLAVE: Inicialización Perezosa
  // Leemos el localStorage DIRECTAMENTE al iniciar el estado.
  // Así, 'user' nunca es null si ya estabas logueado.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("usuario");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error al leer usuario del storage", error);
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      const response = await api.post("/usuarios/login", { email, password });
      setUser(response.data);
      localStorage.setItem("usuario", JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Credenciales incorrectas o error de conexión" };
    }
  };

  const register = async (datosUsuario) => {
    try {
        const response = await api.post("/usuarios/registro", datosUsuario);
        setUser(response.data);
        localStorage.setItem("usuario", JSON.stringify(response.data));
        return { success: true };
    } catch (error) {
        const mensajeError = error.response?.data?.error || "Error desconocido al registrar";
        return { success: false, message: mensajeError };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("usuario");
  };

  // ❌ ELIMINADO: Ya no necesitamos el useEffect para leer el storage
  // porque ya lo hicimos arriba en el useState.

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};