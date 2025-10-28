import { useState } from "react";
import { useUser } from "../Components/user/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { loginUser } = useUser();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = loginUser(email, password);
        if (user) {
            if (user.role === "admin") {
                navigate("/admin"); // Admin va al panel de administración
            } else {
                navigate("/"); // Usuario normal va al home
            }
        } else {
            setError("Email o contraseña incorrectos");
        }
    };


    return (
        <div className="container mt-4">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-danger">{error}</p>}
                <button className="btn btn-primary w-100 mb-2">Ingresar</button>
            </form>
        </div>
    );
};
