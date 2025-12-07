import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom"; // ⬅️ IMPORTANTE: Para leer la URL
import { useProducts } from "../Components/products/ProductContext";
import { useBlog } from "../Components/blog/BlogContext";
import { useUser } from "../Components/user/UserContext"; 
import ProductForm from "../Components/forms/ProductForm";
import BlogForm from "../Components/forms/BlogForm";
import CategoryAdmin from '../Components/admin/CategoryAdmin'; 
import api from "../config/api"; 

export default function AdminPanel() {
  const { user } = useUser();
  const { allProducts, deleteProduct } = useProducts();
  const { posts, deletePost } = useBlog();
  const location = useLocation(); // ⬅️ Hook para detectar cambios en la URL
  
  const isAdmin = user?.rol === "ADMIN";

  // Estados de navegación
  const [activeTab, setActiveTab] = useState(isAdmin ? 'dashboard' : 'products'); 
  const [showForm, setShowForm] = useState(false);
  
  // Estados de Datos
  const [stats, setStats] = useState({ totalVentas: 0, cantidadOrdenes: 0 });
  const [orders, setOrders] = useState([]);
  
  // Búsqueda y Edición
  const [searchTerm, setSearchTerm] = useState("");
  const [productToEdit, setProductToEdit] = useState(null);

  // 1. EFECTO MAGICO: CAMBIAR PESTAÑA SI LA URL LO PIDE
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    
    // Si hay un parámetro 'tab' en la URL y es válido, cambiamos el estado
    if (tabParam && ['dashboard', 'products', 'orders', 'categories', 'blog'].includes(tabParam)) {
        setActiveTab(tabParam);
    }
  }, [location]); // Se ejecuta cada vez que cambia la URL (ej: al hacer click en "Crear" en el form)

  // Cargar datos (Ordenes y Dashboard)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'dashboard' && isAdmin) {
          const res = await api.get("/ordenes/stats");
          setStats(res.data);
        } else if (activeTab === 'orders') {
          const res = await api.get("/ordenes");
          setOrders(res.data.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, [activeTab, isAdmin]);

  // --- LÓGICA DE FILTRADO DE INVENTARIO ---
  const filteredInventory = useMemo(() => {
    if (!searchTerm) return allProducts;
    const term = searchTerm.toLowerCase();
    
    return allProducts.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.id.toString().includes(term) ||
        p.categoria?.nombre?.toLowerCase().includes(term)
    );
  }, [allProducts, searchTerm]);

  // --- LÓGICA DASHBOARD ---
  const topCategories = useMemo(() => {
    if (!allProducts.length) return [];
    const counts = {};
    allProducts.forEach(p => {
        const catName = p.categoria?.nombre || "Sin Categoría";
        counts[catName] = (counts[catName] || 0) + 1;
    });
    
    return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([name, count]) => ({
            name, count, percent: Math.round((count / allProducts.length) * 100)
        }));
  }, [allProducts]);

  // Acciones y Handlers
  const handleDeleteProduct = async (id, nombre) => {
    if (!isAdmin) return alert("Solo administradores pueden eliminar.");
    if (window.confirm(`¿Eliminar producto "${nombre}"?`)) await deleteProduct(id);
  };
  
  const handleDeletePost = async (id, title) => {
    if (window.confirm(`¿Eliminar noticia "${title}"?`)) await deletePost(id);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setSearchTerm("");
  };

  const handleEditClick = (p) => {
    setProductToEdit(p);
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setProductToEdit(null);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      
      {/* SIDEBAR */}
      <aside className="bg-dark text-white p-3 d-flex flex-column" style={{ width: "260px", flexShrink: 0, borderRight: "1px solid #333" }}>
        <div className="mb-5 text-center py-3 border-bottom border-secondary">
          <h4 className="m-0 fw-bold text-white">⚡ {isAdmin ? "Admin" : "Vendedor"}</h4>
          <small className="text-secondary">LevelUp Store</small>
        </div>
        
        <nav className="nav flex-column gap-2">
          {isAdmin && (
            <button className={`btn text-start text-white py-2 ${activeTab === 'dashboard' ? 'bg-primary text-black' : 'btn-dark'}`} onClick={() => handleTabChange('dashboard')}>📊 Resumen</button>
          )}
          <button className={`btn text-start text-white py-2 ${activeTab === 'products' ? 'bg-primary text-black' : 'btn-dark'}`} onClick={() => handleTabChange('products')}>📦 Inventario</button>
          <button className={`btn text-start text-white py-2 ${activeTab === 'orders' ? 'bg-primary text-black' : 'btn-dark'}`} onClick={() => handleTabChange('orders')}>🛍️ Ventas</button>
          
          {/* BOTÓN CATEGORÍAS */}
          {isAdmin && ( 
              <button className={`btn text-start text-white py-2 ${activeTab === 'categories' ? 'bg-primary text-black' : 'btn-dark'}`} onClick={() => handleTabChange('categories')}>🏷️ Categorías</button>
          )}
          
          {isAdmin && (
            <button className={`btn text-start text-white py-2 ${activeTab === 'blog' ? 'bg-primary text-black' : 'btn-dark'}`} onClick={() => handleTabChange('blog')}>📰 Noticias</button>
          )}
        </nav>

        <div className="mt-auto pt-3 border-top border-secondary text-center small text-secondary">
          Usuario: <span className="text-white">{user?.nombre}</span>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow-1 p-4" style={{ overflowY: "auto", maxHeight: "100vh" }}>
        
        <header className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold m-0 text-white">Hola, {user?.nombre} 👋</h2>
            <p className="text-secondary">{isAdmin ? "Tienes control total." : "Vista limitada de Vendedor."}</p>
          </div>
          <div className="bg-primary text-black rounded-circle d-flex justify-content-center align-items-center fw-bold shadow" style={{width: 40, height: 40}}>{user?.nombre?.charAt(0).toUpperCase()}</div>
        </header>

        {/* VISTA 1: DASHBOARD */}
        {activeTab === 'dashboard' && isAdmin && (
          <div className="fade-in">
              <div className="row g-4 mb-4">
                  <div className="col-md-4">
                      <div className="card bg-dark border border-secondary shadow h-100 p-3">
                          <div className="card-body">
                              <h6 className="opacity-75 text-uppercase text-secondary">Ventas Totales</h6>
                              <h2 className="fw-bold my-3 text-white">${stats.totalVentas?.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</h2>
                              <span className="badge bg-success text-black">{stats.cantidadOrdenes} Órdenes</span>
                          </div>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="card bg-dark border border-secondary shadow-sm h-100 p-3">
                          <div className="card-body">
                              <h6 className="text-secondary text-uppercase">Productos</h6>
                              <h2 className="fw-bold my-3 text-white">{allProducts.length}</h2>
                          </div>
                      </div>
                  </div>
                  <div className="col-md-4">
                      <div className="card bg-dark border border-secondary shadow-sm h-100 p-3">
                          <div className="card-body">
                              <h6 className="text-secondary text-uppercase">Noticias</h6>
                              <h2 className="fw-bold my-3 text-white">{posts.length}</h2>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card bg-dark border border-secondary shadow-sm p-4 h-100">
                        <h5 className="fw-bold mb-4 text-white">Top Categorías</h5>
                        <ul className="list-group list-group-flush bg-dark">
                            {topCategories.map((cat, i) => (
                                <li key={i} className="list-group-item bg-dark text-white border-secondary px-0 d-flex justify-content-between">
                                    <span>{cat.name}</span><span className="fw-bold text-primary">{cat.percent}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
              </div>
          </div>
        )}

        {/* VISTA 2: VENTAS */}
        {activeTab === 'orders' && (
            <div className="fade-in">
             <h3 className="fw-bold mb-4 text-white">Historial de Ventas</h3>
             <div className="card border-secondary bg-dark shadow-sm overflow-hidden">
               <div className="table-responsive">
                 <table className="table table-hover table-dark align-middle mb-0">
                   <thead>
                     <tr>
                       <th className="ps-4 text-primary">ID</th>
                       <th className="text-primary">Cliente</th>
                       <th className="text-primary">Fecha</th>
                       <th className="text-primary">Detalle</th>
                       <th className="text-end pe-4 text-primary">Total</th>
                     </tr>
                   </thead>
                   <tbody>
                     {orders.map(orden => (
                       <tr key={orden.id}>
                         <td className="ps-4 fw-bold text-white">#{orden.id}</td>
                         <td>
                           <div className="fw-bold text-white">{orden.usuario?.nombre}</div>
                           <small className="text-secondary">{orden.usuario?.email}</small>
                         </td>
                         <td className="text-white">{new Date(orden.fecha).toLocaleDateString()}</td>
                         <td>
                             <small className="text-secondary">{orden.detalles.length} productos</small><br/>
                             <small className="text-primary fst-italic">📍 {orden.direccionEnvio}</small>
                         </td>
                         <td className="text-end pe-4 fw-bold text-success">
                           ${orden.total?.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
            </div>
        )}

        {/* VISTA 3: INVENTARIO */}
        {activeTab === 'products' && (
          <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <h3 className="fw-bold m-0 text-white">Inventario</h3>
              
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text bg-dark border-secondary text-secondary">🔍</span>
                <input 
                    type="text" 
                    className="form-control bg-dark border-secondary text-white" 
                    placeholder="Buscar por nombre, cat o ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isAdmin && (
                  <button 
                    className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} rounded-pill px-4 fw-bold shadow-sm`}
                    onClick={() => {
                        if(showForm) handleCloseForm();
                        else setShowForm(true);
                    }}
                  >
                    {showForm ? "✖ Cerrar" : "➕ Nuevo Producto"}
                  </button>
              )}
            </div>

            {showForm && isAdmin && (
              <div className="card bg-dark border-secondary shadow-sm mb-4">
                <ProductForm productToEdit={productToEdit} onSuccess={handleCloseForm} />
              </div>
            )}

            <div className="card border-secondary bg-dark shadow-sm overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover table-dark align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4 py-3 text-primary">PRODUCTO</th>
                      <th className="text-primary">CATEGORÍA</th>
                      <th className="text-primary">PRECIO</th>
                      <th className="text-primary">STOCK</th>
                      {isAdmin && <th className="text-end pe-4 text-primary">ACCIONES</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.length > 0 ? (
                        filteredInventory.map(p => (
                        <tr key={p.id}>
                            <td className="ps-4">
                            <div className="d-flex align-items-center">
                                <img src={p.imagenUrl} alt="" className="rounded border border-secondary me-3 bg-black" style={{width: 40, height: 40, objectFit: 'contain'}} />
                                <div>
                                    <div className="fw-bold text-white">{p.nombre}</div>
                                    <small className="text-secondary d-block" style={{fontSize: "0.75rem"}}>ID: {p.id}</small>
                                </div>
                            </div>
                            </td>
                            <td>
                                <span className="badge bg-dark text-secondary border border-secondary">
                                    {p.categoria?.nombre || 'Sin Categoría'}
                                </span>
                            </td>
                            <td className="fw-bold text-white">${p.precio?.toLocaleString('es-CL', { maximumFractionDigits: 0 })}</td>
                            <td><span className={`badge ${p.stock < 5 ? 'bg-danger text-white' : 'bg-success text-black'}`}>{p.stock} u.</span></td>
                            
                            {isAdmin && (
                                <td className="text-end pe-4">
                                <button 
                                    className="btn btn-sm btn-outline-warning border-0 rounded-circle p-2 me-2" 
                                    onClick={() => handleEditClick(p)} title="Editar"
                                >✏️</button>
                                <button 
                                    className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2" 
                                    onClick={() => handleDeleteProduct(p.id, p.nombre)} title="Eliminar"
                                >🗑️</button>
                                </td>
                            )}
                        </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="text-center py-5 text-muted">No se encontraron productos con "{searchTerm}".</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 4: CATEGORÍAS */}
        {activeTab === 'categories' && isAdmin && (
            <CategoryAdmin /> 
        )}
        
        {/* VISTA 5: BLOG */}
        {activeTab === 'blog' && isAdmin && (
          <div className="fade-in">
             <div className="d-flex justify-content-between align-items-center mb-4">
               <h3 className="fw-bold m-0 text-white">Noticias</h3>
               <button className="btn btn-primary rounded-pill" onClick={() => setShowForm(!showForm)}>
                   {showForm ? "Cerrar" : "Nueva Noticia"}
               </button>
             </div>
             {showForm && <div className="mb-4 card bg-dark border-secondary"><BlogForm onSuccess={() => setShowForm(false)} /></div>}
             <div className="row g-4">
                {posts.map(p => (
                    <div key={p.id} className="col-md-4">
                        <div className="card bg-dark border-secondary shadow-sm h-100">
                            <img src={p.imagenUrl} className="card-img-top" alt="blog" style={{height: "150px", objectFit: "cover"}} />
                            <div className="card-body">
                                <h5 className="card-title fw-bold text-white">{p.titulo}</h5>
                                <div className="mt-3 text-end">
                                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDeletePost(p.id, p.titulo)}>🗑️ Eliminar</button>
                                </div>
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