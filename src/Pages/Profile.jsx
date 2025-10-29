import { useState, useEffect } from "react";
import { useUser } from "../Components/user/UserContext";
import { useCart } from "../Components/cart/CartContext";

export default function Profile() {
    // Obtiene datos y funciones del contexto de usuario
    const { currentUser, logoutUser, users, setUsers } = useUser();
    // Obtiene los items del carrito
    const { cartItems } = useCart();

    // Estado para los datos del formulario de perfil
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        calle: "",
        departamento: "",
        region: "",
        comuna: "",
        indicaciones: "",
    });

    // Carga los datos del usuario actual al montar el componente
    useEffect(() => {
        if (currentUser) {
            setFormData({
                nombre: currentUser.name || "",
                lastname: currentUser.lastname || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                calle: currentUser.address?.calle || "",
                departamento: currentUser.address?.departamento || "",
                region: currentUser.address?.region || "",
                comuna: currentUser.address?.comuna || "",
                indicaciones: currentUser.address?.indicaciones || "",
            });
        }
    }, [currentUser]);

    // Maneja cambios en los inputs del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Guarda los cambios del perfil
    const handleSubmit = (e) => {
        e.preventDefault();
        // Actualiza el usuario actual y la lista de usuarios
        const updatedUser = { ...currentUser, ...formData };
        const updatedUsers = users.map((u) =>
            u.id === currentUser.id ? updatedUser : u
        );
        setUsers(updatedUsers);
        // Persiste los cambios en localStorage
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        alert("Datos actualizados correctamente!");
    };

    // Si no hay usuario logueado, muestra mensaje
    if (!currentUser) return <p>No has iniciado sesión.</p>;

    return (
        <div className="container mt-4">
            <h2>Perfil de {currentUser.nombre}</h2>

            {/* Formulario de edición de perfil */}
            <form onSubmit={handleSubmit}>
                {/* Campo Nombre */}
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </div>

                {/* Campo Email */}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Campo Calle */}
                <div className="mb-3">
                    <label className="form-label">Calle</label>
                    <input
                        type="text"
                        className="form-control"
                        name="calle"
                        value={formData.calle}
                        onChange={handleChange}
                    />
                </div>

                {/* Campo Departamento (opcional) */}
                <div className="mb-3">
                    <label className="form-label">Departamento (opcional)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleChange}
                    />
                </div>

                {/* Campo Región */}
                <div className="mb-3">
                    <label className="form-label">Región</label>
                    <input
                        type="text"
                        className="form-control"
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                    />
                </div>

                {/* Campo Comuna */}
                <div className="mb-3">
                    <label className="form-label">Comuna</label>
                    <input
                        type="text"
                        className="form-control"
                        name="comuna"
                        value={formData.comuna}
                        onChange={handleChange}
                    />
                </div>

                {/* Campo Indicaciones (opcional) */}
                <div className="mb-3">
                    <label className="form-label">Indicaciones (opcional)</label>
                    <input
                        type="text"
                        className="form-control"
                        name="indicaciones"
                        value={formData.indicaciones}
                        onChange={handleChange}
                    />
                </div>

                {/* Botones de acción */}
                <button type="submit" className="btn btn-primary">
                    Guardar cambios
                </button>
                <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={logoutUser}
                >
                    Cerrar sesión
                </button>
            </form>

            {/* Sección de compras realizadas */}
            <div className="mt-4">
                <h3>Compras realizadas</h3>
                {cartItems.length === 0 ? (
                    <p>No tienes productos en tu carrito actualmente.</p>
                ) : (
                    <ul className="list-group">
                        {cartItems.map((item) => (
                            <li key={item.id} className="list-group-item">
                                {item.nombre} x {item.quantity} - ${item.precio * item.quantity}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}