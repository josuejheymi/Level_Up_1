// Permite manejar el estado de usuario logueado y registrar nuevos usuarios.
import { createContext, useContext, useState, useEffect } from "react";
import { users as defaultUsers } from "../../Data/users";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Lista completa de usuarios
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem("users");
        return savedUsers ? JSON.parse(savedUsers) : defaultUsers;
    });

    // Usuario actualmente logueado
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem("currentUser");
        return savedUser && savedUser !== "null" ? JSON.parse(savedUser) : null;
    });

    // Guardar los usuarios cuando cambian
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    // Guardar el usuario logueado cuando cambia
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("currentUser");
        }
    }, [currentUser]);

    // Registrar nuevo usuario
    const registerUser = (newUser) => {
        setUsers((prev) => [...prev, { ...newUser, id: Date.now(), role: "client" }]);
        setCurrentUser({ ...newUser, id: Date.now(), role: "client" });
    };

    // Login de usuario existente
    const loginUser = (email, password) => {
        const found = users.find(
            (u) => u.email === email && u.password === password
        );
        if (found) {
            setCurrentUser(found);
            localStorage.setItem("currentUser", JSON.stringify(found));
            return true;
        }
        return false;
    };

    // Cerrar sesión
    const logoutUser = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
    };

    return (
        <UserContext.Provider
            value={{
                users,
                currentUser,
                registerUser,
                loginUser,
                logoutUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useUser = () => useContext(UserContext);
