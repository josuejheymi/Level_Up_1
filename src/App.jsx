import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/common/NavBar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import AdminPanel from "./Pages/AdminPanel";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import AdminRoute from "./Components/common/AdminRoute";
import Categoria from "./Pages/Categoria";
import ProductDetail from "./Pages/ProductDetail";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* El Navbar ahora usará useProducts() internamente para el buscador */}
      <Navbar />
      
      <main className="flex-fill">
        <Routes>
          {/* Home ahora usará useProducts() internamente para listar */}
          <Route path="/" element={<Home />} />
          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                {/* AdminPanel usará useProducts() para agregar items */}
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Categoria usará useProducts() para filtrar por la URL */}
          <Route path="/categoria/:nombre" element={<Categoria />} />
          
          <Route path="*" element={<h1 className="text-center mt-5">404 - Página no encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}