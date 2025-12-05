import React, { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: '',
    });
    const [status, setStatus] = useState(''); // 'success', 'error', 'loading'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        // Simulación: En un proyecto real, aquí usarías Axios para hacer un POST
        // a un endpoint de Spring Boot /api/contacto o un servicio de email (JavaMailSender)
        console.log('Datos enviados:', formData);
        
        // Simulación de espera del servidor
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        // Simulación de respuesta exitosa
        setStatus('success');
        setFormData({ nombre: '', email: '', mensaje: '' });
    };

    return (
        <div className="container py-5 fade-in" style={{ maxWidth: '800px' }}>
            <h1 className="fw-bold text-center mb-4 text-white">
                Contáctanos
            </h1>
            <p className="lead text-center text-secondary mb-5">
                ¿Tienes preguntas sobre nuestros productos o tu pedido? Te responderemos lo antes posible.
            </p>

            <div className="card shadow-lg border-secondary bg-dark p-4 p-md-5">
                <div className="card-body">
                    
                    {status === 'success' && (
                        <div className="alert alert-success fw-bold text-center">
                            ✅ ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.
                        </div>
                    )}
                    
                    {status === 'error' && (
                        <div className="alert alert-danger text-center">
                            ❌ Error al enviar el mensaje. Inténtalo de nuevo.
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Nombre */}
                        <div className="mb-3">
                            <label className="form-label text-white">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label text-white">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Mensaje */}
                        <div className="mb-4">
                            <label className="form-label text-white">Mensaje</label>
                            <textarea
                                className="form-control"
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                rows="5"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-3 fw-bold"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Enviando...
                                </>
                            ) : (
                                "Enviar Mensaje"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            
            <div className="text-center mt-5">
                <h5 className="fw-bold text-success">Level Up Gamer - Datos de Contacto</h5>
                <p className="text-secondary mb-1">📍 Santiago, Chile</p>
                <p className="text-secondary">📧 contacto@levelup.cl</p>
            </div>
        </div>
    );
}