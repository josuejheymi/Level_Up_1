//**Flujo de funcionamiento: el usuario intenta acceder a una ruta protegida -> AdminRoute verifica el rol del usuario -> Si es admin, permite el acceso -> Si no, redirige al login.**//

// Importamos el componente Navigate de React Router para redireccionar
import { Navigate } from "react-router-dom";
// Importamos nuestro hook personalizado para acceder al contexto del usuario
import { useUser } from "../user/UserContext";

// Este componente protege rutas que solo deben ser accesibles por administradores
// Recibe 'children' que son los componentes que queremos proteger
export default function AdminRoute({ children }) {
    // Obtenemos el usuario actual desde nuestro contexto global
    // currentUser es un objeto que puede tener: {id, email, role, name, etc.}
    const { currentUser } = useUser();

    // Verificamos si el usuario NO tiene acceso:
    // 1. Si no hay usuario logueado (!currentUser) O
    // 2. Si el usuario logueado NO es administrador (role !== "admin")
    if (!currentUser || currentUser.role !== "admin") {
        // Si no cumple los requisitos, redirigimos al usuario a la página de login
        return <Navigate to="/login" />;
    }

    // Si el usuario SÍ es administrador, mostramos los componentes hijos
    return children;
}