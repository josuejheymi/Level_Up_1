import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Components/user/UserContext"; 

/**
 * COMPONENTE: LOGIN (Inicio de Sesión)
 * ----------------------------------------------------
 * Responsabilidad: Autenticar al usuario contra el backend y guardar la sesión.
 * * Conceptos Clave:
 * 1. Gestión de Formularios: Captura inputs y previene recarga (e.preventDefault).
 * 2. Consumo de Contexto: Usa 'login()' del UserContext para la lógica de negocio.
 * 3. Feedback Visual: Muestra estados de carga (Spinner) y errores en tiempo real.
 */
export default function Login() {
  
  // 1. ESTADOS LOCALES
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Bloquea el botón mientras carga

  // 2. HOOKS
  const navigate = useNavigate(); // Para redirigir tras el login
  const { login } = useUser();    // Función importada del Contexto

  // 3. EFECTO: Scroll Up
  // Al cargar la pantalla, asegura que la vista empiece arriba.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");      // Limpiamos errores previos
    setLoading(true);  // Activamos spinner

    // A. Llamada al Contexto (Asíncrona)
    // El contexto se encarga de hablar con la API y guardar el token en localStorage.
    const resultado = await login(formData.email, formData.password);

    setLoading(false); // Desactivamos spinner

    // B. Manejo de Respuesta
    if (resultado.success) {
      // Éxito: Redirigimos al Home ("/") o al Dashboard
      navigate("/");
    } else {
      // Fallo: Mostramos el mensaje que devolvió el backend o uno genérico
      setError(resultado.message || "Credenciales incorrectas.");
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 fade-in">
      
      {/* TARJETA DE LOGIN (Estilo Oscuro) */}
      <div className="card p-4 shadow-lg bg-dark text-white border border-secondary" style={{ width: "100%", maxWidth: "400px" }}>
        
        {/* CABECERA */}
        <div className="text-center mb-4">
            <h2 className="fw-bold text-uppercase text-primary">Level Up</h2>
            <p className="text-secondary small">Bienvenido de vuelta, jugador.</p>
        </div>
        
        {/* ALERTA DE ERROR */}
        {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small fw-bold" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* INPUT: EMAIL */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">CORREO ELECTRÓNICO</label>
            <div className="input-group">
                <span className="input-group-text bg-black border-secondary text-secondary">
                    {/* Icono Arroba */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                </span>
                <input
                    type="email"
                    className="form-control bg-black text-white border-secondary"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@duoc.cl"
                />
            </div>
          </div>

          {/* INPUT: PASSWORD */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">CONTRASEÑA</label>
            <div className="input-group">
                <span className="input-group-text bg-black border-secondary text-secondary">
                    {/* Icono Candado */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </span>
                <input
                    type="password"
                    className="form-control bg-black text-white border-secondary"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                />
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-bold shadow-sm hover-scale"
            disabled={loading} // Deshabilitar si está cargando
          >
            {loading ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span>Iniciando...</span>
            ) : (
                "Ingresar"
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <small className="text-secondary">¿No tienes cuenta? </small>
          <Link to="/register" className="text-primary fw-bold text-decoration-none hover-underline">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}