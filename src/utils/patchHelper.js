/**
 * Utility functions para manejar operaciones PATCH
 * Solo envía los campos que han sido modificados
 */

/**
 * Compara dos objetos y retorna solo los campos que han cambiado
 * @param {Object} original - Datos originales
 * @param {Object} current - Datos actuales
 * @param {Array} excludeFields - Campos a excluir de la comparación
 * @returns {Object} Solo los campos modificados
 */
export const getDifferences = (original, current, excludeFields = []) => {
  const differences = {};
  
  // Lista de campos que siempre deben excluirse
  const defaultExcludeFields = ['id', 'created_at', 'updated_at', 'url'];
  const fieldsToExclude = [...defaultExcludeFields, ...excludeFields];
  
  // Recorrer todos los campos del objeto actual
  Object.keys(current).forEach(key => {
    if (fieldsToExclude.includes(key)) return;
    
    const originalValue = original?.[key];
    const currentValue = current[key];
    
    // Comparar valores
    if (!isEqual(originalValue, currentValue)) {
      differences[key] = currentValue;
    }
  });
  
  return differences;
};

/**
 * Compara dos valores de manera profunda
 * @param {*} a - Primer valor
 * @param {*} b - Segundo valor
 * @returns {boolean} true si son iguales
 */
const isEqual = (a, b) => {
  // Casos especiales para null/undefined
  if (a === null && b === null) return true;
  if (a === undefined && b === undefined) return true;
  if (a === null && b === undefined) return true;
  if (a === undefined && b === null) return true;
  
  // Si uno es null/undefined y el otro no
  if ((a === null || a === undefined) && (b !== null && b !== undefined)) return false;
  if ((b === null || b === undefined) && (a !== null && a !== undefined)) return false;
  
  // Comparación de tipos primitivos
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  
  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }
  
  // Si uno es array y el otro no
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  // Objetos
  const keysA = Object.keys(a || {});
  const keysB = Object.keys(b || {});
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => isEqual(a[key], b[key]));
};

/**
 * Prepara el payload para operaciones PATCH específicas de paquetes
 * @param {Object} originalPackage - Paquete original
 * @param {Object} currentFormData - Datos actuales del formulario
 * @returns {Object} Payload optimizado para PATCH
 */
export const preparePatchPayload = (originalPackage, currentFormData) => {
  // Normalizar datos originales para comparación
  const normalizedOriginal = normalizePackageData(originalPackage);
  const normalizedCurrent = normalizePackageData(currentFormData);
  
  // Obtener diferencias básicas
  const basicDifferences = getDifferences(normalizedOriginal, normalizedCurrent, [
    'destinos', 'imagenes', 'hotel', 'mayoristasIds', 'additionalDestinations',
    'destino', 'destino_lat', 'destino_lng' // Excluir campos individuales de destino
  ]);
  
  const payload = { ...basicDifferences };
  
  // Manejar campos especiales que requieren procesamiento
  
  // 1. Destinos
  if (hasDestinationChanges(originalPackage, currentFormData)) {
    payload.destinos = buildDestinosPayload(currentFormData);
  }
  
  // 2. Mayoristas
  if (hasMayoristasChanges(originalPackage, currentFormData)) {
    payload.mayoristasIds = currentFormData.mayoristasIds || [];
  }
  
  // 3. Imágenes (solo si han cambiado)
  if (hasImageChanges(originalPackage, currentFormData)) {
    payload.imagenes = 'PROCESS_IMAGES'; // Flag para procesar en el hook
  }
  
  // 4. Hotel (solo si ha cambiado)
  if (hasHotelChanges(originalPackage, currentFormData)) {
    payload.hotel = 'PROCESS_HOTEL'; // Flag para procesar en el hook
  }
  
  return payload;
};

/**
 * Normaliza los datos del paquete para comparación
 */
const normalizePackageData = (data) => {
  if (!data) return {};
  
  return {
    titulo: data.titulo || '',
    fecha_inicio: data.fecha_inicio || '',
    fecha_fin: data.fecha_fin || '',
    incluye: data.incluye || null,
    no_incluye: data.no_incluye || null,
    requisitos: data.requisitos || null,
    precio_total: parseFloat(data.precio_total) || 0,
    descuento: data.descuento ? parseFloat(data.descuento) : null,
    anticipo: data.anticipo ? parseFloat(data.anticipo) : null,
    notas: data.notas || null,
    activo: Boolean(data.activo),
    itinerario_texto: data.itinerario_texto || '',
    // Coordenadas de origen
    origen: data.origen || '',
    origen_lat: parseFloat(data.origen_lat) || null,
    origen_lng: parseFloat(data.origen_lng) || null,
    // Destino principal
    destino: data.destino || '',
    destino_lat: parseFloat(data.destino_lat) || null,
    destino_lng: parseFloat(data.destino_lng) || null,
  };
};

/**
 * Verifica si han cambiado los destinos
 */
const hasDestinationChanges = (original, current) => {
  // Destino principal - normalizar ambos lados de la comparación
  const originalDestino = {
    destino: original?.destinos?.[0]?.destino || original?.destino || '',
    destino_lat: parseFloat(original?.destinos?.[0]?.destino_lat || original?.destino_lat) || null,
    destino_lng: parseFloat(original?.destinos?.[0]?.destino_lng || original?.destino_lng) || null
  };
  
  const currentDestino = {
    destino: current.destino || '',
    destino_lat: parseFloat(current.destino_lat) || null,
    destino_lng: parseFloat(current.destino_lng) || null
  };
  
  if (!isEqual(originalDestino, currentDestino)) return true;
  
  // Destinos adicionales
  const originalAdditional = (original?.destinos || []).slice(1);
  const currentAdditional = current.additionalDestinations || [];
  
  if (originalAdditional.length !== currentAdditional.length) return true;
  
  return !originalAdditional.every((orig, index) => {
    const curr = currentAdditional[index];
    return curr && 
           orig.destino === curr.name &&
           orig.destino_lat === curr.lat &&
           orig.destino_lng === curr.lng;
  });
};

/**
 * Construye el payload de destinos
 */
const buildDestinosPayload = (formData) => {
  const destinos = [{
    destino: formData.destino,
    destino_lng: parseFloat(formData.destino_lng),
    destino_lat: parseFloat(formData.destino_lat),
    orden: 1,
  }];
  
  if (formData.additionalDestinations) {
    formData.additionalDestinations.forEach((dest, index) => {
      destinos.push({
        destino: dest.name,
        destino_lng: parseFloat(dest.lng),
        destino_lat: parseFloat(dest.lat),
        orden: index + 2,
      });
    });
  }
  
  return destinos;
};

/**
 * Verifica si han cambiado los mayoristas
 */
const hasMayoristasChanges = (original, current) => {
  const originalIds = (original?.mayoristas || []).map(m => m.id).sort();
  const currentIds = (current.mayoristasIds || []).sort();
  
  return !isEqual(originalIds, currentIds);
};

/**
 * Verifica si han cambiado las imágenes
 */
const hasImageChanges = (original, current) => {
  const originalImages = original?.imagenes || [];
  const currentImages = current.imagenes || [];
  
  if (originalImages.length !== currentImages.length) return true;
  
  return !originalImages.every((origImg, index) => {
    const currImg = currentImages[index];
    return currImg && 
           origImg.orden === currImg.orden &&
           origImg.contenido === currImg.url;
  });
};

/**
 * Verifica si ha cambiado el hotel
 */
const hasHotelChanges = (original, current) => {
  const originalHotel = original?.hotel;
  const currentHotel = current.hotel;
  
  // Si ambos son null/undefined, no hay cambios
  if (!originalHotel && !currentHotel) return false;
  
  // Si uno es null y el otro no, hay cambios
  if (!originalHotel !== !currentHotel) return true;
  
  // Comparar propiedades básicas del hotel
  const originalBasic = {
    place_id: originalHotel?.place_id || originalHotel?.id,
    nombre: originalHotel?.nombre,
    estrellas: originalHotel?.estrellas,
  };
  
  const currentBasic = {
    place_id: currentHotel?.place_id || currentHotel?.id,
    nombre: currentHotel?.nombre,
    estrellas: currentHotel?.estrellas,
  };
  
  return !isEqual(originalBasic, currentBasic);
};

/**
 * Valida que el payload tenga al menos un campo modificado
 */
export const hasChanges = (payload) => {
  return Object.keys(payload).length > 0;
};

/**
 * Formatea el payload para logging/debugging
 */
export const formatPayloadForLogging = (payload) => {
  const formatted = { ...payload };
  
  // Mostrar solo información resumida para campos complejos
  if (formatted.imagenes === 'PROCESS_IMAGES') {
    formatted.imagenes = '[IMAGES_MODIFIED]';
  }
  if (formatted.hotel === 'PROCESS_HOTEL') {
    formatted.hotel = '[HOTEL_MODIFIED]';
  }
  if (formatted.destinos) {
    formatted.destinos = `[${formatted.destinos.length} destinations]`;
  }
  
  return formatted;
};
