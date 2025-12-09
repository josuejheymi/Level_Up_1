import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { useUser } from "../Components/user/UserContext";
import api from "../config/api";

/**
 * Componente: Perfil de Usuario
 * Responsabilidad: Mostrar datos personales, permitir editarlos y listar el historial de compras.
 * * Conceptos Clave:
 * 1. Carga Paralela: Cargamos datos del usuario (Contexto) y sus órdenes (API) al mismo tiempo.
 * 2. Edición Parcial: Permitimos actualizar la contraseña solo si el usuario escribe una nueva.
 * 3. Ordenamiento: Mostramos las compras más recientes primero (.sort).
 */
export default function Profile() {
  
  // 1. HOOKS
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // 2. ESTADOS
  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
    fechaNacimiento: ""
  });

  const [ordenes, setOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(true);
  const [loading, setLoading] = useState(false); // Para el botón de "Guardar"
  const [mensaje, setMensaje] = useState({ type: "", text: "" });

  // 3. EFECTO: Carga Inicial
  useEffect(() => {
    // Si no hay usuario logueado, expulsar al Home
    if (!user) {
      navigate("/");
      return;
    }

    // A. Llenar formulario con datos actuales
    setFormData({
      nombre: user.nombre || "",
      password: "", // Contraseña vacía por seguridad
      fechaNacimiento: user.fechaNacimiento || ""
    });

    // B. Cargar Historial de Compras (Fetch)
    const fetchOrdenes = async () => {
      try {
        const response = await api.get(`/ordenes/usuario/${user.id}`);
        // Ordenamos: ID más alto (más nuevo) primero
        const ordenesOrdenadas = response.data.sort((a, b) => b.id - a.id);
        setOrdenes(ordenesOrdenadas);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoadingOrdenes(false);
      }
    };
    fetchOrdenes();

  }, [user, navigate]);

  // --- HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ type: "", text: "" });

    try {
      // Enviamos PUT al backend. El backend debe ignorar la password si viene vacía.
      await api.put(`/usuarios/${user.id}`, formData);
      setMensaje({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje({ type: "danger", text: "Error al actualizar perfil" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // --- RENDERIZADO ---
  return (
    <div className="container py-5 fade-in">
      <div className="row g-4">
        
        {/* === COLUMNA IZQUIERDA: DATOS PERSONALES === */}
        <div className="col-lg-4">
          <div className="card shadow-lg border-secondary bg-dark text-white h-100">
            
            {/* Cabecera Perfil */}
            <div className="card-header bg-black text-white text-center py-4 border-bottom border-secondary position-relative overflow-hidden">
                <div className="mb-3">
                    {/* Icono Usuario Grande */}
                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{width: 80, height: 80}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                </div>
                <h4 className="mb-0 fw-bold">{user.nombre}</h4>
                <p className="mb-2 text-secondary small">{user.email}</p>
                
                {user.esEstudianteDuoc && (
                    <span className="badge bg-primary text-black border border-white">
                        ✨ Duoc VIP Member
                    </span>
                )}
            </div>

            <div className="card-body p-4">
              {/* Mensajes de Feedback */}
              {mensaje.text && (
                <div className={`alert alert-${mensaje.type} text-center py-2 small fw-bold mb-4`}>
                    {mensaje.type === 'success' ? '✅ ' : '❌ '}{mensaje.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">NOMBRE COMPLETO</label>
                  <input type="text" className="form-control bg-black text-white border-secondary" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">FECHA NACIMIENTO</label>
                  <input type="date" className="form-control bg-black text-white border-secondary" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                </div>
                
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">CONTRASEÑA</label>
                  <input type="password" className="form-control bg-black text-white border-secondary" name="password" value={formData.password} onChange={handleChange} placeholder="(Dejar vacío para mantener)" />
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary fw-bold" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button type="button" className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Cerrar Sesión
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* === COLUMNA DERECHA: HISTORIAL DE COMPRAS === */}
        <div className="col-lg-8">
          <div className="card shadow-lg border-secondary bg-dark text-white h-100">
            <div className="card-header bg-transparent border-bottom border-secondary py-3 d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  Mis Pedidos
              </h4>
              <span className="badge bg-secondary border border-dark text-white">{ordenes.length} compras</span>
            </div>
            
            <div className="card-body p-0">
              {loadingOrdenes ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : ordenes.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <div className="mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  </div>
                  <h5 className="text-white">Aún no has realizado compras</h5>
                  <p>¡Explora nuestro catálogo y sube de nivel!</p>
                  <Link to="/" className="btn btn-outline-light rounded-pill mt-2 px-4 hover-scale">Ir a la Tienda</Link>
                </div>
              ) : (
                
                // TABLA DE ÓRDENES
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0 align-middle">
                    <thead className="bg-black text-secondary text-uppercase small">
                      <tr>
                        <th className="ps-4 py-3"># Orden</th>
                        <th>Fecha</th>
                        <th>Resumen</th>
                        <th className="text-end">Total</th>
                        <th className="text-center pe-4">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="border-top border-secondary">
                      {ordenes.map((orden) => (
                        <tr key={orden.id}>
                          {/* ID */}
                          <td className="ps-4 fw-bold text-primary">#{orden.id}</td>
                          
                          {/* FECHA (Manejo seguro de nulos) */}
                          <td>
                            {orden.fechaCreacion ? (
                                <>
                                    <div className="text-white">{new Date(orden.fechaCreacion).toLocaleDateString()}</div> 
                                    <small className="text-muted" style={{fontSize: "0.75rem"}}>
                                        {new Date(orden.fechaCreacion).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </small>
                                </>
                            ) : (
                                <span className="badge bg-secondary text-black">Antigua</span>
                            )}
                          </td>
                          
                          {/* RESUMEN PRODUCTOS */}
                          <td>
                            <ul className="list-unstyled mb-0 small text-muted">
                              {/* Mostramos solo los primeros 2 productos para no saturar */}
                              {orden.detalles?.slice(0, 2).map((d, index) => (
                                <li key={index} className="text-truncate" style={{maxWidth: "200px"}}>
                                  • {d.cantidad}x <span className="text-light">{d.producto?.nombre || "Producto eliminado"}</span>
                                </li>
                              ))}
                              {orden.detalles?.length > 2 && (
                                <li className="text-primary fst-italic">...y {orden.detalles.length - 2} más</li>
                              )}
                            </ul>
                          </td>
                          
                          {/* TOTAL */}
                          <td className="text-end fw-bold text-success">
                            ${orden.total?.toLocaleString()}
                          </td>
                          
                          {/* BOTÓN VER DETALLE */}
                          <td className="text-center pe-4">
                            <Link 
                                to={`/ordenes/${orden.id}`} 
                                className="btn btn-sm btn-outline-light rounded-pill px-3 hover-scale d-inline-flex align-items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                Ver
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}