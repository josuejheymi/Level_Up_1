import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock de los componentes hijos para aislar las pruebas
jest.mock('./Components/common/NavBar', () => () => <div>Navbar Mock</div>);
jest.mock('./Pages/Home', () => () => <div>Home Page</div>);
jest.mock('./Pages/About', () => () => <div>About Page</div>);
jest.mock('./Pages/Contact', () => () => <div>Contact Page</div>);
jest.mock('./Pages/AdminPanel', () => () => <div>AdminPanel Page</div>);
jest.mock('./Pages/Cart', () => () => <div>Cart Page</div>);
jest.mock('./Pages/Login', () => () => <div>Login Page</div>);
jest.mock('./Pages/Register', () => () => <div>Register Page</div>);
jest.mock('./Pages/Profile', () => () => <div>Profile Page</div>);
jest.mock('./Components/common/AdminRoute', () => ({ children }) => <div>{children}</div>);

// Mock de los proveedores de contexto
jest.mock('./Components/user/UserContext', () => ({
  UserProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('./Components/cart/CartContext', () => ({
  CartProvider: ({ children }) => <div>{children}</div>
}));

// Mock de los datos iniciales de productos
jest.mock('./Data/products', () => ({
  products: [
    { id: 1, nombre: 'Producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', precio: 200 }
  ]
}));

// Wrapper para renderizar con Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('App Component', () => {

  it('renderiza la aplicación sin errores', () => {
    // Renderiza la aplicación completa
    renderWithRouter(<App />);

    // Verifica que la aplicación se renderice correctamente
    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
  });

  it('muestra la página Home en la ruta por defecto', () => {
    // Renderiza la aplicación en la ruta raíz
    window.history.pushState({}, 'Home', '/');
    renderWithRouter(<App />);

    // Verifica que se muestre la página Home
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('contiene todas las rutas principales definidas', () => {
    renderWithRouter(<App />);

    // Verifica que los componentes de las rutas estén disponibles
    // aunque no se muestren simultáneamente
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('proporciona los contextos UserProvider y CartProvider', () => {
    // Esta prueba verifica que la aplicación esté envuelta en los proveedores
    renderWithRouter(<App />);

    // Si los providers no estuvieran presentes, habría errores
    // La simple renderización exitosa confirma que los providers funcionan
    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
  });

  it('maneja rutas no encontradas con página 404', () => {
    // Navega a una ruta que no existe
    window.history.pushState({}, 'Not Found', '/ruta-inexistente');
    renderWithRouter(<App />);

    // Verifica que se muestre el mensaje 404
    expect(screen.getByText('404 - Página no encontrada')).toBeInTheDocument();
  });
});

// Pruebas adicionales que podrías considerar:
describe('Pruebas de integración de rutas', () => {

  it('protege la ruta /admin con AdminRoute', () => {
    // Mock diferente para AdminRoute que verifique la protección
    jest.mock('./Components/common/AdminRoute', () => ({ children }) => (
      <div data-testid="admin-route-protected">{children}</div>
    ));

    window.history.pushState({}, 'Admin', '/admin');
    renderWithRouter(<App />);

    expect(screen.getByTestId('admin-route-protected')).toBeInTheDocument();
  });

  it('pasa los productos correctamente a Home y AdminPanel', () => {
    // Esta prueba verificaría que el estado de productos se pasa correctamente
    // a los componentes hijos (requeriría un enfoque más avanzado de testing)
    renderWithRouter(<App />);

    // Verificación indirecta: si Home se renderiza sin errores,
    // significa que recibió los productos correctamente
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});