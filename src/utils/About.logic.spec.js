// 🚨 LA SOLUCIÓN ESTÁ AQUÍ: Importamos el archivo hermano para que se cargue en window
import './About.logic.js'; 

describe('AboutLogic (Lógica de Formulario de Contacto)', function() {

    // --- TEST 1: Validación de Email ---
    describe('validateEmail', function() {
        it('Debe aceptar correos @duoc.cl', function() {
            // Verificación defensiva: Si falla aquí, es que no cargó el archivo
            if (!window.AboutLogic) fail("AboutLogic no se cargó correctamente");
            
            var resultado = window.AboutLogic.validateEmail('alumno@duoc.cl');
            expect(resultado).toBe(true);
        });

        it('Debe aceptar correos @gmail.com', function() {
            var resultado = window.AboutLogic.validateEmail('usuario@gmail.com');
            expect(resultado).toBe(true);
        });

        it('Debe rechazar correos @hotmail.com o inválidos', function() {
            var resultado = window.AboutLogic.validateEmail('hacker@hotmail.com');
            expect(resultado).toBe(false);
        });
        
        it('Debe rechazar strings vacíos', function() {
            var resultado = window.AboutLogic.validateEmail('');
            expect(resultado).toBe(false);
        });
    });

    // --- TEST 2: Longitud de Comentario ---
    describe('validateCommentLength', function() {
        it('Debe aceptar comentarios cortos', function() {
            expect(window.AboutLogic.validateCommentLength('Hola mundo')).toBe(true);
        });

        it('Debe rechazar comentarios de más de 500 caracteres', function() {
            var textoLargo = new Array(502).join('a'); 
            expect(window.AboutLogic.validateCommentLength(textoLargo)).toBe(false);
        });
    });

    // --- TEST 3: Validez General del Formulario ---
    describe('isFormValid', function() {
        it('Debe ser válido con todos los datos correctos', function() {
            var valido = window.AboutLogic.isFormValid('Juan', 'juan@duoc.cl', 'Consulta');
            expect(valido).toBe(true);
        });

        it('Debe ser inválido si falta el nombre', function() {
            var valido = window.AboutLogic.isFormValid('', 'juan@duoc.cl', 'Consulta');
            expect(valido).toBeFalsy(); 
        });
    });

});