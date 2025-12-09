import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Components/user/UserContext";

/**
 * COMPONENTE: REGISTRO DE USUARIO (Sign Up)
 * ----------------------------------------------------
 * Responsabilidad: Capturar datos nuevos, validarlos y crear una cuenta.
 * * Conceptos Clave:
 * 1. Validación Local: Comprobamos que las contraseñas coincidan antes de enviar nada.
 * 2. Toggle Visibility: Permitimos al usuario ver su contraseña mientras escribe.
 * 3. Feedback Visual: Uso de clases 'is-invalid' de Bootstrap para errores visuales.
 */
export default function Register() {
  
  // 1. HOOKS
  const navigate = useNavigate();
  const { register } = useUser(); // Función del contexto para crear cuenta

  // 2. ESTADOS
  
  // Estado del formulario (Datos para el Backend)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    codigoReferido: ""
  });

  // Estado Local (Solo Frontend): Confirmación de contraseña
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estado Visual: Mostrar/Ocultar contraseña (Ojo)
  const [showPassword, setShowPassword] = useState(false);

  // Estados de carga y error
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 3. EFECTO: Scroll Up
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // VALIDACIÓN LOCAL 1: Contraseñas iguales
    if (formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Inténtalo de nuevo.");
      return; 
    }

    // VALIDACIÓN LOCAL 2: Longitud mínima (Opcional, si el backend no lo valida)
    if (formData.password.length < 4) {
        setError("La contraseña es muy corta (mínimo 4 caracteres).");
        return;
    }

    setLoading(true); // Bloqueamos el botón

    // Enviamos los datos al Contexto (que habla con la API)
    const resultado = await register(formData);

    setLoading(false); // Desbloqueamos

    if (resultado.success) {
      // Éxito: Navegamos al login o directo al home (según lógica del contexto)
      alert("✅ ¡Cuenta creada exitosamente! Bienvenido a Level Up.");
      navigate("/"); // El contexto ya hizo auto-login, así que vamos al home
    } else {
      // Error: Mostramos el mensaje del backend (ej: "Email ya existe")
      setError(resultado.message || "Error al registrar usuario.");
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="container d-flex justify-content-center align-items-center py-5 min-vh-100 fade-in">
      <div className="card shadow-lg p-4 bg-dark text-white border border-secondary" style={{ width: "100%", maxWidth: "500px" }}>
        
        <div className="text-center mb-4">
            <h2 className="fw-bold text-uppercase text-success">Crear Cuenta</h2>
            <p className="text-secondary small">Únete a la comunidad gamer más grande de Chile</p>
        </div>
        
        {/* ALERTA DE ERROR */}
        {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small fw-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* CAMPO: NOMBRE */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">NOMBRE COMPLETO</label>
            <input
              type="text"
              className="form-control bg-black text-white border-secondary"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          {/* CAMPO: EMAIL */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">CORREO ELECTRÓNICO</label>
            <input
              type="email"
              className="form-control bg-black text-white border-secondary"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="gamer@duoc.cl"
            />
            <div className="form-text text-success small mt-1">
              💡 Tip: Usa tu correo <strong>@duoc.cl</strong> para descuentos VIP.
            </div>
          </div>

          {/* --- SECCIÓN DE CONTRASEÑAS (Grid de 2 columnas) --- */}
          <div className="row g-2">
            
            {/* Password Original */}
            <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold text-secondary">CONTRASEÑA</label>
                <input
                  // Tipo dinámico: "text" si showPassword es true, "password" si es false
                  type={showPassword ? "text" : "password"} 
                  className="form-control bg-black text-white border-secondary"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="4"
                  placeholder="Mínimo 4 caracteres"
                />
            </div>

            {/* Confirmar Password */}
            <div className="col-md-6 mb-3">
                <label className="form-label small fw-bold text-secondary">REPETIR CLAVE</label>
                <input
                  type={showPassword ? "text" : "password"}
                  // Validación Visual: Si escribió algo y no coincide, pintamos el borde rojo (is-invalid)
                  className={`form-control bg-black text-white border-secondary ${
                      confirmPassword && formData.password !== confirmPassword ? "is-invalid border-danger" : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repite tu clave"
                />
            </div>
          </div>

          {/* TOGGLE: MOSTRAR CONTRASEÑA */}
          <div className="mb-3 form-check">
            <input 
                type="checkbox" 
                className="form-check-input bg-dark border-secondary" 
                id="showPassCheck"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label text-secondary small" htmlFor="showPassCheck">
                Mostrar contraseñas
            </label>
          </div>

          <div className="row g-2">
            {/* CAMPO: FECHA NACIMIENTO */}
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-secondary">FECHA NACIMIENTO</label>
              <input
                type="date"
                className="form-control bg-black text-white border-secondary"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </div>

            {/* CAMPO: CÓDIGO REFERIDO (Opcional) */}
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold text-secondary">CÓD. REFERIDO</label>
              <input
                type="text"
                className="form-control bg-black text-white border-secondary"
                name="codigoReferido"
                value={formData.codigoReferido}
                onChange={handleChange}
                placeholder="(Opcional)"
              />
            </div>
          </div>

          {/* BOTÓN REGISTRAR */}
          <button 
            type="submit" 
            className="btn btn-success w-100 py-2 fw-bold shadow-sm hover-scale mt-2"
            disabled={loading}
          >
            {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Registrando...</span>
            ) : (
                "Crear Cuenta"
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="small text-secondary mb-0">¿Ya tienes cuenta? <Link to="/login" className="text-success fw-bold text-decoration-none hover-underline">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}