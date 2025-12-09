// Archivo: src/utils/Format.logic.js

// Inicializamos el objeto global
window.FormatLogic = window.FormatLogic || {};

/**
 * Formatea un título para que siempre esté en mayúsculas.
 */
window.FormatLogic.formatTitle = function(texto) {
    if (!texto) return "SIN TÍTULO";
    return texto.toUpperCase().trim();
};

/**
 * Recorta un texto si es muy largo.
 */
window.FormatLogic.truncateText = function(texto, limite) {
    if (!texto) return "";
    if (texto.length <= limite) return texto;
    
    return texto.substring(0, limite) + "...";
};