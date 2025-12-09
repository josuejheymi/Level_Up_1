import React, { useState } from "react";
// 🚨 CORRECCIÓN: Importamos el archivo de lógica (.logic.js), NO el de pruebas (.spec.js)
import "../utils/About.logic.js"; 

/**
 * Componente: Sobre Nosotros & Contacto
 * ----------------------------------------------------
 * Responsabilidad: Mostrar información institucional y formulario de contacto.
 * * Lógica de Negocio: 
 * Se ha extraído a 'src/utils/About.logic.js' para cumplir con el requerimiento
 * de pruebas unitarias independientes con Jasmine/Karma.
 */
export default function About() {
  
  // 1. ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comentario: ""
  });

  // 2. ESTADOS DE FEEDBACK
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // =================================================================
    // USO DE LÓGICA EXTERNA (window.AboutLogic)
    // =================================================================

    // 1. Validar Nombre (Simple check o función externa si la creaste)
    if (!formData.nombre.trim()) {
        setError("El nombre es obligatorio.");
        return;
    }

    // 2. Validar Email (Lógica compleja extraída)
    if (!window.AboutLogic.validateEmail(formData.email)) {
      setError("Solo permitimos correos: @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return; 
    }

    // 3. Validar Longitud (Lógica extraída)
    if (!window.AboutLogic.validateCommentLength(formData.comentario)) {
        setError("El comentario es muy largo (máximo 500 caracteres).");
        return;
    }

    // =================================================================
    // FIN LÓGICA EXTERNA
    // =================================================================

    // ÉXITO
    setSuccess(true);
    setFormData({ nombre: "", email: "", comentario: "" });
  };

  return (
    <div className="container my-5 fade-in">
      
      {/* =================================================================
          SECCIÓN 1: SOBRE NOSOTROS (Visual)
         ================================================================= */}
      <section className="text-center mb-5">
        <h1 className="display-4 fw-bold text-white text-uppercase mb-3">
            Level Up <span className="text-primary">Team</span>
        </h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: "700px" }}>
            Somos expertos en la venta de artículos electrónicos y videojuegos. 
            Nuestra misión es llevar la mejor tecnología a tu setup con precios justos y envíos rápidos a todo Chile.
        </p>
        
        {/* ICONOS DECORATIVOS (SVGs) */}
        <div className="d-flex justify-content-center flex-wrap gap-4 mt-4 text-white">
            
            {/* Card 1 */}
            <div className="p-3 bg-dark border border-secondary rounded-3 shadow-sm hover-lift" style={{width: "150px"}}>
                <div className="mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" stroke="var(--accent-primary)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <small className="fw-bold">Envíos Rápidos</small>
            </div>

            {/* Card 2 */}
            <div className="p-3 bg-dark border border-secondary rounded-3 shadow-sm hover-lift" style={{width: "150px"}}>
                <div className="mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" stroke="var(--accent-primary)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 2.5-7.5L3 9h7z"/></svg>
                </div>
                <small className="fw-bold">Calidad Premium</small>
            </div>

            {/* Card 3 */}
            <div className="p-3 bg-dark border border-secondary rounded-3 shadow-sm hover-lift" style={{width: "150px"}}>
                <div className="mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" stroke="var(--accent-primary)" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>
                </div>
                <small className="fw-bold">Garantía Total</small>
            </div>
        </div>
      </section>

      <hr className="my-5 border-secondary" />

      {/* =================================================================
          SECCIÓN 2: FORMULARIO DE CONTACTO
         ================================================================= */}
      <section className="row justify-content-center">
        <div className="col-lg-8">
            <div className="card bg-dark border-secondary shadow-lg">
                
                <div className="card-header bg-transparent border-bottom border-secondary text-center py-3">
                    <h3 className="fw-bold text-white m-0">📩 Contáctanos</h3>
                    <p className="text-muted small mb-0">¿Tienes dudas? Te respondemos a la brevedad.</p>
                </div>
                
                <div className="card-body p-4">
                    
                    {/* ALERTA ERROR (Con SVG) */}
                    {error && (
                      <div className="alert alert-danger fw-bold d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="#f87171" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* ALERTA ÉXITO (Con SVG) */}
                    {success && (
                      <div className="alert alert-success fw-bold d-flex align-items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="#4ade80" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        <span>¡Mensaje enviado! Gracias por escribirnos.</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-primary fw-bold">Nombre</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-secondary text-white border-0" 
                                    name="nombre"
                                    value={formData.nombre} 
                                    onChange={handleChange} 
                                    required
                                    placeholder="Tu nombre"
                                />
                            </div>
                            
                            <div className="col-md-6 mb-3">
                                <label className="form-label text-primary fw-bold">Correo</label>
                                <input 
                                    type="email" 
                                    className="form-control bg-secondary text-white border-0" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="nombre@duoc.cl"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-primary fw-bold">Mensaje</label>
                            <textarea 
                                className="form-control bg-secondary text-white border-0" 
                                name="comentario"
                                rows="4"
                                value={formData.comentario}
                                onChange={handleChange}
                                required
                                maxLength="500"
                                placeholder="Escribe tu consulta aquí..."
                            ></textarea>
                            <div className="text-end text-muted small mt-1">
                                {formData.comentario.length} / 500
                            </div>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary fw-bold rounded-pill hover-scale shadow">
                                ENVIAR MENSAJE
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}