import { useState } from "react";
import { useUser } from "../Components/user/UserContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { registerUser } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser({ name, email, password });
    navigate("/"); // Redirige al home después de registrarse
  };

  return (
    <div className="container mt-4">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-success w-100">Registrar</button>
      </form>
    </div>
  );
}
