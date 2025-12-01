import axios from "axios";

// Crear la instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// --- INTERCEPTOR MÁGICO ---
// Antes de que salga cualquier petición, ejecuta esto:
api.interceptors.request.use(
  (config) => {
    // 1. Leer el usuario del localStorage
    const storedUser = localStorage.getItem("usuario");
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      
      // 2. Si existe un token, agregarlo a la cabecera
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;