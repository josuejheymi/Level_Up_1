import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../user/UserContext";

/**
 * COMPONENTE: PROTECTOR DE RUTAS (Higher-Order Component / Wrapper)
 * ------------------------------------------------------------------
 * Este componente no tiene interfaz propia. Su único trabajo es envolver
 * a otros componentes (children) y aplicar lógica de seguridad.
 *
 * Funciona como un IF gigante:
 * - Si tienes permiso -> Renderiza los hijos (children).
 * - Si NO tienes permiso -> Te expulsa (Navigate).
 */
export default function AdminRoute({ children }) {
  // 1. OBTENER USUARIO DEL CONTEXTO
  const { user } = useUser();

  // -----------------------------------------------------------
  // NIVEL 1: AUTENTICACIÓN (¿Quién eres?)
  // -----------------------------------------------------------
  
  // Si 'user' es null, significa que no ha iniciado sesión.
  // <Navigate /> es un componente que fuerza un cambio de URL instantáneo.
  // 'replace' evita que el usuario pueda volver atrás con el botón del navegador.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // -----------------------------------------------------------
  // NIVEL 2: AUTORIZACIÓN (¿Tienes permiso?)
  // -----------------------------------------------------------

  // Definimos qué roles tienen permiso de entrar aquí.
  // Usar un array hace el código más limpio y fácil de ampliar mañana.
  const rolesPermitidos = ["ADMIN", "VENDEDOR"];

  // Verificamos si el rol del usuario está dentro de la lista permitida.
  if (!rolesPermitidos.includes(user.rol)) {
    console.warn(` :( Acceso denegado: Usuario ${user.email} intentó entrar al admin.`);
    
    // Si es un cliente normal, lo mandamos al Home.
    return <Navigate to="/" replace />;
  }

  // -----------------------------------------------------------
  // NIVEL 3: ACCESO CONCEDIDO
  // -----------------------------------------------------------

  // Si pasamos todos los filtros, renderizamos los 'children'.
  // 'children' es el componente que pusimos dentro de <AdminRoute>...</AdminRoute>
  // en el archivo App.js (en este caso, <AdminPanel />).
  return children;
}