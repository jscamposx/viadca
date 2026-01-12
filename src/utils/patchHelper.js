import { normalizeImageUrl, isNewImage } from "./imageUtils.js";
import { sanitizeMoneda } from "./priceUtils";
import { formatDateForBackend } from "./dateHelpers";

export const getDifferences = (original, current, excludeFields = []) => {
  const differences = {};

  const defaultExcludeFields = ["id", "created_at", "updated_at", "url"];
  const fieldsToExclude = [...defaultExcludeFields, ...excludeFields];

  Object.keys(current).forEach((key) => {
    if (fieldsToExclude.includes(key)) return;

    const originalValue = original?.[key];
    const currentValue = current[key];

    if (!isEqual(originalValue, currentValue)) {
      differences[key] = currentValue;
    }
  });

  return differences;
};

const isEqual = (a, b) => {
  if (a === null && b === null) return true;
  if (a === undefined && b === undefined) return true;
  if (a === null && b === undefined) return true;
  if (a === undefined && b === null) return true;

  if ((a === null || a === undefined) && b !== null && b !== undefined)
    return false;
  if ((b === null || b === undefined) && a !== null && a !== undefined)
    return false;

  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return a === b;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a || {});
  const keysB = Object.keys(b || {});

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => isEqual(a[key], b[key]));
};

export const preparePatchPayload = (originalPackage, currentFormData) => {
  const normalizedOriginal = normalizePackageData(originalPackage);
  const normalizedCurrent = normalizePackageData(currentFormData);

  const basicDifferences = getDifferences(
    normalizedOriginal,
    normalizedCurrent,
    [
      "destinos",
      "imagenes",
      "hotel",
      "mayoristasIds",
      "usuariosAutorizadosIds", // Manejado explícitamente más abajo
      "additionalDestinations",
      "destino",
      "destino_lat",
      "destino_lng",
      "fecha_inicio", // Manejado explícitamente más abajo
      "fecha_fin", // Manejado explícitamente más abajo
    ],
  );

  const payload = { ...basicDifferences };

  // Sincronizar tipoAcceso con esPublico si hay cambios
  if (payload.hasOwnProperty('tipoAcceso') || payload.hasOwnProperty('esPublico')) {
    // Si cambió tipoAcceso, asegurar que esPublico esté sincronizado
    if (payload.tipoAcceso) {
      payload.esPublico = payload.tipoAcceso === 'publico';
    }
    // Si cambió esPublico pero no tipoAcceso, actualizar tipoAcceso
    else if (payload.hasOwnProperty('esPublico') && !payload.tipoAcceso) {
      const originalTipoAcceso = originalPackage?.tipoAcceso || (originalPackage?.esPublico ? 'publico' : 'privado');
      const currentTipoAcceso = currentFormData.tipoAcceso || (currentFormData.esPublico ? 'publico' : 'privado');
      if (originalTipoAcceso !== currentTipoAcceso) {
        payload.tipoAcceso = currentTipoAcceso;
      }
    }
  }

  // Manejar usuariosAutorizadosIds: solo enviar si realmente cambió o si el tipo cambió
  if (payload.tipoAcceso === 'privado' || currentFormData.tipoAcceso === 'privado') {
    const originalUsuariosIds = (originalPackage?.usuariosAutorizados || []).map(u => u.id).sort();
    const currentUsuariosIds = (currentFormData.usuariosAutorizadosIds || []).sort();
    
    // Comparar arrays
    const idsChanged = JSON.stringify(originalUsuariosIds) !== JSON.stringify(currentUsuariosIds);
    
    if (idsChanged) {
      payload.usuariosAutorizadosIds = currentFormData.usuariosAutorizadosIds || [];
    }
  } else if (payload.tipoAcceso && payload.tipoAcceso !== 'privado') {
    // Si cambió a público o link-privado, limpiar usuarios autorizados
    if ((originalPackage?.usuariosAutorizados || []).length > 0) {
      payload.usuariosAutorizadosIds = [];
    }
  }

  if (hasDestinationChanges(originalPackage, currentFormData)) {
    payload.destinos = buildDestinosPayload(currentFormData);
  }

  if (hasMayoristasChanges(originalPackage, currentFormData)) {
    console.log("✅ Cambios en mayoristas detectados - incluyendo en payload");
    payload.mayoristasIds = currentFormData.mayoristasIds || [];
  }

  // Manejo de fechas: si cambia cualquier fecha, enviar AMBAS (requerimiento del backend)
  const fechaInicioChanged = normalizedOriginal.fecha_inicio !== normalizedCurrent.fecha_inicio;
  const fechaFinChanged = normalizedOriginal.fecha_fin !== normalizedCurrent.fecha_fin;
  
  if (fechaInicioChanged || fechaFinChanged) {
    // Enviar ambas fechas tal cual están en el formulario
    payload.fecha_inicio = normalizedCurrent.fecha_inicio;
    payload.fecha_fin = normalizedCurrent.fecha_fin;
    
    console.log("📅 Actualizando fechas:", {
      fecha_inicio: normalizedCurrent.fecha_inicio,
      fecha_fin: normalizedCurrent.fecha_fin
    });
  }

  const imageAnalysis = analyzeImageChanges(originalPackage, currentFormData);
  if (imageAnalysis.hasChanges) {
    console.log("🖼️ Cambios detectados en imágenes:", imageAnalysis);

    if (imageAnalysis.type === "ORDER_ONLY") {
      payload.imagenes = "PROCESS_IMAGES_ORDER_ONLY";
    } else {
      payload.imagenes = "PROCESS_IMAGES";
    }
  } else {
    console.log("✅ No hay cambios en imágenes");
  }

  if (hasHotelChanges(originalPackage, currentFormData)) {
    payload.hotel = "PROCESS_HOTEL";
  }

  // Manejo explícito de limpieza de campos opcionales precio_vuelo / precio_hospedaje
  // Solo enviar null si realmente cambió de tener valor a estar vacío
  const originalPrecioVuelo = originalPackage?.precio_vuelo;
  const currentPrecioVuelo = currentFormData.precio_vuelo;
  
  if (
    originalPrecioVuelo !== null &&
    originalPrecioVuelo !== undefined &&
    originalPrecioVuelo !== "" &&
    (currentPrecioVuelo === "" || currentPrecioVuelo === null || currentPrecioVuelo === undefined)
  ) {
    // Cambió de tener valor a estar vacío -> enviar null explícitamente
    payload.precio_vuelo = null;
  }

  const originalPrecioHospedaje = originalPackage?.precio_hospedaje;
  const currentPrecioHospedaje = currentFormData.precio_hospedaje;
  
  if (
    originalPrecioHospedaje !== null &&
    originalPrecioHospedaje !== undefined &&
    originalPrecioHospedaje !== "" &&
    (currentPrecioHospedaje === "" || currentPrecioHospedaje === null || currentPrecioHospedaje === undefined)
  ) {
    // Cambió de tener valor a estar vacío -> enviar null explícitamente
    payload.precio_hospedaje = null;
  }

  const originalPersonas = originalPackage?.personas;
  const currentPersonas = currentFormData.personas;
  
  if (
    originalPersonas !== null &&
    originalPersonas !== undefined &&
    originalPersonas !== "" &&
    (currentPersonas === "" || currentPersonas === null || currentPersonas === undefined)
  ) {
    // Cambió de tener valor a estar vacío -> enviar null explícitamente
    payload.personas = null;
  }

  return payload;
};

const normalizePackageData = (data) => {
  if (!data) return {};

  const parseOptionalFloat = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  let itinerarioTexto = data.itinerario_texto || "";
  if (!itinerarioTexto && data.itinerarios && Array.isArray(data.itinerarios)) {
    const itinerarioOrdenado = data.itinerarios.sort(
      (a, b) => a.dia_numero - b.dia_numero,
    );

    itinerarioTexto = itinerarioOrdenado
      .map((item) => `DÍA ${item.dia_numero}: ${item.descripcion}`)
      .join("\n\n");
  }

  return {
    titulo: data.titulo || "",
    fecha_inicio: formatDateForBackend(data.fecha_inicio),
    fecha_fin: formatDateForBackend(data.fecha_fin),
    incluye: data.incluye || null,
    no_incluye: data.no_incluye || null,
    requisitos: data.requisitos || null,
    precio_total: parseFloat(data.precio_total) || 0,
    personas:
      data.personas === null || data.personas === undefined || data.personas === ""
        ? null
        : (() => {
            const parsed = parseInt(data.personas, 10);
            return Number.isNaN(parsed) || parsed <= 0 ? null : parsed;
          })(),
    // Nuevos campos opcionales desglosados (mantener null si no existen)
    precio_vuelo: parseOptionalFloat(data.precio_vuelo),
    precio_hospedaje: parseOptionalFloat(data.precio_hospedaje),
    descuento: data.descuento ? parseFloat(data.descuento) : null,
    anticipo: data.anticipo ? parseFloat(data.anticipo) : null,
    notas: data.notas || null,
    activo: Boolean(data.activo),
    esPublico: data.esPublico !== undefined ? Boolean(data.esPublico) : true,
    tipoAcceso: data.tipoAcceso || (data.esPublico ? 'publico' : 'privado'),
    usuariosAutorizadosIds: data.usuariosAutorizados 
      ? data.usuariosAutorizados.map(u => u.id)
      : (Array.isArray(data.usuariosAutorizadosIds) ? data.usuariosAutorizadosIds : []),
    itinerario_texto: itinerarioTexto,
    // Nuevo: normalizar moneda
    moneda: sanitizeMoneda(data.moneda),

    origen: data.origen || "",
    origen_lat: parseFloat(data.origen_lat) || null,
    origen_lng: parseFloat(data.origen_lng) || null,

    destino: data.destino || "",
    destino_lat: parseFloat(data.destino_lat) || null,
    destino_lng: parseFloat(data.destino_lng) || null,
  };
};

const hasDestinationChanges = (original, current) => {
  // Normalizar destino principal original (nuevo o legacy)
  const origFirst = original?.destinos?.[0] || {};
  const originalDestino = {
    ciudad: origFirst.ciudad || origFirst.destino || original?.destino || "",
    estado: origFirst.estado || null,
    pais: origFirst.pais || null,
    destino_lat:
      parseFloat(origFirst.destino_lat || original?.destino_lat) || null,
    destino_lng:
      parseFloat(origFirst.destino_lng || original?.destino_lng) || null,
  };
  // Normalizar destino principal actual (tomar campos desglosados si existen)
  const currentDestino = {
    ciudad: current.destino_ciudad || current.destino || "",
    estado: current.destino_estado || null,
    pais: current.destino_pais || null,
    destino_lat: parseFloat(current.destino_lat) || null,
    destino_lng: parseFloat(current.destino_lng) || null,
  };
  if (!isEqual(originalDestino, currentDestino)) return true;
  // Destinos adicionales
  const originalAdditional = (original?.destinos || []).slice(1).map((d) => ({
    ciudad: d.ciudad || d.destino || "",
    estado: d.estado || null,
    pais: d.pais || null,
    lat: d.destino_lat || null,
    lng: d.destino_lng || null,
  }));
  const currentAdditionalRaw =
    current.additionalDestinationsDetailed &&
    current.additionalDestinationsDetailed.length
      ? current.additionalDestinationsDetailed.map((d) => ({
          ciudad: d.ciudad || d.name || "",
          estado: d.estado || null,
          pais: d.pais || null,
          lat: d.lat || null,
          lng: d.lng || null,
        }))
      : (current.additionalDestinations || []).map((d) => ({
          ciudad: d.ciudad || d.name || "",
          estado: d.estado || null,
          pais: d.pais || null,
          lat: d.lat || null,
          lng: d.lng || null,
        }));
  if (originalAdditional.length !== currentAdditionalRaw.length) return true;
  return !originalAdditional.every((orig, idx) => {
    const curr = currentAdditionalRaw[idx];
    return (
      curr &&
      orig.ciudad === curr.ciudad &&
      orig.estado === curr.estado &&
      orig.pais === curr.pais &&
      parseFloat(orig.lat) === parseFloat(curr.lat) &&
      parseFloat(orig.lng) === parseFloat(curr.lng)
    );
  });
};

const buildDestinosPayload = (formData) => {
  const parseDisplay = (display) => {
    if (!display) return { ciudad: "", estado: null, pais: null };
    const parts = display.split(",").map((p) => p.trim());
    if (parts.length === 1)
      return {
        ciudad: parts[0],
        estado: null,
        pais: formData.destino_pais || null,
      };
    if (parts.length === 2)
      return { ciudad: parts[0], estado: null, pais: parts[1] };
    return {
      ciudad: parts[0],
      estado: parts[1],
      pais: parts[parts.length - 1],
    };
  };
  const first = {
    ciudad: formData.destino_ciudad || parseDisplay(formData.destino).ciudad,
    estado: formData.destino_estado || parseDisplay(formData.destino).estado,
    pais: formData.destino_pais || parseDisplay(formData.destino).pais,
    destino_lat: parseFloat(formData.destino_lat) || null,
    destino_lng: parseFloat(formData.destino_lng) || null,
    orden: 1,
  };
  const additional = (
    formData.additionalDestinationsDetailed &&
    formData.additionalDestinationsDetailed.length
      ? formData.additionalDestinationsDetailed
      : formData.additionalDestinations || []
  ).map((d, idx) => ({
    ciudad: d.ciudad || d.name || "",
    estado: d.estado || null,
    pais: d.pais || formData.destino_pais || parseDisplay(formData.destino).pais || null,
    destino_lat: parseFloat(d.lat) || null,
    destino_lng: parseFloat(d.lng) || null,
    orden: idx + 2,
  }));
  return [first, ...additional];
};

const hasMayoristasChanges = (original, current) => {
  if (!original && current.mayoristasIds && current.mayoristasIds.length > 0) {
    console.log("🆕 Nuevo paquete con mayoristas - considerado como cambio");
    return true;
  }

  const originalIds = (original?.mayoristas || []).map((m) => m.id).sort();
  const currentIds = (current.mayoristasIds || []).sort();

  const hasChanges = !isEqual(originalIds, currentIds);

  console.log("🏢 Comparando mayoristas:", {
    isNewPackage: !original,
    originalMayoristas: original?.mayoristas || [],
    originalIds,
    currentMayoristasIds: current.mayoristasIds || [],
    currentIds,
    hasChanges,
    reason: !original
      ? "Nuevo paquete"
      : hasChanges
        ? originalIds.length !== currentIds.length
          ? "Diferente cantidad"
          : "IDs diferentes"
        : "Sin cambios",
  });

  if (hasChanges) {
    console.log(
      "📋 Cambios en mayoristas detectados - se incluirán en el payload",
    );
  }

  return hasChanges;
};

const analyzeImageChanges = (original, current) => {
  const originalImages = original?.imagenes || [];
  const currentImages = current.imagenes || [];

  console.log("🔍 Analizando cambios en imágenes:", {
    originalCount: originalImages.length,
    currentCount: currentImages.length,
    originalImages: originalImages.map((img, idx) => ({
      index: idx,
      id: img.id,
      orden: img.orden,
      url: img.url?.substring(0, 50) + "...",
    })),
    currentImages: currentImages.map((img, idx) => ({
      index: idx,
      id: img.id,
      orden: img.orden,
      isNew: isNewImage(img),
      url: img.url?.substring(0, 50) + "...",
    })),
  });

  if (originalImages.length !== currentImages.length) {
    console.log("📈 Hay nuevas imágenes o se eliminaron");
    return {
      hasChanges: true,
      type: "FULL_UPDATE",
      reason: "Cantidad de imágenes diferente",
    };
  }

  if (originalImages.length === 0 && currentImages.length === 0) {
    console.log("✅ No hay imágenes en original ni current");
    return {
      hasChanges: false,
      type: "NO_CHANGES",
      reason: "Sin imágenes",
    };
  }

  const allHaveOriginalContent = currentImages.every(
    (img) => img.originalContent,
  );
  if (
    allHaveOriginalContent &&
    originalImages.length === currentImages.length
  ) {
    const exactMatch = originalImages.every((origImg, index) => {
      const currImg = currentImages[index];
      return (
        origImg.id === currImg.id &&
        origImg.contenido === currImg.originalContent &&
        (origImg.orden || index + 1) === (currImg.orden || index + 1)
      );
    });

    if (exactMatch) {
      console.log("✅ Todas las imágenes coinciden exactamente - sin cambios");
      return {
        hasChanges: false,
        type: "NO_CHANGES",
        reason: "Coincidencia exacta con originalContent",
      };
    }
  }

  const originalIds = originalImages.map((img) => img.id);
  const currentIds = currentImages.map((img) => img.id);

  console.log("🔍 Comparando orden de imágenes:", {
    originalIds: originalIds,
    currentIds: currentIds,
    orderChanged: !isEqual(originalIds, currentIds),
  });

  const hasOrderChanges = !isEqual(originalIds, currentIds);

  let hasNewImages = false;

  const imageComparisons = currentImages.map((currImg, currentIndex) => {
    const isNewImageFlag = isNewImage(currImg);

    if (isNewImageFlag) {
      hasNewImages = true;
      console.log(`🆕 Imagen ${currentIndex} detectada como nueva:`, {
        id: currImg.id,
        tipo: currImg.tipo,
        isUploaded: currImg.isUploaded,
        hasFile: !!currImg.file,
        url: currImg.url?.substring(0, 30) + "...",
      });
      return { isNew: true, orderChanged: false };
    }

    return {
      isNew: false,
      orderChanged: hasOrderChanges,
    };
  });

  if (hasNewImages) {
    console.log("🆕 Hay imágenes nuevas - se requiere actualización completa");
    console.log("📋 Ejemplo de payload completo:", {
      imagenes: [
        { id: "uuid-existente-1", orden: 1 },
        {
          orden: 2,
          tipo: "cloudinary",
          contenido: "https://res.cloudinary.com/<cloud>/image/upload/...",
          mime_type: "image/jpeg",
          nombre: "nueva-imagen.jpg",
        },
      ],
    });
    return {
      hasChanges: true,
      type: "FULL_UPDATE",
      reason: "Hay imágenes nuevas",
      details: { hasNewImages, hasOrderChanges },
    };
  }

  if (hasOrderChanges) {
    console.log("🔄 Solo cambios de orden - se puede enviar solo IDs y orden");
    console.log(
      "📋 Orden actual será:",
      currentImages.map((img, idx) => ({
        id: img.id,
        orden: idx + 1,
      })),
    );
    return {
      hasChanges: true,
      type: "ORDER_ONLY",
      reason: "Solo cambios de orden",
      details: { hasNewImages: false, hasOrderChanges: true },
    };
  }

  const hasContentChanges = imageComparisons.some(
    (comp) => comp.contentChanged,
  );
  if (hasContentChanges) {
    console.log("� Cambios en contenido de imágenes existentes");
    return {
      hasChanges: true,
      type: "FULL_UPDATE",
      reason: "Cambios en contenido de imágenes existentes",
    };
  }

  console.log("✅ No hay cambios en imágenes");
  return {
    hasChanges: false,
    type: "NO_CHANGES",
    reason: "Sin cambios detectados",
  };
};

const hasImageChanges = (original, current) => {
  const analysis = analyzeImageChanges(original, current);
  return analysis.hasChanges;
};

const hasHotelChanges = (original, current) => {
  const originalHotel = original?.hotel;
  const currentHotel = current.hotel;

  if (!originalHotel && !currentHotel) return false;
  // Uno existe y el otro no
  if (!!originalHotel !== !!currentHotel) return true;

  // Comparación de campos básicos
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
  if (!isEqual(originalBasic, currentBasic)) return true;

  // Extender a imágenes: si difiere el conteo o hay nuevas sin cloudinary_public_id -> considerar cambio
  const origImgs = originalHotel?.imagenes || [];
  const currImgs = currentHotel?.imagenes || [];
  if (origImgs.length !== currImgs.length) return true;
  // Detectar cualquier imagen nueva que no existía antes (por contenido o por presence de file)
  const originalKeys = new Set(
    origImgs.map((img) =>
      img.cloudinary_public_id || img.contenido || img.url || `idx-${img.orden}`,
    ),
  );
  for (const img of currImgs) {
    const key = img.cloudinary_public_id || img.contenido || img.url || `idx-${img.orden}`;
    const hasFilePending = !!img.file && !img.cloudinary_public_id;
    if (hasFilePending) return true; // archivo nuevo a subir
    if (!originalKeys.has(key)) return true; // contenido distinto
  }
  return false; // No cambios relevantes
};

export const hasChanges = (payload) => {
  return Object.keys(payload).length > 0;
};

export const formatPayloadForLogging = (payload) => {
  const formatted = { ...payload };

  if (formatted.imagenes === "PROCESS_IMAGES") {
    formatted.imagenes = "[IMAGES_MODIFIED]";
  }
  if (formatted.imagenes === "PROCESS_IMAGES_ORDER_ONLY") {
    formatted.imagenes = "[IMAGES_ORDER_ONLY]";
  }
  if (formatted.hotel === "PROCESS_HOTEL") {
    formatted.hotel = "[HOTEL_MODIFIED]";
  }
  if (formatted.destinos) {
    formatted.destinos = `[${formatted.destinos.length} destinations]`;
  }

  return formatted;
};

export { analyzeImageChanges };
