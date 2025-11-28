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
import BlogPage from "./Pages/BlogPage"; // <--- 1. IMPORTAR AQUÍ

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* El Navbar usa useProducts() y useUser() internamente */}
      <Navbar />
      
      <main className="flex-fill">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          
          {/* Admin Protegido */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* Detalle de Producto y Reseñas */}
          <Route path="/producto/:id" element={<ProductDetail />} />

          {/* Blog de Noticias (NUEVO) */}
          <Route path="/blog" element={<BlogPage />} />  {/* <--- 2. RUTA AGREGADA */}

          {/* Páginas Estándar */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Usuarios y Carrito */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Filtro por Categoría */}
          <Route path="/categoria/:nombre" element={<Categoria />} />
          
          {/* Error 404 */}
          <Route path="*" element={<h1 className="text-center mt-5">404 - Página no encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}