import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Conectamos con el Contexto de Usuario que ya configuramos
import { useUser } from "../Components/user/UserContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useUser(); // Función del contexto

  // Estado del formulario con los campos exactos que espera Java
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    codigoReferido: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Llamamos a la función register del Contexto
    // Esta función se encarga de hablar con Axios y el Backend
    const resultado = await register(formData);

    setLoading(false);

    if (resultado.success) {
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      navigate("/login"); // Redirigir al login
    } else {
      // Mostramos el mensaje de error que viene desde Java (ej: "Menor de edad")
      setError(resultado.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5 min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "500px" }}>
        
        <h2 className="text-center mb-4 fw-bold">Crear Cuenta</h2>
        
        {/* Mensaje de Error dinámico */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* NOMBRE */}
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="nombre@ejemplo.com"
            />
            <div className="form-text text-primary">
              💡 Tip: Usa tu correo <strong>@duoc.cl</strong> para 20% de descuento vitalicio.
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="4"
            />
          </div>

          <div className="row">
            {/* FECHA NACIMIENTO (Vital para la validación +18) */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Fecha de Nacimiento</label>
              <input
                type="date"
                className="form-control"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>

            {/* CÓDIGO REFERIDO (Opcional) */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Cód. Referido (Opcional)</label>
              <input
                type="text"
                className="form-control"
                name="codigoReferido"
                value={formData.codigoReferido}
                onChange={handleChange}
                placeholder="Ej: A1B2C3"
              />
            </div>
          </div>

          {/* BOTÓN SUBMIT */}
          <button 
            type="submit" 
            className="btn btn-success w-100 py-2 fw-bold mt-3"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}