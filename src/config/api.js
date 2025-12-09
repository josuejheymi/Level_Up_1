import axios from "axios";

/**
 * CONFIGURACIÓN DE AXIOS (Cliente HTTP)
 * ----------------------------------------------------------------------
 * En lugar de usar 'fetch()' en cada componente, creamos una instancia centralizada.
 * Ventajas:
 * 1. URL Base única: No hay que escribir "http://localhost:8080" en cada petición.
 * 2. Interceptores: Inyectamos el Token de seguridad automáticamente.
 * 3. Manejo de errores global: Podemos capturar errores 401/403 en un solo lugar.
 */

// 1. CREAR INSTANCIA
const api = axios.create({
  baseURL: "http://localhost:8080/api", // URL del Backend Spring Boot
  headers: {
    "Content-Type": "application/json", // Indicamos que siempre enviamos JSON
  },
});

/**
 * 2. INTERCEPTOR DE SOLICITUDES (Middleware)
 * ----------------------------------------------------------------------
 * Este código se ejecuta AUTOMÁTICAMENTE antes de que cualquier petición
 * salga de la aplicación hacia internet.
 * * Objetivo: Buscar si el usuario tiene un Token guardado y pegárselo a la petición.
 */
api.interceptors.request.use(
  (config) => {
    // A. Intentamos leer el usuario del almacenamiento local del navegador
    const storedUser = localStorage.getItem("usuario");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        
        // B. Si el usuario tiene un token, lo inyectamos en la cabecera
        if (user?.token) {
          // Estándar JWT: "Authorization: Bearer <token>"
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Error al leer token:", error);
        // Si el JSON está corrupto, lo borramos para evitar bloqueos
        localStorage.removeItem("usuario");
      }
    }
    
    // C. Devolvemos la configuración modificada para que Axios siga su curso
    return config;
  },
  (error) => {
    // Si falla la configuración de la petición antes de salir
    return Promise.reject(error);
  }
);

/**
 * (Opcional) 3. INTERCEPTOR DE RESPUESTAS
 * Se podria agregar esto en el futuro para detectar si el token expiró (Error 401)
 * y cerrar sesión automáticamente.
 */
/*
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token vencido o inválido -> Forzar logout
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
*/

export default api;