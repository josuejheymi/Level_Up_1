// Archivo: src/utils/About.logic.js

// Inicializamos el objeto global si no existe
window.AboutLogic = window.AboutLogic || {};

/**
 * Valida si un correo cumple con los dominios permitidos
 */
window.AboutLogic.validateEmail = function(email) {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return emailRegex.test(email);
};

/**
 * Valida la longitud del comentario
 */
window.AboutLogic.validateCommentLength = function(comentario) {
    if (!comentario) return true;
    return comentario.length <= 500;
};

/**
 * Verifica si el formulario es válido
 */
window.AboutLogic.isFormValid = function(nombre, email, comentario) {
    const isEmailOk = window.AboutLogic.validateEmail(email);
    const isCommentOk = window.AboutLogic.validateCommentLength(comentario);
    const hasName = nombre && nombre.trim().length > 0;
    
    return isEmailOk && isCommentOk && hasName;
};