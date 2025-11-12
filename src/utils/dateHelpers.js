/**
 * ========================================
 * DATE HELPERS - VIADCA
 * ========================================
 * 
 * Funciones para manejar fechas entre frontend y backend
 * Backend espera: strings en formato "YYYY-MM-DD" (ISO 8601 date-only)
 * 
 * @see Guía completa en: docs/fecha-guia.md
 */

/**
 * Convierte cualquier formato de fecha a YYYY-MM-DD para el backend
 * @param {Date|string} date - Fecha en cualquier formato
 * @returns {string} Fecha en formato YYYY-MM-DD o string vacío si es inválida
 * 
 * @example
 * formatDateForBackend('2025-01-15T00:00:00.000Z') // "2025-01-15"
 * formatDateForBackend(new Date('2025-01-15')) // "2025-01-15"
 * formatDateForBackend('2025-01-15') // "2025-01-15"
 */
export const formatDateForBackend = (date) => {
  if (!date) return '';
  
  // Si ya está en formato correcto, devolverlo
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  try {
    // Convertir a Date object si es string
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Validar que sea fecha válida
    if (isNaN(dateObj.getTime())) {
      console.error('❌ Fecha inválida:', date);
      return '';
    }
    
    // Extraer solo YYYY-MM-DD del ISO string
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error('❌ Error al formatear fecha:', date, error);
    return '';
  }
};

/**
 * Convierte fecha del backend (ISO string completo) a formato para input[type="date"]
 * @param {string} dateString - Fecha ISO del backend ("2025-01-15T00:00:00.000Z")
 * @returns {string} Fecha en formato YYYY-MM-DD
 * 
 * @example
 * formatDateForInput('2025-01-15T00:00:00.000Z') // "2025-01-15"
 * formatDateForInput('2025-01-15') // "2025-01-15"
 * formatDateForInput(null) // ""
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Si es ISO string completo, extraer solo la fecha
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // Si ya está en formato YYYY-MM-DD, devolverlo
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Intentar parsear como fecha
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return '';
  } catch (error) {
    console.error('❌ Error al formatear fecha para input:', dateString, error);
    return '';
  }
};

/**
 * Valida que una fecha sea válida
 * @param {string} dateString - Fecha a validar
 * @returns {boolean} true si la fecha es válida
 * 
 * @example
 * isValidDate('2025-01-15') // true
 * isValidDate('invalid') // false
 * isValidDate('') // false
 */
export const isValidDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return false;
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Valida que una fecha esté en formato ISO YYYY-MM-DD
 * @param {string} dateString - Fecha a validar
 * @returns {boolean} true si cumple el formato YYYY-MM-DD y es fecha válida
 * 
 * @example
 * isValidISODate('2025-01-15') // true
 * isValidISODate('15/01/2025') // false
 * isValidISODate('2025-01-15T00:00:00.000Z') // false (tiene hora)
 */
export const isValidISODate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return false;
  
  // Validar formato YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  // Validar que sea fecha válida
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Valida que fecha_fin sea posterior a fecha_inicio
 * @param {string} fechaInicio - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha de fin (YYYY-MM-DD)
 * @returns {boolean} true si fecha_fin > fecha_inicio
 * 
 * @example
 * validateDateRange('2025-01-15', '2025-01-22') // true
 * validateDateRange('2025-01-22', '2025-01-15') // false
 */
export const validateDateRange = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return false;
  
  try {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return false;
    }
    
    return fin > inicio;
  } catch {
    return false;
  }
};

/**
 * Obtiene mensaje de error para fechas inválidas
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaFin - Fecha de fin
 * @returns {string|null} Mensaje de error o null si todo está bien
 * 
 * @example
 * getDateValidationError('', '2025-01-22') // "La fecha de inicio es obligatoria"
 * getDateValidationError('2025-01-15', '2025-01-10') // "La fecha de fin debe ser posterior..."
 * getDateValidationError('2025-01-15', '2025-01-22') // null
 */
export const getDateValidationError = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaInicio.trim()) {
    return 'La fecha de inicio es obligatoria';
  }
  
  if (!fechaFin || !fechaFin.trim()) {
    return 'La fecha de fin es obligatoria';
  }
  
  if (!isValidISODate(fechaInicio)) {
    return 'La fecha de inicio no tiene un formato válido (YYYY-MM-DD)';
  }
  
  if (!isValidISODate(fechaFin)) {
    return 'La fecha de fin no tiene un formato válido (YYYY-MM-DD)';
  }
  
  if (!validateDateRange(fechaInicio, fechaFin)) {
    return 'La fecha de fin debe ser posterior a la fecha de inicio';
  }
  
  return null;
};

/**
 * Formatea fecha para mostrar al usuario (DD/MM/YYYY)
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada DD/MM/YYYY
 * 
 * @example
 * formatDateForDisplay('2025-01-15') // "15/01/2025"
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

/**
 * Calcula la duración en días entre dos fechas
 * @param {string} fechaInicio - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha de fin (YYYY-MM-DD)
 * @returns {number} Número de días de diferencia
 * 
 * @example
 * getDateDuration('2025-01-15', '2025-01-22') // 7
 */
export const getDateDuration = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return 0;
  
  try {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return 0;
    }
    
    const diffTime = Math.abs(fin - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch {
    return 0;
  }
};
