import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/common/NavBar"; 
import Footer from "./Components/common/Footer"; 

// Páginas
import Home from "./Pages/Home";
import About from "./Pages/About";
import AdminPanel from "./Pages/AdminPanel";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Categoria from "./Pages/Categoria";
import ProductDetail from "./Pages/ProductDetail";
import BlogPage from "./Pages/BlogPage"; 
import Checkout from "./Pages/Checkout";
import BlogPostDetail from "./Pages/BlogPostDetail";
import OrderDetail from "./Pages/OrderDetail";
import Offers from "./Pages/Offers";

// Componentes de Seguridad
import AdminRoute from "./Components/common/AdminRoute";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-black">
      
      {/* 1. BARRA DE NAVEGACIÓN */}
      <Navbar />
      
      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-fill">
        <Routes>
          
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          
          {/*  "About" ahora incluye la info de la empresa Y el formulario de contacto */}
          <Route path="/about" element={<About />} />
          
          <Route path="/ofertas" element={<Offers />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          
          {/* --- RUTAS DE USUARIO --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* --- RUTAS DE TIENDA --- */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ordenes/:id" element={<OrderDetail />} />
          
          {/* --- RUTAS DINÁMICAS --- */}
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/categoria/:nombre" element={<Categoria />} />

          {/* --- RUTAS ADMIN --- */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          
          {/* --- ERROR 404 --- */}
          <Route path="*" element={
            <div className="container text-center mt-5 text-white py-5">
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h3 className="mb-3">Página no encontrada</h3>
                <p className="text-secondary">Parece que te has salido del mapa.</p>
            </div>
          } />

        </Routes>
      </main>

      {/* 3. PIE DE PÁGINA */}
      <Footer /> 
    </div>
  );
}