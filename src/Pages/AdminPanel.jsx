import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../Components/products/ProductContext";
import { useBlog } from "../Components/blog/BlogContext";
import ProductForm from "../Components/forms/ProductForm";
import BlogForm from "../Components/forms/BlogForm";
import api from "../config/api"; 

export default function AdminPanel() {
  const { allProducts, deleteProduct } = useProducts();
  const { posts, deletePost } = useBlog();
  
  // Estado de navegación y formularios
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  
  // Estados de datos del backend
  const [stats, setStats] = useState({ totalVentas: 0, cantidadOrdenes: 0 });
  const [orders, setOrders] = useState([]);

  // 1. Cargar Estadísticas y Órdenes según la pestaña
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'dashboard') {
          const res = await api.get("/ordenes/stats");
          setStats(res.data);
        } else if (activeTab === 'orders') {
          const res = await api.get("/ordenes");
          setOrders(res.data.sort((a, b) => b.id - a.id)); // Ordenar por más reciente
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, [activeTab]);

  // 2. CÁLCULO DINÁMICO: Top Categorías (Basado en Inventario Real)
  const topCategories = useMemo(() => {
    if (!allProducts.length) return [];
    
    const counts = {};
    // Contamos cuántos productos hay por categoría
    allProducts.forEach(p => {
        const cat = p.categoria || "Sin Categoría";
        counts[cat] = (counts[cat] || 0) + 1;
    });

    // Convertimos a array, ordenamos de mayor a menor y tomamos el top 4
    return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([name, count]) => ({
            name,
            count,
            percent: Math.round((count / allProducts.length) * 100)
        }));
  }, [allProducts]);

  // Lógicas de borrado
  const handleDeleteProduct = async (id, nombre) => {
    if (window.confirm(`¿Eliminar producto "${nombre}"?`)) await deleteProduct(id);
  };
  
  const handleDeletePost = async (id, title) => {
    if (window.confirm(`¿Eliminar noticia "${title}"?`)) await deletePost(id);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      {/* === SIDEBAR IZQUIERDO === */}
      <aside className="bg-dark text-white p-3 d-flex flex-column" style={{ width: "260px", flexShrink: 0 }}>
        <div className="mb-5 text-center py-3 border-bottom border-secondary">
          <h4 className="m-0 fw-bold">⚡ Admin Panel</h4>
          <small className="text-white-50">LevelUp Store</small>
        </div>
        
        <nav className="nav flex-column gap-2">
          <button 
            className={`btn text-start text-white py-2 ${activeTab === 'dashboard' ? 'bg-primary' : 'btn-dark'}`}
            onClick={() => handleTabChange('dashboard')}
          >
            📊 Resumen
          </button>
          <button 
            className={`btn text-start text-white py-2 ${activeTab === 'orders' ? 'bg-primary' : 'btn-dark'}`}
            onClick={() => handleTabChange('orders')}
          >
            🛍️ Ventas
          </button>
          <button 
            className={`btn text-start text-white py-2 ${activeTab === 'products' ? 'bg-primary' : 'btn-dark'}`}
            onClick={() => handleTabChange('products')}
          >
            📦 Inventario
          </button>
          <button 
            className={`btn text-start text-white py-2 ${activeTab === 'blog' ? 'bg-primary' : 'btn-dark'}`}
            onClick={() => handleTabChange('blog')}
          >
            📰 Noticias
          </button>
        </nav>

        <div className="mt-auto pt-3 border-top border-secondary text-center small text-white-50">
          v1.0.0
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto", maxHeight: "100vh" }}>
        
        <header className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold m-0 text-dark">Panel de Control</h2>
            <p className="text-muted">Gestión integral de tu tienda.</p>
          </div>
          <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow" style={{width: 40, height: 40}}>A</div>
        </header>

        {/* === VISTA 1: DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="fade-in">
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card bg-dark text-white border-0 shadow h-100 p-3">
                  <div className="card-body">
                    <h6 className="opacity-75 text-uppercase">Ventas Totales</h6>
                    <h2 className="fw-bold my-3">
                        ${stats.totalVentas?.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                    </h2>
                    <span className="badge bg-secondary">{stats.cantidadOrdenes} Órdenes</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 p-3">
                  <div className="card-body">
                    <h6 className="text-muted text-uppercase">Productos Activos</h6>
                    <h2 className="fw-bold my-3 text-dark">{allProducts.length}</h2>
                    <small className="text-muted">En catálogo</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 p-3">
                  <div className="card-body">
                    <h6 className="text-muted text-uppercase">Noticias</h6>
                    <h2 className="fw-bold my-3 text-dark">{posts.length}</h2>
                    <small className="text-success fw-bold">Publicadas</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección Inferior: Gráficos Simulados + Categorías Reales */}
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-4">Actividad Reciente</h5>
                  <div className="d-flex align-items-end justify-content-around" style={{ height: "200px" }}>
                    {/* Barras simuladas de actividad */}
                    {[40, 60, 30, 80, 55, 90, 70].map((h, i) => (
                        <div key={i} className={`rounded-top ${i===5 ? 'bg-primary' : 'bg-primary opacity-50'}`} style={{width: "8%", height: `${h}%`}}></div>
                    ))}
                  </div>
                  <div className="d-flex justify-content-around mt-2 text-muted small">
                    <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
                  </div>
                </div>
              </div>
              
              {/* TOP CATEGORÍAS REALES */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-4">Top Categorías</h5>
                  <ul className="list-group list-group-flush">
                    {topCategories.length > 0 ? topCategories.map((cat, index) => {
                        const colors = ["bg-primary", "bg-info", "bg-warning", "bg-success"];
                        return (
                            <React.Fragment key={cat.name}>
                                <li className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                                    <span>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🔹'} {cat.name}</span> 
                                    <span className="fw-bold">{cat.percent}% ({cat.count})</span>
                                </li>
                                <div className="progress mb-3" style={{height: "6px"}}>
                                    <div className={`progress-bar ${colors[index % 4]}`} style={{width: `${cat.percent}%`}}></div>
                                </div>
                            </React.Fragment>
                        );
                    }) : (
                        <p className="text-muted small">No hay datos suficientes.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === VISTA 2: VENTAS (ÓRDENES) === */}
        {activeTab === 'orders' && (
          <div className="fade-in">
            <h3 className="fw-bold mb-4">Historial de Ventas</h3>
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="ps-4">ID</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Detalle</th>
                      <th className="text-end pe-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? orders.map(orden => (
                      <tr key={orden.id}>
                        <td className="ps-4 fw-bold">#{orden.id}</td>
                        <td>
                          <div className="fw-bold">{orden.usuario?.nombre}</div>
                          <small className="text-muted">{orden.usuario?.email}</small>
                        </td>
                        <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                        <td>
                          <small className="text-muted">{orden.detalles.length} productos</small><br/>
                          <small className="text-primary fst-italic">📍 {orden.direccionEnvio}</small>
                        </td>
                        <td className="text-end pe-4 fw-bold text-success">
                          ${orden.total?.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5" className="text-center py-5 text-muted">No hay ventas registradas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === VISTA 3: INVENTARIO === */}
        {activeTab === 'products' && (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">Inventario</h3>
              <button className={`btn ${showForm ? 'btn-secondary' : 'btn-success'} rounded-pill px-4 fw-bold shadow-sm`} onClick={() => setShowForm(!showForm)}>
                {showForm ? "✖ Cerrar" : "➕ Nuevo Producto"}
              </button>
            </div>

            {showForm && <div className="card border-0 shadow-sm mb-4"><ProductForm onSuccess={() => setShowForm(false)} /></div>}

            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-secondary">
                    <tr>
                      <th className="ps-4 py-3">PRODUCTO</th>
                      <th>CATEGORÍA</th>
                      <th>PRECIO</th>
                      <th>STOCK</th>
                      <th className="text-end pe-4">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProducts.map(p => (
                      <tr key={p.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <img src={p.imagenUrl} alt="" className="rounded border me-3 bg-white" style={{width: 40, height: 40, objectFit: 'contain'}} />
                            <span className="fw-bold text-dark">{p.nombre}</span>
                          </div>
                        </td>
                        <td><span className="badge bg-light text-dark border">{p.categoria}</span></td>
                        <td className="fw-bold text-primary">${p.precio?.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</td>
                        <td><span className={`badge ${p.stock < 5 ? 'bg-danger' : 'bg-success'}`}>{p.stock} u.</span></td>
                        <td className="text-end pe-4">
                          <button className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2" onClick={() => handleDeleteProduct(p.id, p.nombre)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === VISTA 4: BLOG === */}
        {activeTab === 'blog' && (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">Noticias</h3>
              <button className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} rounded-pill px-4 fw-bold shadow-sm`} onClick={() => setShowForm(!showForm)}>
                {showForm ? "✖ Cerrar" : "✏️ Redactar"}
              </button>
            </div>

            {showForm && <div className="card border-0 shadow-sm mb-4"><BlogForm onSuccess={() => setShowForm(false)} /></div>}
            
            <div className="row g-4">
              {posts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <img src={post.imagenUrl} className="card-img-top" alt="blog" style={{height: "150px", objectFit: "cover"}} />
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{post.titulo}</h5>
                      <p className="card-text small text-muted text-truncate">{post.contenido}</p>
                      <button className="btn btn-sm btn-outline-danger w-100" onClick={() => handleDeletePost(post.id, post.titulo)}>🗑️ Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}