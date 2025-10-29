// Este test verifica el comportamiento del componente Navbar 
// Importamos las herramientas de testing de React
import React from 'react';
import { render, screen } from '@testing-library/react';
// Importamos el componente que vamos a testear
import Navbar from './NavBar';

// --- Mocks ---
// Creamos una función mock para simular el hook useUser
const mockUseUser = jest.fn();

// Mockeamos el contexto de usuario para no usar el real en los tests
jest.mock('../user/UserContext', () => ({
    useUser: () => mockUseUser(), // Retorna lo que mockUseUser devuelva
}));

// Mockeamos el contexto del carrito para simplificar las pruebas
jest.mock('../cart/CartContext', () => ({
    useCart: () => ({ cartItems: [] }), // Carrito vacío por defecto
}));

// Bloque principal de tests para el componente Navbar
describe('Navbar Component', () => {

    // Test 1: Comportamiento cuando NO hay usuario logueado
    it('muestra Login y Register si no hay usuario logueado', () => {
        // Configuramos el mock para simular usuario NO logueado
        mockUseUser.mockReturnValue({ currentUser: null }); // usuario NO logueado

        // Renderizamos el componente en el entorno de testing
        render(<Navbar />);

        // Verificaciones (Assertions):
        // - ¿Aparece el texto "Login" en el componente?
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        // - ¿Aparece el texto "Register" en el componente?
        expect(screen.getByText(/register/i)).toBeInTheDocument();
    });

    // Test 2: Comportamiento cuando SÍ hay usuario logueado
    it('muestra el nombre del usuario si está logueado', () => {
        // Configuramos el mock para simular usuario logueado llamado "Josue"
        mockUseUser.mockReturnValue({ currentUser: { name: 'Josue' } }); // usuario logueado

        // Renderizamos el componente
        render(<Navbar />);

        // Verificación:
        // - ¿Aparece el nombre "Josue" en el componente?
        expect(screen.getByText(/josue/i)).toBeInTheDocument();
    });

});