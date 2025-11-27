import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/styles.css";

// Importamos los 3 Proveedores de Datos
import { UserProvider } from './Components/user/UserContext';
import { CartProvider } from './Components/cart/CartContext';
import { ProductProvider } from './Components/products/ProductContext'; // <--- El nuevo que creamos

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 1. Usuario (Padre Supremo) */}
    <UserProvider>
      {/* 2. Productos (Disponible para la App y el Carrito) */}
      <ProductProvider>
        {/* 3. Carrito (Hijo, consume datos de los de arriba) */}
        <CartProvider>
          
          <BrowserRouter>
            <App />
          </BrowserRouter>

        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();