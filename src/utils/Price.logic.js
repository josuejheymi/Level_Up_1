// Archivo: src/utils/Price.logic.js

window.PriceLogic = window.PriceLogic || {};

/**
 * Calcula el subtotal de una línea de producto.
 * @param {number} precio - El precio unitario
 * @param {number} cantidad - La cantidad de items
 * @returns {number} - El total (siempre positivo o cero)
 */
window.PriceLogic.calculateSubtotal = function(precio, cantidad) {
    // Validación básica: Si no hay datos, devuelve 0
    if (!precio || !cantidad) return 0;
    
    // Regla de negocio: No permitimos cantidades negativas
    if (cantidad < 0) return 0;

    return precio * cantidad;
};

/**
 * Calcula el IVA (19%) de un monto
 */
window.PriceLogic.calculateTax = function(monto) {
    if (monto <= 0) return 0;
    return monto * 0.19;
};