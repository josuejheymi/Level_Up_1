// Archivo: src/utils/Price.logic.spec.js
import './Price.logic.js'; // 🚨 Importante para cargar la lógica

describe('PriceLogic (Lógica de Precios)', function() {

    // --- TEST 1: Subtotal ---
    describe('calculateSubtotal', function() {
        it('Debe calcular correctamente precio x cantidad', function() {
            var resultado = window.PriceLogic.calculateSubtotal(1000, 3);
            expect(resultado).toBe(3000);
        });

        it('Debe devolver 0 si la cantidad es negativa (Caso borde)', function() {
            var resultado = window.PriceLogic.calculateSubtotal(1000, -5);
            expect(resultado).toBe(0);
        });

        it('Debe manejar precios con decimales', function() {
            var resultado = window.PriceLogic.calculateSubtotal(10.50, 2);
            expect(resultado).toBe(21);
        });
    });

    // --- TEST 2: Impuestos ---
    describe('calculateTax', function() {
        it('Debe calcular el 19% correctamente', function() {
            var resultado = window.PriceLogic.calculateTax(100);
            expect(resultado).toBe(19);
        });
    });
});