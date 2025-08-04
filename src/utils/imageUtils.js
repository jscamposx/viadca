/**
 * Utilidades para el manejo de URLs de imágenes con soporte para Cloudinary
 */

import { cloudinaryService } from "../services/cloudinaryService.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Procesa una URL de imagen para mostrarla correctamente
 * Ahora con soporte completo para Cloudinary
 *
 * @param {string|Object} urlOrImage - La URL, contenido de imagen o objeto imagen completo
 * @param {Object} options - Opciones de optimización
 * @param {number} options.width - Ancho deseado
 * @param {number} options.height - Alto deseado
 * @param {string} options.quality - Calidad de imagen
 * @param {string} options.format - Formato de imagen
 * @returns {string} URL procesada de la imagen
 */
export const getImageUrl = (urlOrImage, options = {}) => {
  const {
    width = 600,
    height = 400,
    quality = "auto",
    format = "auto",
  } = options;

  if (!urlOrImage) return "https://via.placeholder.com/600x400?text=Sin+Imagen";

  // Si es un objeto imagen completo (del backend)
  if (typeof urlOrImage === "object" && urlOrImage !== null) {
    return cloudinaryService.processImageUrl(urlOrImage, options);
  }

  const url = urlOrImage;

  // Si ya es una URL completa de Cloudinary, optimizarla
  if (typeof url === "string" && url.includes("cloudinary.com")) {
    const publicId = cloudinaryService.extractPublicId(url);
    if (publicId) {
      return cloudinaryService.getOptimizedImageUrl(publicId, options);
    }
    return url; // Fallback si no se puede extraer el public_id
  }

  // Si ya es una URL completa (http/https) o data URI
  if (
    typeof url === "string" &&
    (url.startsWith("http") || url.startsWith("data:"))
  ) {
    // Optimizar imágenes de Pexels con parámetros recomendados
    if (url.includes("images.pexels.com")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl}?auto=compress&w=${width}&h=${height}&fit=crop&fm=webp&q=${quality === "auto" ? 75 : quality}`;
    }
    return url;
  }

  // Verificar si parece ser contenido base64
  if (
    typeof url === "string" &&
    url.length > 50 &&
    url.length % 4 === 0 &&
    /^[A-Za-z0-9+/]*={0,2}$/.test(url)
  ) {
    console.log("🖼️ Detectada imagen base64, agregando prefijo data URI");
    return `data:image/jpeg;base64,${url}`;
  }

  // Verificar si es una ruta que empieza con /uploads o similar
  if (
    typeof url === "string" &&
    (url.startsWith("/uploads") || url.startsWith("uploads/"))
  ) {
    return `${API_URL}/${url.replace(/^\/+/, "")}`;
  }

  // Si no es ninguno de los casos anteriores, asumir que es una ruta relativa
  if (typeof url === "string") {
    return `${API_URL}/${url}`;
  }

  return "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
};

/**
 * Procesa una lista de imágenes para mostrarlas correctamente
 * Ahora con soporte completo para Cloudinary
 *
 * @param {Array} images - Array de objetos de imagen con propiedades url/contenido
 * @param {Object} options - Opciones de optimización
 * @returns {Array} Array de URLs procesadas
 */
export const processImageUrls = (images = [], options = {}) => {
  return images.map((img) => {
    // Si es un objeto imagen completo, pasarlo tal como está
    if (
      img &&
      typeof img === "object" &&
      (img.tipo || img.cloudinary_public_id || img.contenido)
    ) {
      return getImageUrl(img, options);
    }

    // Si es una URL simple o contenido
    const url = img.url || img.contenido || img;
    return getImageUrl(url, options);
  });
};

/**
 * Obtiene URLs responsivas para una imagen
 * @param {string|Object} urlOrImage - URL o objeto imagen
 * @returns {Object} Objeto con URLs para diferentes tamaños
 */
export const getResponsiveImageUrls = (urlOrImage) => {
  if (!urlOrImage) {
    const placeholder = "https://via.placeholder.com/";
    return {
      thumbnail: `${placeholder}150x150?text=Sin+Imagen`,
      small: `${placeholder}400x300?text=Sin+Imagen`,
      medium: `${placeholder}800x600?text=Sin+Imagen`,
      large: `${placeholder}1200x900?text=Sin+Imagen`,
      original: `${placeholder}1920x1080?text=Sin+Imagen`,
    };
  }

  // Si es un objeto imagen de Cloudinary
  if (typeof urlOrImage === "object" && urlOrImage.cloudinary_public_id) {
    return cloudinaryService.getResponsiveImageUrls(
      urlOrImage.cloudinary_public_id,
    );
  }

  // Si es una URL de Cloudinary
  if (typeof urlOrImage === "string" && urlOrImage.includes("cloudinary.com")) {
    const publicId = cloudinaryService.extractPublicId(urlOrImage);
    if (publicId) {
      return cloudinaryService.getResponsiveImageUrls(publicId);
    }
  }

  // Para otras imágenes, usar la URL original para todos los tamaños
  const url =
    typeof urlOrImage === "object"
      ? urlOrImage.url || urlOrImage.contenido
      : urlOrImage;
  const processedUrl = getImageUrl(url);

  return {
    thumbnail: processedUrl,
    small: processedUrl,
    medium: processedUrl,
    large: processedUrl,
    original: processedUrl,
  };
};

/**
 * Verifica si una cadena es contenido base64 válido
 *
 * @param {string} str - Cadena a verificar
 * @returns {boolean} True si es base64 válido
 */
export const isBase64Content = (str) => {
  if (!str || typeof str !== "string") return false;

  // Verificar longitud y caracteres válidos de base64
  return (
    str.length > 50 &&
    str.length % 4 === 0 &&
    /^[A-Za-z0-9+/]*={0,2}$/.test(str)
  );
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
  if (!url) return "";

  // Si ya tiene prefijo data: o http, retornarlo tal como está
  if (url.startsWith("data:") || url.startsWith("http")) {
    return url;
  }

  // Si parece ser base64 sin prefijo, agregarlo
  if (isBase64Content(url)) {
    return `data:image/jpeg;base64,${url}`;
  }

  // Para rutas relativas, construir URL completa
  if (url.startsWith("/uploads") || url.startsWith("uploads/")) {
    return `${API_URL}/${url.replace(/^\/+/, "")}`;
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
  if (!image.id || image.id.includes("temp-") || image.id.includes("new-")) {
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
  const hasValidId =
    image.id &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
      image.id,
    );
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

  console.log("🔍 Verificando si imagen es existente:", {
    id: image.id,
    hasFile: !!image.file,
    isTemp:
      image.id?.toString().includes("temp-") ||
      image.id?.toString().includes("new-") ||
      image.id?.toString().includes("img-"),
    originalContent: !!image.originalContent,
  });

  // Debe tener un ID válido de UUID o número
  const hasValidId =
    image.id &&
    (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
      image.id,
    ) ||
      /^\d+$/.test(image.id.toString())); // IDs numéricos también son válidos

  const isExisting =
    hasValidId &&
    !image.id.toString().includes("temp-") &&
    !image.id.toString().includes("new-") &&
    !image.id.toString().includes("img-") && // IDs temporales del frontend
    !image.file; // No debe tener archivo adjunto (sería una nueva imagen)

  console.log("🔍 Resultado:", { isExisting, hasValidId });
  return isExisting;
};

/**
 * Crea un payload optimizado para cambios solo de orden
 * Cada imagen existente tendrá su nuevo orden basado en su posición actual
 *
 * @param {Array} images - Array de imágenes con nuevo orden
 * @returns {Array} Array optimizado para backend
 */
export const createOrderOnlyPayload = (images) => {
  return images.filter(isExistingImage).map((img, index) => ({
    id: img.id,
    orden: index + 1, // El orden es simplemente la posición actual
  }));
};
