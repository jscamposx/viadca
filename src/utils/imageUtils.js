/**
 * Utilidades para el manejo de URLs de imágenes
 */

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Procesa una URL de imagen para mostrarla correctamente
 * Maneja URLs externas, data URIs, contenido base64 y rutas relativas
 * 
 * @param {string} url - La URL o contenido de la imagen
 * @param {Object} options - Opciones de optimización
 * @param {number} options.width - Ancho deseado (para Pexels)
 * @param {number} options.height - Alto deseado (para Pexels)
 * @param {string} options.quality - Calidad (para Pexels, default: 75)
 * @returns {string} URL procesada de la imagen
 */
export const getImageUrl = (url, options = {}) => {
  const { width = 600, height = 400, quality = 75 } = options;
  
  if (!url) return "https://via.placeholder.com/600x400?text=Sin+Imagen";
  
  // Si ya es una URL completa (http/https) o data URI
  if (url.startsWith("http") || url.startsWith("data:")) {
    // Optimizar imágenes de Pexels con parámetros recomendados
    if (url.includes('images.pexels.com')) {
      // Remover parámetros existentes si los hay
      const baseUrl = url.split('?')[0];
      // Aplicar optimización: auto=compress, formato WebP, calidad específica, ajuste crop
      return `${baseUrl}?auto=compress&w=${width}&h=${height}&fit=crop&fm=webp&q=${quality}`;
    }
    return url;
  }
  
  // Verificar si parece ser contenido base64
  // Base64 típicamente tiene longitud divisible por 4 y solo contiene caracteres válidos
  if (url.length > 50 && url.length % 4 === 0 && /^[A-Za-z0-9+/]*={0,2}$/.test(url)) {
    // Es contenido base64 sin prefijo, agregamos el prefijo data URI
    console.log('🖼️ Detectada imagen base64, agregando prefijo data URI');
    return `data:image/jpeg;base64,${url}`;
  }
  
  // Verificar si es una ruta que empieza con /uploads o similar
  if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
    return `${API_URL}/${url.replace(/^\/+/, '')}`;
  }
  
  // Si no es ninguno de los casos anteriores, asumir que es una ruta relativa
  return `${API_URL}/${url}`;
};

/**
 * Procesa una lista de imágenes para mostrarlas correctamente
 * 
 * @param {Array} images - Array de objetos de imagen con propiedades url/contenido
 * @param {Object} options - Opciones de optimización
 * @returns {Array} Array de URLs procesadas
 */
export const processImageUrls = (images = [], options = {}) => {
  return images.map(img => {
    const url = img.url || img.contenido;
    return getImageUrl(url, options);
  });
};

/**
 * Verifica si una cadena es contenido base64 válido
 * 
 * @param {string} str - Cadena a verificar
 * @returns {boolean} True si es base64 válido
 */
export const isBase64Content = (str) => {
  if (!str || typeof str !== 'string') return false;
  
  // Verificar longitud y caracteres válidos de base64
  return str.length > 50 && 
         str.length % 4 === 0 && 
         /^[A-Za-z0-9+/]*={0,2}$/.test(str);
};

/**
 * Convierte un archivo a base64
 * 
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} Promise que resuelve con la cadena base64
 */
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

/**
 * Normaliza una URL de imagen para comparación
 * Convierte diferentes formatos a un formato estándar para poder compararlos
 * 
 * @param {string} url - URL o contenido de imagen
 * @param {boolean} isServerContent - Si viene del servidor (usa 'contenido') o del formulario (usa 'url')
 * @returns {string} URL normalizada
 */
export const normalizeImageUrl = (url, isServerContent = false) => {
  if (!url) return '';
  
  // Si ya tiene prefijo data: o http, retornarlo tal como está
  if (url.startsWith('data:') || url.startsWith('http')) {
    return url;
  }
  
  // Si parece ser base64 sin prefijo, agregarlo
  if (isBase64Content(url)) {
    return `data:image/jpeg;base64,${url}`;
  }
  
  // Para rutas relativas, construir URL completa
  if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
    return `${API_URL}/${url.replace(/^\/+/, '')}`;
  }
  
  return url;
};

/**
 * Detecta si una imagen es nueva (necesita ser subida) basada en sus propiedades
 * Una imagen es NUEVA si:
 * - No tiene ID o tiene ID temporal
 * - Tiene un archivo File adjunto
 * - Se acaba de subir desde el formulario (no cargada desde servidor)
 * 
 * @param {Object} image - Objeto imagen a analizar
 * @returns {boolean} True si es una imagen nueva
 */
export const isNewImage = (image) => {
  if (!image) return false;
  
  // Si no tiene ID o tiene ID temporal, es nueva
  if (!image.id || image.id.includes('temp-') || image.id.includes('new-')) {
    return true;
  }
  
  // Si tiene un archivo File adjunto, es nueva (recién seleccionada)
  if (image.file) {
    return true;
  }
  
  // Si tiene ID válido de UUID y originalContent, es existente (cargada desde servidor)
  if (image.id && image.originalContent) {
    return false;
  }
  
  // Si tiene ID válido y no tiene file, probablemente es existente
  const hasValidId = image.id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(image.id);
  if (hasValidId && !image.file) {
    return false;
  }
  
  // Por defecto, si no está claro, considerar nueva para ser seguro
  return true;
};

/**
 * Detecta si una imagen es existente (ya está en el servidor)
 * Una imagen es EXISTENTE si:
 * - Tiene ID válido de UUID (no temporal)
 * - No tiene archivo File adjunto
 * - Opcionalmente tiene originalContent (cargada desde servidor)
 * 
 * @param {Object} image - Objeto imagen a analizar
 * @returns {boolean} True si es una imagen existente
 */
export const isExistingImage = (image) => {
  if (!image) return false;
  
  // Debe tener un ID válido de UUID
  const hasValidId = image.id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(image.id);
  
  return (
    hasValidId &&
    !image.id.includes('temp-') &&
    !image.id.includes('new-') &&
    !image.file  // No debe tener archivo adjunto
  );
};

/**
 * Crea un payload optimizado para cambios solo de orden
 * Cada imagen existente tendrá su nuevo orden basado en su posición actual
 * 
 * @param {Array} images - Array de imágenes con nuevo orden
 * @returns {Array} Array optimizado para backend
 */
export const createOrderOnlyPayload = (images) => {
  return images
    .filter(isExistingImage)
    .map((img, index) => ({
      id: img.id,
      orden: index + 1  // El orden es simplemente la posición actual
    }));
};
