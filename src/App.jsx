import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/common/NavBar";
import Footer from "./Components/common/Footer"; // <--- 1. IMPORTAR FOOTER
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
import BlogPage from "./Pages/BlogPage"; 
import Checkout from "./Pages/Checkout";
import BlogPostDetail from "./Pages/BlogPostDetail";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Barra de Navegación Superior */}
      <Navbar />
      
      {/* Contenido Principal (Crece para empujar el footer) */}
      <main className="flex-fill">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />
          
          {/* Panel de Admin Protegido */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          
          {/* Páginas de Contenido Dinámico */}
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/categoria/:nombre" element={<Categoria />} />

          {/* Páginas Estáticas y de Usuario */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          {/* Error 404 */}
          <Route path="*" element={<h1 className="text-center mt-5">404 - Página no encontrada</h1>} />
        </Routes>
      </main>

      {/* Pie de Página Global */}
      <Footer /> {/* <--- 2. AGREGADO AQUÍ AL FINAL */}
    </div>
  );
}