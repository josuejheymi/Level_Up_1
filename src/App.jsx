import { Routes, Route } from "react-router-dom";
import { useState } from "react";
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
import { UserProvider } from "../src/Components/user/UserContext"; // ✅ importa tu UserProvider
import { CartProvider } from "../src/Components/cart/CartContext"; // ✅ importa tu CartProvider

export default function App() {
  const [products, setProducts] = useState(initialProducts);

  return (
    <UserProvider>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-fill">
            <Routes>
              <Route path="/" element={<Home products={products} />} />
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
              <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </UserProvider>
  );
}
