import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Components/user/UserContext";
import api from "../config/api";

export default function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
    fechaNacimiento: ""
  });

  // NUEVO ESTADO: Para guardar las órdenes que vienen de Java
  const [ordenes, setOrdenes] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(true);

  const [mensaje, setMensaje] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  // EFECTO: Cargar datos de usuario Y cargar órdenes
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        password: "",
        fechaNacimiento: user.fechaNacimiento || ""
      });

      // --- CARGAR HISTORIAL DE COMPRAS ---
      const fetchOrdenes = async () => {
        try {
          const response = await api.get(`/ordenes/usuario/${user.id}`);
          setOrdenes(response.data);
        } catch (error) {
          console.error("Error cargando órdenes:", error);
        } finally {
          setLoadingOrdenes(false);
        }
      };
      fetchOrdenes();

    } else {
      navigate("/");
    }
  }, [user, navigate]);

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
      await api.put(`/usuarios/${user.id}`, formData);
      setMensaje({ type: "success", text: "✅ Perfil actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje({ type: "danger", text: "❌ Error al actualizar perfil" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container py-5">
      <div className="row">
        {/* COLUMNA IZQUIERDA: DATOS PERSONALES */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-header bg-primary text-white text-center py-4">
              <h4 className="mb-0">Mi Perfil</h4>
              <p className="mb-0 opacity-75">{user.email}</p>
              {user.esEstudianteDuoc && (
                <span className="badge bg-warning text-dark mt-2">✨ Miembro Duoc VIP</span>
              )}
            </div>

            <div className="card-body p-4">
              {mensaje.text && (
                <div className={`alert alert-${mensaje.type} text-center`}>{mensaje.text}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Fecha Nacimiento</label>
                  <input type="date" className="form-control" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Contraseña</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Cambiar contraseña..." />
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary fw-bold" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL DE COMPRAS (NUEVO) */}
        <div className="col-md-7">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0 fw-bold text-dark">📦 Mis Pedidos</h4>
            </div>
            <div className="card-body p-0">
              {loadingOrdenes ? (
                <div className="text-center py-5">Cargando historial...</div>
              ) : ordenes.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <h5>Aún no has realizado compras</h5>
                  <p>¡Explora nuestro catálogo y sube de nivel!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th># Orden</th>
                        <th>Fecha</th>
                        <th>Productos</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenes.map((orden) => (
                        <tr key={orden.id}>
                          <td className="fw-bold">#{orden.id}</td>
                          <td>
                            {new Date(orden.fecha).toLocaleDateString()} 
                            <small className="text-muted d-block">
                                {new Date(orden.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </small>
                          </td>
                          <td>
                            <ul className="list-unstyled mb-0 small">
                              {orden.detalles.map((d, index) => (
                                <li key={index}>
                                  {d.cantidad}x {d.producto?.nombre || "Producto"}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-end fw-bold text-success">
                            ${orden.total?.toLocaleString()}
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