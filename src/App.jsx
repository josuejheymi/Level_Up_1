import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { products as initialProducts } from "./Data/products";
import Navbar from "./Components/NavBar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import AdminPanel from "./Pages/AdminPanel";


export default function App() {
  const [products, setProducts] = useState(initialProducts); // agregamos los productos al estado
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-fill">
        <Routes>
  <Route path="/" element={<Home products={products} />} />
  <Route
    path="/admin"
    element={
      <AdminPanel
        products={products}
        onAddProduct={(newProduct) =>
          setProducts([...products, newProduct])
        }
      />
    }
  />
  <Route path="/About" element={<About />} />
  <Route path="/Contact" element={<Contact />} />
  <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
</Routes>

      </main>
    </div>
  );

}


