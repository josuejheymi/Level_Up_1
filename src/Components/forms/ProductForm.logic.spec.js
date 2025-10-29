// src/utils/ProductForm.logic.spec.js
// Pruebas Jasmine para ProductFormLogic
import "../forms/ProductForm.logic.js";

// Suite de pruebas para la lógica del formulario de productos
describe('ProductFormLogic', function () {

    // Test 1: Verifica que createProduct crea objetos correctamente
    it('createProduct devuelve objeto con datos correctos', function () {
        // Ejecutamos la función con datos de ejemplo
        var product = window.ProductFormLogic.createProduct(
            "Mouse",
            "Periféricos",
            "50000",
            "url.png",
            "Mouse gamer"
        );

        // Verificamos que los datos se asignaron correctamente
        expect(product.nombre).toBe("Mouse");
        expect(product.precio).toBe(50000); // Precio convertido a número
    });

    // Test 2: Verifica la validación de campos requeridos
    it('createProduct devuelve null si falta algún dato', function () {
        // Probamos con nombre vacío (primer parámetro)
        var product = window.ProductFormLogic.createProduct(
            "", // ← Campo vacío que debería fallar
            "Periféricos",
            "50000",
            "url.png",
            "Mouse gamer"
        );

        // La función debe retornar null cuando hay campos vacíos
        expect(product).toBeNull();
    });

    // Test 3: Verifica que resetForm limpia todos los campos
    it('resetForm limpia correctamente los campos', function () {
        // Simulamos estados con valores iniciales
        var nombre = "a", categoria = "b", precio = "1", imagen = "i", descripcion = "d";

        // Creamos funciones setter simuladas que actualizan las variables
        var setNombre = function (v) { nombre = v; };
        var setCategoria = function (v) { categoria = v; };
        var setPrecio = function (v) { precio = v; };
        var setImagen = function (v) { imagen = v; };
        var setDescripcion = function (v) { descripcion = v; };

        // Ejecutamos la función de limpieza
        window.ProductFormLogic.resetForm(
            setNombre, setCategoria, setPrecio, setImagen, setDescripcion
        );

        // Verificamos que todas las variables se hayan limpiado (string vacío)
        expect(nombre).toBe("");
        expect(categoria).toBe("");
        expect(precio).toBe("");
        expect(imagen).toBe("");
        expect(descripcion).toBe("");
    });

});