// App.js - Versión actualizada con búsqueda
import { Routes, Route } from "react-router-dom";
import { useState, useMemo } from "react";
import { products as initialProducts } from "./Data/products";
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
import { UserProvider } from "../src/Components/user/UserContext"; 
import { CartProvider } from "../src/Components/cart/CartContext"; 
import Categoria from "./Pages/Categoria";

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para búsqueda

  // Función para manejar la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filtrar productos basado en la búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    
    return products.filter(product => 
      product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <UserProvider>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          {/* Pasamos handleSearch al Navbar */}
          <Navbar onSearch={handleSearch} />
          <main className="flex-fill">
            <Routes>
              {/* Pasamos los productos filtrados al Home */}
              <Route path="/" element={<Home products={filteredProducts} />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel
                      products={products}
                      onAddProduct={(newProduct) =>
                        setProducts([...products, newProduct])
                      }
                    />
                  </AdminRoute>
                }
              />
              <Route path="/About" element={<About />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              {/* Pasamos los productos filtrados a Categoria también */}
              <Route path="/categoria/:nombre" element={<Categoria products={filteredProducts}/>} />
              <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </UserProvider>
  );
}