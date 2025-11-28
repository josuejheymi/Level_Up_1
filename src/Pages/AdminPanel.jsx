import React, { useState, useEffect } from "react";
import { useProducts } from "../Components/products/ProductContext";
import { useBlog } from "../Components/blog/BlogContext"; // <--- Importar Contexto Blog
import ProductForm from "../Components/forms/ProductForm";
import BlogForm from "../Components/forms/BlogForm"; // <--- Importar Formulario Blog
import api from "../config/api"; 

export default function AdminPanel() {
  const { allProducts, deleteProduct } = useProducts();
  const { posts, deletePost } = useBlog(); // <--- Usar funciones del Blog
  
  // Estado para pestañas: 'dashboard', 'products', 'blog'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  
  const [stats, setStats] = useState({ totalVentas: 0, cantidadOrdenes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/ordenes/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error cargando stats:", error);
      }
    };
    if (activeTab === 'dashboard') fetchStats();
  }, [activeTab]);

  const handleDeleteProduct = async (id, nombre) => {
    if (window.confirm(`¿Eliminar producto "${nombre}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleDeletePost = async (id, title) => {
    if (window.confirm(`¿Eliminar noticia "${title}"?`)) {
      await deletePost(id);
    }
  };

  // Reseteamos el formulario al cambiar de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      
      {/* === SIDEBAR === */}
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
            className={`btn text-start text-white py-2 ${activeTab === 'products' ? 'bg-primary' : 'btn-dark'}`}
            onClick={() => handleTabChange('products')}
          >
            📦 Inventario
          </button>
          {/* BOTÓN NUEVO PARA BLOG */}
          <button 
            className={`btn text-start text-white py-2 ${activeTab === 'blog' ? 'bg-primary' : 'btn-dark'}`}
            onClick={() => handleTabChange('blog')}
          >
            📰 Noticias (Blog)
          </button>
        </nav>

        <div className="mt-auto pt-3 border-top border-secondary text-center small text-white-50">
          v1.0.0
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto", maxHeight: "100vh" }}>
        
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold m-0 text-dark">Panel de Control</h2>
            <p className="text-muted">Gestión integral de la tienda.</p>
          </div>
          <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow" style={{width: 40, height: 40}}>
            A
          </div>
        </header>

        {/* === VISTA 1: DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="fade-in">
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card bg-dark text-white border-0 shadow h-100 p-3">
                  <div className="card-body">
                    <h6 className="opacity-75 text-uppercase">Ventas Totales</h6>
                    <h2 className="fw-bold my-3">${stats.totalVentas?.toLocaleString()}</h2>
                    <span className="badge bg-secondary">{stats.cantidadOrdenes} Órdenes</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 p-3">
                  <div className="card-body">
                    <h6 className="text-muted text-uppercase">Productos</h6>
                    <h2 className="fw-bold my-3 text-dark">{allProducts.length}</h2>
                    <small className="text-muted">En inventario</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100 p-3">
                  <div className="card-body">
                    <h6 className="text-muted text-uppercase">Noticias Publicadas</h6>
                    <h2 className="fw-bold my-3 text-dark">{posts.length}</h2>
                    <small className="text-muted">En el blog</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === VISTA 2: INVENTARIO (PRODUCTOS) === */}
        {activeTab === 'products' && (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">Inventario</h3>
              <button 
                className={`btn ${showForm ? 'btn-secondary' : 'btn-success'} rounded-pill px-4 fw-bold shadow-sm`}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "✖ Cerrar" : "➕ Nuevo Producto"}
              </button>
            </div>

            {showForm && (
              <div className="card border-0 shadow-sm mb-4">
                <ProductForm onSuccess={() => setShowForm(false)} />
              </div>
            )}

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
                        <td className="fw-bold text-primary">${p.precio?.toLocaleString()}</td>
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

        {/* === VISTA 3: NOTICIAS (BLOG) === */}
        {activeTab === 'blog' && (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">Gestión de Noticias</h3>
              <button 
                className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} rounded-pill px-4 fw-bold shadow-sm`}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "✖ Cerrar" : "✏️ Redactar Noticia"}
              </button>
            </div>

            {showForm && (
              <div className="card border-0 shadow-sm mb-4">
                <BlogForm onSuccess={() => setShowForm(false)} />
              </div>
            )}

            <div className="row g-4">
              {posts.length > 0 ? posts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <img src={post.imagenUrl} className="card-img-top" alt="blog" style={{height: "150px", objectFit: "cover"}} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold text-truncate">{post.titulo}</h5>
                      <small className="text-muted mb-2">{new Date(post.fechaPublicacion).toLocaleDateString()}</small>
                      <p className="card-text small text-secondary flex-grow-1" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {post.contenido}
                      </p>
                      <div className="mt-3 text-end">
                        <button 
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => handleDeletePost(post.id, post.titulo)}
                        >
                            🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-5 text-muted">
                    <h4>No hay noticias publicadas</h4>
                    <p>¡Escribe la primera para mantener informados a tus clientes!</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}