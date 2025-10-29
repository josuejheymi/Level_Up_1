import { useState } from "react";
import { useUser } from "../Components/user/UserContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // Obtiene la función de registro del contexto
  const { registerUser } = useUser();
  // Hook para redireccionar después del registro
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Registra al usuario con los datos del formulario
    registerUser({ name, email, password });
    // Redirige a la página principal
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Registro</h2>

      {/* Formulario de registro */}
      <form onSubmit={handleSubmit}>
        {/* Campo Nombre */}
        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Campo Email */}
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Campo Contraseña (oculto) */}
        <input
          className="form-control mb-2"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón de registro */}
        <button className="btn btn-success w-100">Registrar</button>
      </form>
    </div>
  );
}