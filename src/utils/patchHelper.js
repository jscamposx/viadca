import { normalizeImageUrl, isNewImage } from "./imageUtils.js";
import { sanitizeMoneda } from "./priceUtils";

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
      "additionalDestinations",
      "destino",
      "destino_lat",
      "destino_lng",
    ],
  );

  const payload = { ...basicDifferences };

  if (hasDestinationChanges(originalPackage, currentFormData)) {
    payload.destinos = buildDestinosPayload(currentFormData);
  }

  if (hasMayoristasChanges(originalPackage, currentFormData)) {
    console.log("✅ Cambios en mayoristas detectados - incluyendo en payload");
    payload.mayoristasIds = currentFormData.mayoristasIds || [];
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

  return payload;
};

const normalizePackageData = (data) => {
  if (!data) return {};

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
    fecha_inicio: data.fecha_inicio || "",
    fecha_fin: data.fecha_fin || "",
    incluye: data.incluye || null,
    no_incluye: data.no_incluye || null,
    requisitos: data.requisitos || null,
    precio_total: parseFloat(data.precio_total) || 0,
    descuento: data.descuento ? parseFloat(data.descuento) : null,
    anticipo: data.anticipo ? parseFloat(data.anticipo) : null,
    notas: data.notas || null,
    activo: Boolean(data.activo),
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
  const originalDestino = {
    destino: original?.destinos?.[0]?.destino || original?.destino || "",
    destino_lat:
      parseFloat(
        original?.destinos?.[0]?.destino_lat || original?.destino_lat,
      ) || null,
    destino_lng:
      parseFloat(
        original?.destinos?.[0]?.destino_lng || original?.destino_lng,
      ) || null,
  };

  const currentDestino = {
    destino: current.destino || "",
    destino_lat: parseFloat(current.destino_lat) || null,
    destino_lng: parseFloat(current.destino_lng) || null,
  };

  if (!isEqual(originalDestino, currentDestino)) return true;

  const originalAdditional = (original?.destinos || []).slice(1);
  const currentAdditional = current.additionalDestinations || [];

  if (originalAdditional.length !== currentAdditional.length) return true;

  return !originalAdditional.every((orig, index) => {
    const curr = currentAdditional[index];
    return (
      curr &&
      orig.destino === curr.name &&
      orig.destino_lat === curr.lat &&
      orig.destino_lng === curr.lng
    );
  });
};

const buildDestinosPayload = (formData) => {
  const destinos = [
    {
      destino: formData.destino,
      destino_lng: parseFloat(formData.destino_lng),
      destino_lat: parseFloat(formData.destino_lat),
      orden: 1,
    },
  ];

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

  if (!originalHotel !== !currentHotel) return true;

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
