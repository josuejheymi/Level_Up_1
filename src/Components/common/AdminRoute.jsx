import { Navigate } from "react-router-dom";
import { useUser } from "../user/UserContext";

export default function AdminRoute({ children }) {
  const { user } = useUser();

  // 1. Si no está logueado, al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. CAMBIO CLAVE: Permitir entrada a ADMIN **O** VENDEDOR
  if (user.rol !== "ADMIN" && user.rol !== "VENDEDOR") {
    // Si no es ninguno de los dos, es un cliente normal -> Fuera
    alert("Acceso denegado: No tienes permisos de staff.");
    return <Navigate to="/" replace />;
  }

  // 3. Si cumple, mostrar el panel
  return children;
}