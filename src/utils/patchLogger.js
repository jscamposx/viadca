const LOG_PREFIX = "🔄 [PATCH]";

export const logPatchOperation = (operation, data = {}) => {
  const timestamp = new Date().toLocaleTimeString();

  switch (operation) {
    case "start":
      console.group(`${LOG_PREFIX} Iniciando actualización PATCH`);
      console.log(`⏰ Tiempo: ${timestamp}`);
      if (data.originalId) console.log(`📦 Paquete ID: ${data.originalId}`);
      if (data.originalTitle) console.log(`📝 Título: ${data.originalTitle}`);
      break;

    case "no-changes":
      console.log(`${LOG_PREFIX} ⚠️ No se detectaron cambios`);
      console.groupEnd();
      break;

    case "changes-detected":
      console.log(
        `${LOG_PREFIX} ✅ Cambios detectados: ${data.count} campo(s)`,
      );
      console.table(data.changes);
      break;

    case "processing":
      console.log(`${LOG_PREFIX} ⚙️ Procesando campos especiales:`, data);
      break;

    case "sending":
      console.log(
        `${LOG_PREFIX} 📤 Enviando actualización con ${data.fieldCount} campo(s)`,
      );
      break;

    case "success":
      console.log(`${LOG_PREFIX} ✅ Actualización exitosa`);
      console.log(`⚡ Tiempo de respuesta: ${data.responseTime}ms`);
      console.log(`📊 Campos actualizados: ${data.fieldCount}`);
      console.groupEnd();
      break;

    case "error":
      console.error(`${LOG_PREFIX} ❌ Error en actualización:`, data.error);
      console.groupEnd();
      break;

    case "create-mode":
      console.log(`${LOG_PREFIX} 🆕 Modo creación - enviando todos los campos`);
      break;

    case "create-success":
      console.log(`${LOG_PREFIX} ✅ Paquete creado exitosamente`);
      break;

    default:
      console.log(`${LOG_PREFIX} ${operation}:`, data);
  }
};

export const createPatchSummary = (payload) => {
  const summary = {
    totalChanges: Object.keys(payload).length,
    categories: {
      basic: [],
      complex: [],
      special: [],
    },
    hasImages: false,
    hasDestinations: false,
    hasHotel: false,
    hasMayoristas: false,
  };

  Object.keys(payload).forEach((field) => {
    const value = payload[field];

    if (field === "imagenes") {
      summary.categories.special.push("Imágenes");
      summary.hasImages = true;
    } else if (field === "destinos") {
      summary.categories.special.push("Destinos");
      summary.hasDestinations = true;
    } else if (field === "hotel") {
      summary.categories.special.push("Hotel");
      summary.hasHotel = true;
    } else if (field === "mayoristasIds") {
      summary.categories.special.push("Mayoristas");
      summary.hasMayoristas = true;
    } else if (typeof value === "object" && value !== null) {
      summary.categories.complex.push(field);
    } else {
      summary.categories.basic.push(field);
    }
  });

  return summary;
};
