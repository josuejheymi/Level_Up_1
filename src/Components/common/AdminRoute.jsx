import { Navigate } from "react-router-dom";
import { useUser } from "../user/UserContext";

export default function AdminRoute({ children }) {
  // 1. Usamos 'user' (el nuevo nombre), no 'currentUser'
  const { user } = useUser();

  // DEBUG: Para que veas en consola qué está leyendo el portero
  console.log("AdminRoute revisando usuario:", user);

  // CASO 1: No hay nadie logueado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // CASO 2: Sí está logueado, pero NO es ADMIN
  // IMPORTANTE: En Java pusimos 'rol' (sin e) y valor 'ADMIN' (mayúscula)
  if (user.rol !== "ADMIN") {
    alert("Acceso denegado: Se requieren permisos de Administrador.");
    return <Navigate to="/" replace />;
  }

  // CASO 3: Todo correcto, pase adelante
  return children;
}