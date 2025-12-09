// Archivo: src/utils/Format.logic.spec.js
import './Format.logic.js'; // 🚨 Importante

describe('FormatLogic (Lógica de Formato)', function() {

    // --- TEST 1: Títulos ---
    describe('formatTitle', function() {
        it('Debe convertir texto a mayúsculas', function() {
            expect(window.FormatLogic.formatTitle('hola mundo')).toBe('HOLA MUNDO');
        });

        it('Debe manejar texto vacío o nulo', function() {
            expect(window.FormatLogic.formatTitle('')).toBe('SIN TÍTULO');
            expect(window.FormatLogic.formatTitle(null)).toBe('SIN TÍTULO');
        });

        it('Debe eliminar espacios extra', function() {
            expect(window.FormatLogic.formatTitle('  pc gamer  ')).toBe('PC GAMER');
        });
    });

    // --- TEST 2: Recorte de Texto ---
    describe('truncateText', function() {
        it('Debe recortar texto largo y agregar puntos suspensivos', function() {
            var texto = "Este es un texto muy largo";
            var resultado = window.FormatLogic.truncateText(texto, 10);
            expect(resultado).toBe("Este es un...");
        });

        it('No debe tocar el texto si es corto', function() {
            var texto = "Corto";
            var resultado = window.FormatLogic.truncateText(texto, 20);
            expect(resultado).toBe("Corto");
        });
    });
});