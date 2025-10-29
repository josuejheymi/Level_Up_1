// SearchBar.logic.spec.js
// Pruebas del componente SearchBar usando Jest + Testing Library
import React from 'react';  
import { render, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

// Suite de pruebas para el componente SearchBar
describe('SearchBar Component', () => {

    // Test 1: Verifica que se llame a onSearch al escribir en el input
    it('llama a onSearch al escribir en el input', () => {
        // Creamos un mock (función simulada) para rastrear las llamadas
        const mockSearch = jest.fn();
        
        // Renderizamos el componente pasando el mock como prop
        const { getByPlaceholderText } = render(<SearchBar onSearch={mockSearch} />);

        // Buscamos el input por su texto placeholder
        const input = getByPlaceholderText('Buscar productos...');
        
        // Simulamos que el usuario escribe "Teclado" en el input
        fireEvent.change(input, { target: { value: 'Teclado' } });

        // Verificamos que onSearch se haya llamado con el valor en minúsculas y sin espacios
        expect(mockSearch).toHaveBeenCalledWith('teclado');
        
        // Explicación: Esta prueba valida que cada vez que el usuario escribe,
        // se llama correctamente a la función onSearch con el texto procesado.
    });

    // Test 2: Verifica que el componente se renderice correctamente
    it('renderiza correctamente el input de búsqueda', () => {
        // Renderizamos el componente con una función vacía como prop
        const { getByPlaceholderText } = render(<SearchBar onSearch={() => {}} />);
        
        // Verificamos que el input exista en el DOM
        expect(getByPlaceholderText('Buscar productos...')).toBeTruthy();
        
        // Explicación: Esta prueba asegura que el input de búsqueda exista en el DOM.
        // Es una prueba básica de renderizado.
    });

    // Test 3: Verifica que el componente sea robusto ante props faltantes
    it('no lanza error si no se pasa onSearch', () => {
        // Renderizamos el componente SIN pasar la prop onSearch
        const { getByPlaceholderText } = render(<SearchBar />);
        const input = getByPlaceholderText('Buscar productos...');
        
        // Simulamos escritura - esto no debería causar errores
        fireEvent.change(input, { target: { value: 'Mouse' } });

        // Verificamos que el input tenga el valor escrito
        expect(input.value).toBe('Mouse');
        
        // Explicación: Esta prueba valida que el componente no se rompa
        // si onSearch no se proporciona como prop. Esto prueba la protección
        // con "if (onSearch)" dentro del componente.
    });

});