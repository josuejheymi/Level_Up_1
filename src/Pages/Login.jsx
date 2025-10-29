import { useState } from "react";
import { useUser } from "../Components/user/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    // Obtiene la función de login del contexto de usuario
    const { loginUser } = useUser();

    // Hook para redireccionar después del login
    const navigate = useNavigate();

    // Estados para los campos del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Estado para mensajes de error

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita recarga de página

        // Intenta hacer login con las credenciales
        const user = loginUser(email, password);

        // Si el login es exitoso
        if (user) {
            console.log("Usuario logueado:", user);

            // Redirige según el rol del usuario
            if (user.role === "admin") {
                navigate("/admin"); // Panel de administración
            } else {
                navigate("/"); // Página principal para clientes
            }
        } else {
            // Si las credenciales son incorrectas
            setError("Email o contraseña incorrectos");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Login</h2>

            {/* Formulario de login */}
            <form onSubmit={handleSubmit}>
                {/* Campo de email */}
                <input
                    className="form-control mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Campo de contraseña (oculta) */}
                <input
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Muestra error si existe */}
                {error && <p className="text-danger">{error}</p>}

                {/* Botón de envío */}
                <button className="btn btn-primary w-100 mb-2">Ingresar</button>
            </form>
        </div>
    );
};