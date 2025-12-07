
// En src/Components/admin/CategoryAdmin.jsx

import React, { useState, useEffect } from 'react';
import api from '../../config/api';

export default function CategoryAdmin() {
    const [categories, setCategories] = useState([]);
    const [newCat, setNewCat] = useState({ nombre: '', imagenUrl: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar Categorías
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categorias');
            setCategories(res.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar categorías.');
        }
    };

    // Crear Categoría
    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await api.post('/categorias', newCat);
            setCategories([...categories, res.data]);
            setNewCat({ nombre: '', imagenUrl: '' });
            alert(`Categoría '${res.data.nombre}' creada con éxito.`);
        } catch (err) {
            setError(err.response?.data || 'Error al crear la categoría. ¿Ya existe?');
        } finally {
            setLoading(false);
        }
    };
    
    // Eliminar Categoría
    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Seguro que deseas eliminar la categoría "${nombre}"? Esto fallará si tiene productos asociados.`)) return;

        try {
            await api.delete(`/categorias/${id}`);
            setCategories(categories.filter(c => c.id !== id));
            alert(`Categoría "${nombre}" eliminada.`);
        } catch (err) {
            setError(err.response?.data || 'Error al eliminar. Debe borrar los productos primero.');
        }
    };

    return (
        <div className="fade-in">
            <h3 className="fw-bold mb-4 text-white">Gestión de Categorías</h3>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-4">
                
                {/* Columna de Creación */}
                <div className="col-lg-5">
                    <div className="card bg-dark border-secondary p-4 shadow-sm h-100">
                        <h5 className="text-white mb-3">Crear Nueva Categoría</h5>
                        <form onSubmit={handleCreate}>
                            <div className="mb-3">
                                <label className="form-label text-white">Nombre</label>
                                <input type="text" className="form-control" placeholder="Ej: Teclados, Consolas" required value={newCat.nombre} onChange={e => setNewCat({...newCat, nombre: e.target.value})} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white">URL Imagen/Banner</label>
                                <input type="url" className="form-control" placeholder="https://picsum.photos/..." value={newCat.imagenUrl} onChange={e => setNewCat({...newCat, imagenUrl: e.target.value})} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-2" disabled={loading}>
                                {loading ? 'Creando...' : 'Guardar Categoría'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Columna de Listado */}
                <div className="col-lg-7">
                    <div className="card bg-dark border-secondary shadow-sm overflow-hidden">
                        <table className="table table-hover table-dark align-middle mb-0">
                            <thead>
                                <tr>
                                    <th className="ps-4 text-primary">ID</th>
                                    <th className="text-primary">NOMBRE</th>
                                    <th className="text-primary">IMAGEN</th>
                                    <th className="text-end pe-4 text-primary">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(c => (
                                    <tr key={c.id}>
                                        <td className="ps-4 text-secondary">{c.id}</td>
                                        <td className="fw-bold text-white">{c.nombre}</td>
                                        <td>{c.imagenUrl ? <img src={c.imagenUrl} alt={c.nombre} style={{width: '50px', height: '30px', objectFit: 'cover'}} className='rounded' /> : 'N/A'}</td>
                                        <td className="text-end pe-4">
                                            <button 
                                                className='btn btn-sm btn-outline-danger border-0 rounded-circle p-2' 
                                                onClick={() => handleDelete(c.id, c.nombre)}
                                            >🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}