import React, { useState, useEffect } from 'react';
import api from '../../config/api';

/**
 * Componente de Administración de Categorías
 * Permite Listar (Read), Crear (Create) y Eliminar (Delete) categorías.
 * Uso de Hooks: useState (Manejo de datos) y useEffect (Ciclo de vida).
 */
export default function CategoryAdmin() {
    // -------------------------------------------------------------------------
    // 1. DEFINICIÓN DE ESTADOS (HOOKS)
    // -------------------------------------------------------------------------
    
    // Almacena la lista de categorías traídas del Backend (Array)
    const [categories, setCategories] = useState([]);
    
    // Almacena los datos del formulario temporalmente (Objeto)
    // Inicializamos con strings vacíos para que los inputs sean "controlados".
    const [newCat, setNewCat] = useState({ nombre: '', imagenUrl: '' });
    
    // Controla el estado de carga (para deshabilitar botones y mostrar feedback)
    const [loading, setLoading] = useState(false);
    
    // Almacena mensajes de error si una petición falla
    const [error, setError] = useState(null);

    // -------------------------------------------------------------------------
    // 2. CICLO DE VIDA (USE EFFECT)
    // -------------------------------------------------------------------------

    // useEffect con array vacío [] significa: "Ejecútame solo una vez al montar el componente".
    // Es equivalente a window.onload o componentDidMount.
    useEffect(() => {
        fetchCategories();
    }, []);

    // -------------------------------------------------------------------------
    // 3. FUNCIONES LÓGICAS (HANDLERS)
    // -------------------------------------------------------------------------

    /**
     * Función asíncrona para obtener datos del servidor.
     * Patrón: Try / Catch para manejo de errores de red.
     */
    const fetchCategories = async () => {
        try {
            // Hacemos la petición GET a Spring Boot
            const res = await api.get('/categorias');
            // Si funciona, guardamos los datos en el estado
            setCategories(res.data);
            setError(null); // Limpiamos errores previos si los hubo
        } catch (err) {
            console.error(err);
            setError('Error de conexión al cargar categorías.');
        }
    };

    /**
     * Maneja el envío del formulario para crear una categoría.
     * @param {Event} e - Evento del formulario para prevenir recarga (preventDefault).
     */
    const handleCreate = async (e) => {
        e.preventDefault(); // 1. Evitamos que la página se recargue
        setLoading(true);   // 2. Activamos modo carga (bloquea botón)
        setError(null);

        try {
            // Enviamos los datos al Backend (POST)
            const res = await api.post('/categorias', newCat);
            
            // 3. ACTUALIZACIÓN OPTIMISTA / INMUTABLE DEL ESTADO
            // Creamos un NUEVO array copiando los anteriores (...categories)
            // y agregando el nuevo (res.data) al final.
            setCategories([...categories, res.data]);
            
            // 4. Limpiamos el formulario
            setNewCat({ nombre: '', imagenUrl: '' });
            alert(` :V Categoría creada con éxito.`);

        } catch (err) {
            // Si falla, mostramos el mensaje del backend o uno genérico
            setError(err.response?.data || 'No se pudo crear la categoría.');
        } finally {
            setLoading(false); // 5. Desactivamos modo carga pase lo que pase
        }
    };
    
    /**
     * Maneja la eliminación de un registro.
     * @param {number} id - ID de la categoría a borrar.
     */
    const handleDelete = async (id, nombre) => {
        // Confirmación nativa del navegador (simple y efectiva)
        if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción es irreversible.`)) return;

        try {
            await api.delete(`/categorias/${id}`);
            
            // FILTRADO DEL ESTADO (STATE):
            // Para que la UI se actualice sin recargar la página, filtramos el array.
            // "Quédate con todas las categorías cuyo ID sea DIFERENTE al que acabo de borrar".
            setCategories(categories.filter(c => c.id !== id));
            
        } catch (err) {
            setError('No se puede eliminar. Verifique que no tenga productos asociados.');
        }
    };

    // -------------------------------------------------------------------------
    // 4. RENDERIZADO (JSX)
    // -------------------------------------------------------------------------
    return (
        <div className="fade-in">
            {/* Cabecera de la sección */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                <h3 className="fw-bold text-white m-0">Gestión de Categorías</h3>
                <span className="badge bg-primary text-black">{categories.length} Total</span>
            </div>
            
            {/* Renderizado Condicional: Si hay error, muestra alerta */}
            {error && <div className="alert alert-danger shadow-sm">{error}</div>}

            <div className="row g-4">
                
                {/* --- COLUMNA 1: FORMULARIO DE CREACIÓN --- */}
                <div className="col-lg-4">
                    <div className="card bg-dark border-secondary p-4 shadow h-100">
                        <h5 className="text-primary fw-bold mb-3">Nueva Categoría</h5>
                        <form onSubmit={handleCreate}>
                            
                            <div className="mb-3">
                                <label className="form-label text-secondary small">NOMBRE</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-black text-white border-secondary" 
                                    placeholder="Ej: Teclados" 
                                    required 
                                    value={newCat.nombre} 
                                    // Evento onChange: Actualiza el estado letra por letra
                                    onChange={e => setNewCat({...newCat, nombre: e.target.value})} 
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label text-secondary small">URL IMAGEN (Opcional)</label>
                                <input 
                                    type="url" 
                                    className="form-control bg-black text-white border-secondary" 
                                    placeholder="https://..." 
                                    value={newCat.imagenUrl} 
                                    onChange={e => setNewCat({...newCat, imagenUrl: e.target.value})} 
                                />
                            </div>

                            {/* Botón con estado Loading */}
                            <button type="submit" className="btn btn-success w-100 fw-bold mt-2" disabled={loading}>
                                {loading ? 'Guardando...' : '＋ Crear Categoría'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- COLUMNA 2: LISTADO DE DATOS --- */}
                <div className="col-lg-8">
                    <div className="card bg-dark border-secondary shadow overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover table-dark align-middle mb-0">
                                <thead className="bg-black">
                                    <tr>
                                        <th className="ps-4 text-secondary small">ID</th>
                                        <th className="text-secondary small">INFORMACIÓN</th>
                                        <th className="text-end pe-4 text-secondary small">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Mapeo: Transformamos el array de datos en elementos visuales (filas) */}
                                    {categories.map(c => (
                                        <tr key={c.id}>
                                            <td className="ps-4 text-muted">#{c.id}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    {/* Renderizado condicional de imagen */}
                                                    {c.imagenUrl ? (
                                                        <img src={c.imagenUrl} alt="cat" className="rounded bg-black border border-secondary" style={{width: 40, height: 40, objectFit: 'cover'}} />
                                                    ) : (
                                                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center text-white" style={{width: 40, height: 40}}>#</div>
                                                    )}
                                                    <span className="fw-bold text-white">{c.nombre}</span>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button 
                                                    className='btn btn-sm btn-outline-danger border-0 rounded-pill px-3' 
                                                    onClick={() => handleDelete(c.id, c.nombre)}
                                                    title="Eliminar categoría"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {/* Feedback visual si no hay datos */}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-5 text-muted">
                                                No hay categorías creadas aún.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}