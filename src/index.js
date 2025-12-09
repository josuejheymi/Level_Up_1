import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';

// Estilos Globales
import "bootstrap/dist/css/bootstrap.min.css"; // Framework CSS base
import "./Styles/styles.css"; // Tus estilos personalizados (Gamer Theme)

// --- IMPORTACIÓN DE PROVEEDORES (CONTEXTOS) ---
import { UserProvider } from './Components/user/UserContext';
import { CartProvider } from './Components/cart/CartContext';
import { ProductProvider } from './Components/products/ProductContext';
import { BlogProvider } from './Components/blog/BlogContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* JERARQUÍA DE PROVEEDORES (Context Hell / Pyramid)
      El orden es crucial: Los de arriba proveen datos a los de abajo.
    */}

    {/* 1. UserProvider: La autenticación es lo más importante. 
        Todo la app necesita saber si hay un usuario logueado. */}
    <UserProvider>
      
      {/* 2. ProductProvider: La base de datos de productos.
          Necesaria para que el carrito sepa detalles (precios, nombres) de lo que guardas. */}
      <ProductProvider>
        
        {/* 3. CartProvider: Maneja la lógica de compra.
            Consume datos del User (¿quién compra?) y Products (¿qué compra?). */}
        <CartProvider>
          
          {/* 4. BlogProvider: Noticias independientes. */}
          <BlogProvider>
            
            {/* 5. BrowserRouter: Habilita la navegación SPA (Single Page Application).
                Permite usar <Link>, <Routes>, <Navigate> dentro de App. */}
            <BrowserRouter>
              
              {/* === TU APLICACIÓN PRINCIPAL === */}
              <App />
              
            </BrowserRouter>
          </BlogProvider>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();