import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Importamos el hook que arreglamos ayer
import { useUser } from "../Components/user/UserContext"; 

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // Extraemos la función login del contexto
  const { login } = useUser();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Llamamos a la función del Contexto (que llama al Backend)
    const resultado = await login(formData.email, formData.password);

    setLoading(false);

    if (resultado.success) {
      // 2. Si es exitoso, redirigimos al Home o Admin
      navigate("/");
    } else {
      // 3. Si falla, mostramos el mensaje que viene del Backend (o Contexto)
      setError(resultado.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>
        
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@duoc.cl"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></small>
        </div>
      </div>
    </div>
  );
}