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
    payload.mayoristasIds = currentFormData.mayoristasIds || [];
  }

  if (hasImageChanges(originalPackage, currentFormData)) {
    payload.imagenes = "PROCESS_IMAGES";
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
  const originalIds = (original?.mayoristas || []).map((m) => m.id).sort();
  const currentIds = (current.mayoristasIds || []).sort();

  return !isEqual(originalIds, currentIds);
};

const hasImageChanges = (original, current) => {
  const originalImages = original?.imagenes || [];
  const currentImages = current.imagenes || [];

  if (originalImages.length !== currentImages.length) return true;

  return !originalImages.every((origImg, index) => {
    const currImg = currentImages[index];
    return (
      currImg &&
      origImg.orden === currImg.orden &&
      origImg.contenido === currImg.url
    );
  });
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
  if (formatted.hotel === "PROCESS_HOTEL") {
    formatted.hotel = "[HOTEL_MODIFIED]";
  }
  if (formatted.destinos) {
    formatted.destinos = `[${formatted.destinos.length} destinations]`;
  }

  return formatted;
};
