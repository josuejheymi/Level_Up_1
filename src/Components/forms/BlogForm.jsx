import React, { useState } from "react";
import { useBlog } from "../blog/BlogContext";
import { useUser } from "../user/UserContext";

export default function BlogForm({ onSuccess }) {
  const { addPost } = useBlog();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    imagenUrl: "",
    autor: user?.nombre || "Admin"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addPost(formData);
    
    if (result.success) {
      alert("✅ Noticia publicada");
      setFormData({ titulo: "", contenido: "", imagenUrl: "", autor: user?.nombre });
      if (onSuccess) onSuccess();
    } else {
      alert("❌ Error al publicar");
    }
  };

  return (
    <div className="card p-4 border-0">
      <h4 className="mb-3 fw-bold text-primary">Redactar Noticia</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Título</label>
          <input type="text" className="form-control" required 
            value={formData.titulo} 
            onChange={(e) => setFormData({...formData, titulo: e.target.value})} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Contenido</label>
          <textarea className="form-control" rows="5" required 
            value={formData.contenido} 
            onChange={(e) => setFormData({...formData, contenido: e.target.value})} 
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">URL Imagen</label>
          <input type="text" className="form-control" required 
            value={formData.imagenUrl} 
            onChange={(e) => setFormData({...formData, imagenUrl: e.target.value})} 
            placeholder="https://..."
          />
        </div>
        <button className="btn btn-primary w-100 fw-bold">Publicar Noticia</button>
      </form>
    </div>
  );
}