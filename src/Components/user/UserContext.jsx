// Este archivo gestiona el contexto global de usuarios en la aplicación. 

// Permite manejar el estado de usuario logueado y registrar nuevos usuarios.
import { createContext, useContext, useState, useEffect } from "react";
import { users as defaultUsers } from "../../Data/users";

// Creamos el contexto para compartir estado de usuario en toda la app
const UserContext = createContext();

// Proveedor que envuelve la aplicación y maneja la lógica de usuarios
export const UserProvider = ({ children }) => {
    // Lista completa de usuarios registrados
    const [users, setUsers] = useState(() => {
        // Intenta cargar usuarios desde localStorage al iniciar
        const savedUsers = localStorage.getItem("users");
        return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
    });

    // Usuario actualmente logueado (null si no hay sesión)
    const [currentUser, setCurrentUser] = useState(() => {
        // Intenta recuperar sesión activa desde localStorage
        const savedUser = localStorage.getItem("currentUser");
        return savedUser && savedUser !== "null" ? JSON.parse(savedUser) : null;
    });

    // Sincroniza la lista de usuarios con localStorage cuando cambia
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    // Sincroniza el usuario logueado con localStorage cuando cambia
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("currentUser"); // Limpia si cierra sesión
        }
    }, [currentUser]);

    // Registrar nuevo usuario
    const registerUser = (newUser) => {
        // Agrega nuevo usuario con ID único y rol por defecto
        setUsers((prev) => [...prev, { ...newUser, id: Date.now(), role: "client" }]);
        // Automáticamente inicia sesión con el nuevo usuario
        setCurrentUser({ ...newUser, id: Date.now(), role: "client" });
    };

    // Login de usuario existente
    const loginUser = (email, password) => {
        // Busca usuario que coincida con email y contraseña
        const found = users.find(
            (u) => u.email === email && u.password === password
        );
        if (found) {
            setCurrentUser(found); // Establece como usuario actual
            localStorage.setItem("currentUser", JSON.stringify(found)); // Guarda en localStorage
            return found; // <-- DEVUELVE EL USUARIO COMPLETO (para redirección, etc.)
        }
        return null; // <-- si no encontró nada (credenciales incorrectas)
    };

    // Cerrar sesión del usuario actual
    const logoutUser = () => {
        setCurrentUser(null); // Elimina usuario actual
        localStorage.removeItem("currentUser"); // Limpia localStorage
    };

    // Provee todos los valores y funciones a los componentes hijos
    return (
        <UserContext.Provider
            value={{
                users,           // Lista de todos los usuarios
                currentUser,     // Usuario logueado actual (o null)
                registerUser,    // Función para registrar nuevo usuario
                loginUser,       // Función para iniciar sesión
                logoutUser,      // Función para cerrar sesión
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useUser = () => useContext(UserContext);