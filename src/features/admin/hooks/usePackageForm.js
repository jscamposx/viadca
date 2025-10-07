import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import {
  preparePatchPayload,
  hasChanges,
  formatPayloadForLogging,
  analyzeImageChanges,
} from "../../../utils/patchHelper";
import {
  isExistingImage,
  createOrderOnlyPayload,
} from "../../../utils/imageUtils";
import {
  logPatchOperation,
  createPatchSummary,
} from "../../../utils/patchLogger";
import { sanitizeMoneda } from "../../../utils/priceUtils";
// Import Cloudinary (named + default fallback al final para robustez en dev hot reload)
import cloudinaryDefault, { cloudinaryService as cloudinaryNamed } from "../../../services/cloudinaryService.js";

const isUUID = (str) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
    str,
  );

export const usePackageForm = (initialPackageData = null) => {
  const navigate = useNavigate();
  const cloudinarySvc = cloudinaryNamed || cloudinaryDefault || null;
  if (!cloudinarySvc) {
    // eslint-disable-next-line no-console
    console.error("[usePackageForm] cloudinarySvc inexistente: subida de imágenes de hotel fallará");
  }

  const originalDataRef = useRef(null);

  const [formData, setFormData] = useState({
    titulo: "",
    fecha_inicio: "",
    fecha_fin: "",
    incluye: null,
    no_incluye: null,
    requisitos: null,
    descuento: "",
    anticipo: null,
    precio_total: "",
    // Nuevos campos desglosados opcionales
    precio_vuelo: "",
    precio_hospedaje: "",
    precio_original: "",
    notas: null,
    itinerario_texto: "",
    activo: true,
    origen: "Durango, México",
    origen_lat: 24.0277,
    origen_lng: -104.6532,
    destino: "", // display legacy
    destino_lat: null,
    destino_lng: null,
    // Nuevo desglose destino principal (auto)
    destino_ciudad: "",
    destino_estado: "",
    destino_pais: "",
    additionalDestinations: [], // legacy ({name,lat,lng})
    // Nuevo arreglo detallado opcional (cuando tengamos ciudad/estado/pais explícitos)
    additionalDestinationsDetailed: [], // [{ciudad, estado, pais, lat, lng}]
    destinos: [],
    imagenes: [],
    hotel: null,
    mayoristas: [],
    mayoristasIds: [],
    moneda: "MXN",
    favorito: false,
  });
  // Progreso imágenes hotel (A-D)
  const [hotelImagesProgress, setHotelImagesProgress] = useState({ total: 0, processed: 0, dropped: 0, errors: 0, inProgress: false, lastMessage: null });
  // Cache de resultados de subida/descarga para hoteles (evita repetir Cloudinary/descargas)
  const hotelImageCacheRef = useRef({});
  // Estructura: {
  //   key: { tipo:'cloudinary'|'google_places_url', cloudinary_public_id, cloudinary_url, mime_type, nombre }
  // }

  useEffect(() => {
    if (initialPackageData) {
      let itinerarioTexto = "";
      if (
        initialPackageData.itinerarios &&
        Array.isArray(initialPackageData.itinerarios)
      ) {
        const itinerarioOrdenado = initialPackageData.itinerarios.sort(
          (a, b) => a.dia_numero - b.dia_numero,
        );

        itinerarioTexto = itinerarioOrdenado
          .map((item) => `DÍA ${item.dia_numero}: ${item.descripcion}`)
          .join("\n\n");
      }

      const processedOriginalData = {
        ...initialPackageData,
        itinerario_texto:
          itinerarioTexto || initialPackageData.itinerario_texto || "",
      };

      originalDataRef.current = JSON.parse(
        JSON.stringify(processedOriginalData),
      );

      const initialDestino = initialPackageData.destinos?.[0] || {};
      // Nuevo: construir display de destino si backend ya no envía campo legacy `destino`
      const computedDisplayDestino =
        initialDestino.destino ||
        [initialDestino.ciudad, initialDestino.estado, initialDestino.pais]
          .filter(Boolean)
          .join(", ") ||
        initialPackageData.destino ||
        "";

      const processedImages = (initialPackageData.imagenes || []).map(
        (img, index) => {
          // Solo soportar Cloudinary y URLs externas
          let imageUrl;
          if (img.cloudinary_url) {
            imageUrl = img.cloudinary_url;
          } else if (img.contenido?.startsWith("http")) {
            imageUrl = img.contenido;
          } else {
            // Para rutas de archivos en el servidor
            imageUrl = `${import.meta.env.VITE_API_URL}/uploads/${img.contenido}`;
          }

          return {
            id: img.id || `img-${index}`,
            url: imageUrl,
            orden: img.orden || index + 1,
            tipo: img.tipo || (img.cloudinary_url ? "cloudinary" : "url"),
            isUploaded: img.tipo === "cloudinary",
            file: null,
            // Añadir metadatos Cloudinary para que el flujo reconozca imágenes existentes correctamente
            cloudinary_public_id: img.cloudinary_public_id || null,
            cloudinary_url: img.cloudinary_url || (img.tipo === "cloudinary" ? imageUrl : null),
            // Preservar el contenido original para comparaciones
            originalContent: img.contenido,
          };
        },
      );

      const mayoristasIds = initialPackageData.mayoristas
        ? initialPackageData.mayoristas.map((m) => m.id)
        : initialPackageData.mayoristasIds || [];

      console.log("🔄 Inicializando paquete existente - Mayoristas:", {
        mayoristasOriginales: initialPackageData.mayoristas,
        mayoristasIds: mayoristasIds,
        directMayoristasIds: initialPackageData.mayoristasIds,
      });

      setFormData({
        titulo: initialPackageData.titulo || "",
        fecha_inicio: initialPackageData.fecha_inicio || "",
        fecha_fin: initialPackageData.fecha_fin || "",
        incluye: initialPackageData.incluye || "",
        no_incluye: initialPackageData.no_incluye || "",
        requisitos: initialPackageData.requisitos || "",
        descuento: initialPackageData.descuento || "",
        anticipo: initialPackageData.anticipo || "",
        precio_total: initialPackageData.precio_total || "",
        // Mapear nuevos campos (pueden venir como string o número o null)
        precio_vuelo:
          initialPackageData.precio_vuelo === null || initialPackageData.precio_vuelo === undefined
            ? ""
            : String(initialPackageData.precio_vuelo),
        precio_hospedaje:
          initialPackageData.precio_hospedaje === null || initialPackageData.precio_hospedaje === undefined
            ? ""
            : String(initialPackageData.precio_hospedaje),
        precio_original:
          initialPackageData.descuento &&
          parseFloat(initialPackageData.descuento) > 0
            ? (
                parseFloat(initialPackageData.precio_total || 0) +
                parseFloat(initialPackageData.descuento || 0)
              ).toString()
            : initialPackageData.precio_total || "",
        notas: initialPackageData.notas || "",
        itinerario_texto: itinerarioTexto,
        activo:
          initialPackageData.activo !== undefined
            ? initialPackageData.activo
            : true,
        origen: initialPackageData.origen || "Durango, México",
        origen_lat: initialPackageData.origen_lat || 24.0277,
        origen_lng: initialPackageData.origen_lng || -104.6532,
        destino: computedDisplayDestino,
        destino_lat:
          initialDestino.destino_lat || initialPackageData.destino_lat || null,
        destino_lng:
          initialDestino.destino_lng || initialPackageData.destino_lng || null,
        destino_ciudad: initialDestino.ciudad || "",
        destino_estado: initialDestino.estado || "",
        destino_pais: initialDestino.pais || "",
        additionalDestinations: (initialPackageData.destinos || [])
          .slice(1)
          .map((dest) => ({
            name: dest.destino || dest.ciudad,
            lat: dest.destino_lat,
            lng: dest.destino_lng,
          })),
        additionalDestinationsDetailed: (initialPackageData.destinos || [])
          .slice(1)
          .map((dest) => ({
            ciudad: dest.ciudad || dest.destino || "",
            estado: dest.estado || "",
            pais: dest.pais || "",
            lat: dest.destino_lat,
            lng: dest.destino_lng,
          })),
        destinos: initialPackageData.destinos || [],
        imagenes: processedImages,
        hotel: initialPackageData.hotel || null,
        mayoristas: initialPackageData.mayoristas || [],
        mayoristasIds: mayoristasIds,
        moneda: sanitizeMoneda(initialPackageData.moneda),
        favorito: !!initialPackageData.favorito,
      });
    }
  }, [initialPackageData]);

  const [selectionMode, setSelectionMode] = useState("destino");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(
      selectionMode === "destino" ? formData.destino : formData.origen,
    );
  }, [selectionMode, formData.origen, formData.destino]);

  const handlePlaceSelected = useCallback(
    (place) => {
      const { geometry, formatted_address } = place;
      if (!geometry) return;
      const { lat, lng } = geometry.location;
      // Extraer componentes para ciudad/estado/pais
      const comps = place.address_components || [];
      const getComp = (type) => {
        const c = comps.find((ac) => ac.types.includes(type));
        return c ? c.long_name : null;
      };
      const ciudad =
        getComp("locality") ||
        getComp("sublocality") ||
        getComp("administrative_area_level_2") ||
        getComp("administrative_area_level_3") ||
        "";
      const estado = getComp("administrative_area_level_1") || "";
      const pais = getComp("country") || "";
      const display = formatted_address.split(",").slice(0, 2).join(", ");
      setFormData((prev) => ({
        ...prev,
        ...(selectionMode === "destino"
          ? {
              destino: display,
              destino_ciudad: ciudad,
              destino_estado: estado,
              destino_pais: pais,
              destino_lat: lat(),
              destino_lng: lng(),
            }
          : {
              origen: display,
              origen_lat: lat(),
              origen_lng: lng(),
            }),
      }));
    },
    [selectionMode],
  );

  const onMapClick = useCallback(
    (event) => {
      const latLng = event.detail.latLng;
      if (!latLng) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        {
          location: latLng,
          language: "es",
          region: "MX",
        },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const place = results[0];
            const comps = place.address_components || [];
            const getComp = (type) => {
              const c = comps.find((ac) => ac.types.includes(type));
              return c ? c.long_name : null;
            };
            const ciudad =
              getComp("locality") ||
              getComp("sublocality") ||
              getComp("administrative_area_level_2") ||
              getComp("administrative_area_level_3") ||
              "";
            const estado = getComp("administrative_area_level_1") || "";
            const pais = getComp("country") || "";
            const display = place.formatted_address
              .split(",")
              .slice(0, 2)
              .join(", ");
            setFormData((prev) => ({
              ...prev,
              ...(selectionMode === "destino"
                ? {
                    destino: display,
                    destino_ciudad: ciudad,
                    destino_estado: estado,
                    destino_pais: pais,
                    destino_lat: latLng.lat,
                    destino_lng: latLng.lng,
                  }
                : {
                    origen: display,
                    origen_lat: latLng.lat,
                    origen_lng: latLng.lng,
                  }),
            }));
          }
        },
      );
    },
    [selectionMode],
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Manejar tanto 'mayoristas' como 'mayoristasIds' para compatibilidad
    if (name === "mayoristas") {
      const mayoristasIds = Array.isArray(value) ? value.map((m) => m.id) : [];
      console.log("🏢 Actualizando mayoristas desde MayoristasForm:", {
        mayoristasCompletos: value,
        mayoristasIds: mayoristasIds,
        previousValue: formData.mayoristasIds,
      });
      setFormData((prev) => ({
        ...prev,
        mayoristas: value,
        mayoristasIds: mayoristasIds,
      }));
      return;
    }

    if (name === "mayoristasIds") {
      console.log("🏢 Actualizando mayoristasIds directamente:", {
        name,
        value,
        previousValue: formData.mayoristasIds,
      });
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = useCallback((newImages) => {
    setFormData((prev) => ({ ...prev, imagenes: newImages }));
  }, []);

  const handleHotelSelected = useCallback((hotel) => {
    setFormData((prev) => ({ ...prev, hotel: hotel }));
  }, []);

  const handleAddDestination = useCallback(
    (destination) => {
      const isDuplicate =
        formData.destino === destination.name ||
        (formData.additionalDestinations || []).some(
          (dest) => dest.name === destination.name,
        );

      if (isDuplicate) {
        return false;
      }

      setFormData((prev) => ({
        ...prev,
        additionalDestinations: [
          ...(prev.additionalDestinations || []),
          destination,
        ],
      }));
      return true;
    },
    [formData.destino, formData.additionalDestinations],
  );

  const handleRemoveDestination = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      additionalDestinations: prev.additionalDestinations.filter(
        (_, i) => i !== index,
      ),
    }));
  }, []);

  const handleSubmit = async (
    event,
    addNotification,
    backgroundMode = false,
  ) => {
    event.preventDefault();
    // Bloqueo: no permitir submit mientras haya imágenes subiendo
    const uploadingImages = (formData.imagenes || []).filter(
      (img) => img.status === "uploading",
    );
    if (uploadingImages.length > 0) {
      const msg = `Espera a que terminen de subir ${uploadingImages.length} imagen(es).`;
      if (addNotification) addNotification(msg, "warning");
      throw new Error(msg);
    }
    // Bloqueo opcional: si hay errores, sugerir reintento o eliminación
    const erroredImages = (formData.imagenes || []).filter(
      (img) => img.status === "error",
    );
    if (erroredImages.length > 0) {
      const msg = `Hay ${erroredImages.length} imagen(es) con error. Elimínalas o reintenta antes de continuar.`;
      if (addNotification) addNotification(msg, "error");
      throw new Error(msg);
    }
    // Validación de creación: campos obligatorios top-level
    const validateISODate = (val) =>
      typeof val === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(val) &&
      !isNaN(new Date(val).getTime());

    const errors = [];
    const errorMap = {};
    if (!initialPackageData) {
      // Solo validar exhaustivamente en creación (PATCH puede ser parcial)
      if (!formData.titulo || !formData.titulo.trim()) {
        const msg = "El título no puede estar vacío";
        errors.push(msg);
        errorMap.titulo = msg;
      } else if (formData.titulo.trim().length > 200) {
        const msg = "El título no debe exceder 200 caracteres";
        errors.push(msg);
        errorMap.titulo = msg;
      }

      if (!formData.origen || !formData.origen.trim()) {
        const msg = "El origen no puede estar vacío";
        errors.push(msg);
        errorMap.origen = msg;
      } else if (formData.origen.trim().length > 100) {
        const msg = "El origen no debe exceder 100 caracteres";
        errors.push(msg);
        errorMap.origen = msg;
      }

      if (
        formData.origen_lat === null ||
        formData.origen_lat === undefined ||
        isNaN(parseFloat(formData.origen_lat))
      ) {
        const msg = "Selecciona el origen en el mapa";
        errors.push(msg);
        errorMap.origen = msg;
      }
      if (
        formData.origen_lng === null ||
        formData.origen_lng === undefined ||
        isNaN(parseFloat(formData.origen_lng))
      ) {
        const msg = "Selecciona el origen en el mapa";
        if (!errorMap.origen) errors.push(msg);
        errorMap.origen = errorMap.origen || msg;
      }

      if (!formData.fecha_inicio || !formData.fecha_inicio.trim()) {
        const msg = "La fecha de inicio es obligatoria";
        errors.push(msg);
        errorMap.fecha_inicio = msg;
      } else if (!validateISODate(formData.fecha_inicio)) {
        const msg = "La fecha de inicio no tiene un formato válido (YYYY-MM-DD)";
        errors.push(msg);
        errorMap.fecha_inicio = msg;
      }
      if (!formData.fecha_fin || !formData.fecha_fin.trim()) {
        const msg = "La fecha de fin es obligatoria";
        errors.push(msg);
        errorMap.fecha_fin = msg;
      } else if (!validateISODate(formData.fecha_fin)) {
        const msg = "La fecha de fin no tiene un formato válido (YYYY-MM-DD)";
        errors.push(msg);
        errorMap.fecha_fin = msg;
      }

      const precio = parseFloat(formData.precio_total);
      if (formData.precio_total === null || formData.precio_total === undefined || formData.precio_total === "") {
        const msg = "El precio total es obligatorio";
        errors.push(msg);
        errorMap.precio_total = msg;
      } else if (isNaN(precio)) {
        const msg = "El precio total debe ser un número";
        errors.push(msg);
        errorMap.precio_total = msg;
      } else if (!(precio > 0)) {
        const msg = "El precio total debe ser un número positivo";
        errors.push(msg);
        errorMap.precio_total = msg;
      }

      // Mantener requisito existente de seleccionar destino (UX previo)
      if (!formData.destino_lat || !formData.destino_lng) {
        const msg = "Selecciona el destino en el mapa";
        errors.push(msg);
        errorMap.destino = msg;
      }
    } else {
      // Mantenemos una validación mínima en edición si falta el destino
      if (!formData.origen_lat || !formData.destino_lat) {
        if (addNotification) {
          addNotification(
            "Por favor, selecciona tanto el origen como el destino en el mapa.",
            "error",
          );
        }
        return;
      }
    }

    if (errors.length > 0) {
      const message = errors.join(", ");
      if (addNotification) {
        addNotification(message, "error");
      }
      const err = new Error(message);
      err.validationErrors = errors;
      err.isValidationError = true;
      err.validationMap = errorMap;
      throw err;
    }

    try {
      // Crear una función de notificación que solo maneje errores
      const errorOnlyNotification = (message, type) => {
        if (type === "error" && addNotification) {
          addNotification(message, type);
        }
      };

      if (backgroundMode) {
        // En modo background, retornamos inmediatamente la promesa sin esperar
        const operation = initialPackageData
          ? handlePatchUpdate(errorOnlyNotification)
          : handleFullCreate(errorOnlyNotification);

        // Retornar la promesa para que se pueda manejar en background
        return {
          operation,
          isEdit: !!initialPackageData,
          packageTitle: formData.titulo,
        };
      } else {
        // Modo normal (síncrono)
        if (initialPackageData) {
          await handlePatchUpdate(errorOnlyNotification);
        } else {
          await handleFullCreate(errorOnlyNotification);
        }

        // Navegar de vuelta con información de éxito SOLO si no hubo errores
        const successMessage = initialPackageData
          ? "Paquete actualizado exitosamente"
          : "Paquete creado exitosamente";

        navigate("/admin/paquetes", {
          state: {
            showNotification: true,
            notificationType: "success",
            notificationMessage: successMessage,
            shouldRefresh: true,
          },
        });
      }
    } catch (error) {
      if (initialPackageData) {
        logPatchOperation("error", { error });
      }

      const errorMessage =
        error.response?.data?.message || "Ocurrió un error inesperado.";
      if (addNotification) addNotification(`Error: ${errorMessage}`, "error");

      // NO navegar en caso de error, permitir que el usuario vea el error y corrija
      throw error; // Re-lanzar el error para que NewPackagePage lo maneje
    }
  };

  const handlePatchUpdate = async (addNotification) => {
    const startTime = performance.now();

    logPatchOperation("start", {
      originalId: initialPackageData.id,
      originalTitle: initialPackageData.titulo,
    });

    const patchPayload = preparePatchPayload(originalDataRef.current, formData);

    if (!hasChanges(patchPayload)) {
      logPatchOperation("no-changes");
      if (addNotification) {
        addNotification("No se detectaron cambios para actualizar.", "info");
      }
      return { hasChanges: false };
    }

    logPatchOperation("changes-detected", {
      count: Object.keys(patchPayload).length,
      changes: patchPayload,
    });

    const finalPayload = { ...patchPayload };

    const processingFlags = {
      images: patchPayload.imagenes === "PROCESS_IMAGES",
      imagesOrderOnly: patchPayload.imagenes === "PROCESS_IMAGES_ORDER_ONLY",
      hotel: patchPayload.hotel === "PROCESS_HOTEL",
    };

    if (
      processingFlags.images ||
      processingFlags.imagesOrderOnly ||
      processingFlags.hotel
    ) {
      logPatchOperation("processing", processingFlags);
    }

    // Normalizar orden ANTES de cualquier procesamiento para asegurar consistencia
    const normalizedImages = (formData.imagenes || []).map((img, idx) => ({
      ...img,
      orden: idx + 1,
    }));
    if (normalizedImages.length) {
      console.log("🔢 Orden normalizado previo a envío:", normalizedImages.map(i => ({ id: i.id, orden: i.orden, tipo: i.tipo, cloudinary_public_id: i.cloudinary_public_id })));
    }

    if (processingFlags.images) {
      console.log("🖼️ Modo: Procesamiento completo de imágenes");
      finalPayload.imagenes = await processImages(normalizedImages);
    } else if (processingFlags.imagesOrderOnly) {
      console.log("⚡ Modo: Solo actualización de orden (optimizado)");
      finalPayload.imagenes = await processImagesOrderOnly(normalizedImages);
    }

    if (processingFlags.hotel) {
      finalPayload.hotel = await processHotel(formData.hotel);
    }

    logPatchOperation("sending", {
      fieldCount: Object.keys(finalPayload).length,
      mayoristasIncluded: "mayoristasIds" in finalPayload,
      mayoristasIds: finalPayload.mayoristasIds || "no incluidos",
    });

    console.log("📤 Enviando PATCH - Payload final:", {
      keys: Object.keys(finalPayload),
      mayoristasIds: finalPayload.mayoristasIds,
      payload: finalPayload,
    });

    await api.packages.updatePaquete(initialPackageData.id, finalPayload);

    // Actualizar el estado original después de PATCH exitoso
    // Esto asegura que las comparaciones futuras sean correctas
    const updatedOriginalData = { ...originalDataRef.current };

    // Aplicar los cambios del payload al estado original
    Object.keys(finalPayload).forEach((key) => {
      if (key === "imagenes" && typeof finalPayload[key] === "string") {
        // Para imágenes, actualizar con el estado actual del formData
        updatedOriginalData.imagenes = [...(formData.imagenes || [])];
      } else if (key === "mayoristasIds") {
        // Para mayoristas, actualizar tanto mayoristas como mayoristasIds
        updatedOriginalData.mayoristas = formData.mayoristas || [];
        updatedOriginalData.mayoristasIds = formData.mayoristasIds || [];
      } else if (key !== "hotel" || typeof finalPayload[key] !== "string") {
        // Para otros campos (excepto hotel con string), aplicar directamente
        updatedOriginalData[key] = finalPayload[key];
      }

      if (key === "hotel" && typeof finalPayload[key] === "string") {
        // Para hotel, actualizar con el estado actual del formData
        updatedOriginalData.hotel = formData.hotel;
      }
    });

    // Actualizar la referencia original
    originalDataRef.current = updatedOriginalData;

    console.log("🔄 Estado original actualizado después de PATCH exitoso:", {
      packageId: initialPackageData.id,
      fieldsUpdated: Object.keys(finalPayload),
      newImageCount: updatedOriginalData.imagenes?.length || 0,
      newMayoristasCount: updatedOriginalData.mayoristas?.length || 0,
    });

    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    logPatchOperation("success", {
      fieldCount: Object.keys(finalPayload).length,
      responseTime,
    });

    return {
      hasChanges: true,
      fieldsModified: Object.keys(finalPayload).length,
      responseTime,
      packageId: initialPackageData.id,
      packageTitle: formData.titulo,
    };
  };

  const handleFullCreate = async (addNotification) => {
    logPatchOperation("create-mode");
    const normalizedImages = (formData.imagenes || []).map((img, idx) => ({
      ...img,
      orden: idx + 1,
    }));
    if (normalizedImages.length) {
      console.log("🔢 Orden normalizado (CREACIÓN):", normalizedImages.map(i => ({ id: i.id, orden: i.orden, tipo: i.tipo, cloudinary_public_id: i.cloudinary_public_id })));
    }
    const packageImages = await processImages(normalizedImages);
    const hotelPayload = await processHotel(formData.hotel);
    console.log("🆕 Creando paquete - Mayoristas:", {
      mayoristasIds: formData.mayoristasIds,
      count: (formData.mayoristasIds || []).length,
    });
    // Helper para construir objeto destino nuevo esquema
    const buildDestino = (displayName, lat, lng, orden, detailed) => {
      if (detailed && detailed.ciudad) {
        return {
          ciudad: detailed.ciudad,
          estado: detailed.estado || null,
          pais: detailed.pais || null,
          destino_lat: parseFloat(lat),
          destino_lng: parseFloat(lng),
          orden,
        };
      }
      const parts = (displayName || "").split(",").map((p) => p.trim());
      let ciudad = parts[0] || displayName || "";
      let estado = null;
      let pais = null;
      if (parts.length === 2) {
        pais = parts[1];
      } else if (parts.length >= 3) {
        estado = parts[1];
        pais = parts[parts.length - 1];
      }
      return {
        ciudad,
        estado: estado || null,
        pais: pais || formData.destino_pais || null,
        destino_lat: parseFloat(lat),
        destino_lng: parseFloat(lng),
        orden,
      };
    };
    const destinosPayload = [
      buildDestino(
        formData.destino,
        formData.destino_lat,
        formData.destino_lng,
        1,
        {
          ciudad: formData.destino_ciudad,
          estado: formData.destino_estado,
          pais: formData.destino_pais,
        },
      ),
      ...(formData.additionalDestinationsDetailed &&
      formData.additionalDestinationsDetailed.length
        ? formData.additionalDestinationsDetailed.map((d, idx) =>
            buildDestino(d.ciudad, d.lat, d.lng, idx + 2, {
              ciudad: d.ciudad,
              estado: d.estado,
              pais: d.pais,
            }),
          )
        : (formData.additionalDestinations || []).map((d, idx) =>
            buildDestino(d.name, d.lat, d.lng, idx + 2),
          )),
    ];
    const payload = {
      titulo: formData.titulo,
      origen: formData.origen,
      origen_lat: parseFloat(formData.origen_lat),
      origen_lng: parseFloat(formData.origen_lng),
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      incluye:
        formData.incluye && formData.incluye.trim() !== ""
          ? formData.incluye
          : null,
      no_incluye:
        formData.no_incluye && formData.no_incluye.trim() !== ""
          ? formData.no_incluye
          : null,
      requisitos:
        formData.requisitos && formData.requisitos.trim() !== ""
          ? formData.requisitos
          : null,
      precio_total: parseFloat(formData.precio_total),
      // Nuevos campos opcionales (enviar sólo si usuario los proporcionó; null si vacío explícito)
      ...(formData.precio_vuelo !== undefined
        ? {
            precio_vuelo:
              formData.precio_vuelo === "" || formData.precio_vuelo === null
                ? null
                : parseFloat(formData.precio_vuelo),
          }
        : {}),
      ...(formData.precio_hospedaje !== undefined
        ? {
            precio_hospedaje:
              formData.precio_hospedaje === "" || formData.precio_hospedaje === null
                ? null
                : parseFloat(formData.precio_hospedaje),
          }
        : {}),
      moneda: sanitizeMoneda(formData.moneda),
      descuento:
        formData.descuento && formData.descuento !== ""
          ? parseFloat(formData.descuento)
          : null,
      anticipo:
        formData.anticipo && formData.anticipo !== ""
          ? parseFloat(formData.anticipo)
          : null,
      notas:
        formData.notas && formData.notas.trim() !== "" ? formData.notas : null,
      activo: formData.activo,
      mayoristasIds: formData.mayoristasIds,
      itinerario_texto: formData.itinerario_texto || "",
      destinos: destinosPayload,
      imagenes: packageImages,
      hotel: hotelPayload,
      favorito: !!formData.favorito,
    };
    console.log("📤 Enviando CREATE - Payload completo:", {
      payload,
      mayoristasIncluded: "mayoristasIds" in payload,
      mayoristasCount: (payload.mayoristasIds || []).length,
      imagenesResumen: payload.imagenes.map(i => ({ orden: i.orden, tipo: i.tipo, tienePublicId: !!i.cloudinary_public_id })),
    });
    const response = await api.packages.createPaquete(payload);
    logPatchOperation("create-success");
    return {
      packageId: response.data?.id || null,
      packageTitle: formData.titulo,
      created: true,
    };
  };

  const processImages = async (images) => {
    // Ya NO convertimos a dataURL (subida directa a Cloudinary ocurre antes)
    // Debug: mostrar información DETALLADA sobre los tipos de imágenes
    console.log("🔍 ANÁLISIS DETALLADO de imágenes a procesar:", {
      total: images.length,
      tipos: images.map((img, idx) => ({
        indice: idx,
        id: img.id,
        tipo: img.tipo || "indefinido",
        source: img.source || "sin source",
        isUploaded: img.isUploaded,
        esUsuario: !!img.file,
        tieneArchivo: !!img.file,
        tieneCloudinaryId: !!img.cloudinary_public_id,
        urlPreview: img.url?.substring(0, 50) + "...",
      })),
    });

    const processedImages = await Promise.all(
      images.map(async (img, index) => {
        console.log(`\n🔎 Procesando imagen ${index + 1}:`, {
          id: img.id,
          tipo: img.tipo,
          source: img.source,
          isUploaded: img.isUploaded,
          hasFile: !!img.file,
          hasCloudinaryId: !!img.cloudinary_public_id,
          isUserUpload: !!img.file,
        });

        // PRIORIDAD 1: Imágenes de Google Places - DIRECTO AL BACKEND
        if (img.tipo === "google_places_url") {
          console.log(`🗺️ ✅ GOOGLE PLACES - Directo al backend`);
          return {
            orden: index + 1,
            tipo: "google_places_url",
            contenido: img.url || img.contenido,
            mime_type: "image/jpeg",
            nombre: img.nombre || `google-places-${index + 1}.jpg`,
          };
        }

        // PRIORIDAD 2: Imágenes de Pexels/URLs externas - DIRECTO AL BACKEND
        if (
          img.tipo === "url" ||
          img.source === "pexels" ||
          img.id?.includes("pexels")
        ) {
          console.log(`🔗 ✅ PEXELS/URL - Directo al backend`);
          return {
            orden: index + 1,
            tipo: "url",
            contenido: img.url,
            mime_type: "image/jpeg",
            nombre: img.url?.split("/").pop() || `pexels-${index + 1}.jpg`,
          };
        }

        // PRIORIDAD 3: Imágenes ya en Cloudinary - MANTENER REFERENCIA
        if (img.tipo === "cloudinary" && img.cloudinary_public_id) {
          console.log(`☁️ ✅ YA EN CLOUDINARY - Mantener referencia`);
          return {
            orden: index + 1,
            tipo: "cloudinary",
            contenido: img.cloudinary_url || img.url,
            cloudinary_public_id: img.cloudinary_public_id,
            cloudinary_url: img.cloudinary_url || img.url,
            mime_type: "image/jpeg",
            nombre: img.file?.name || `imagen-${index + 1}.jpg`,
          };
        }

        // PRIORIDAD 4: Imágenes subidas por el usuario - ENVIAR A CLOUDINARY
        if (img.file || img.isUploaded) {
          // En este punto la imagen debió subir ya (DestinationImageManager) y tener url/public_id
          console.log(`☁️ ✅ IMAGEN DE USUARIO (ya subida) - Usar metadata Cloudinary`);
          const secureUrl = img.cloudinary_url || img.url;
          const publicId = img.cloudinary_public_id || (() => {
            // Intento de extracción simple si faltó public_id
            try {
              const parts = (secureUrl || "").split("/upload/")[1];
              if (parts) {
                const afterVersion = parts.replace(/^v\d+\//, "");
                return afterVersion.split(".").slice(0, -1).join(".");
              }
            } catch (_) {}
            return null;
          })();

          return {
            orden: index + 1,
            tipo: "cloudinary",
            contenido: secureUrl, // Siempre URL final, no dataURL
            mime_type: img.file?.type || "image/jpeg",
            nombre: img.file?.name || img.nombre || `imagen-usuario-${index + 1}.jpg`,
            ...(publicId ? { cloudinary_public_id: publicId } : {}),
            ...(secureUrl ? { cloudinary_url: secureUrl } : {}),
          };
        }

        // FALLBACK: Si llegamos aquí, es una URL externa
        console.log(`⚠️ FALLBACK - Tratando como URL externa`);
        return {
          orden: index + 1,
          tipo: "url",
          contenido: img.url,
          mime_type: "image/jpeg",
          nombre: img.url?.split("/").pop() || `imagen-${index + 1}.jpg`,
        };
      }),
    );

    // Resumen final
    const resumen = {
      total: processedImages.length,
      cloudinary: processedImages.filter((img) => img.tipo === "cloudinary")
        .length,
      url: processedImages.filter((img) => img.tipo === "url").length,
      google_places: processedImages.filter(
        (img) => img.tipo === "google_places_url",
      ).length,
    };

    console.log(
      "✅ RESUMEN FINAL - Usuario→Cloudinary, Pexels/Google→Backend directo:",
      resumen,
    );
    console.log("🧾 IMÁGENES PROCESADAS DETALLE:", processedImages.map(p => ({ orden: p.orden, tipo: p.tipo, public_id: p.cloudinary_public_id, urlPreview: (p.contenido || p.cloudinary_url || "").substring(0,60)+"..." })));

    return processedImages;
  };

  const processImagesOrderOnly = async (images) => {
    console.log("🔄 Procesando solo cambios de orden de imágenes:", {
      total: images.length,
      imagenes: images.map((img) => ({
        id: img.id,
        isExisting: isExistingImage(img),
        hasFile: !!img.file,
        tipo: img.tipo,
      })),
    });

    // Usar la función auxiliar para crear el payload optimizado
    const orderOnlyPayload = createOrderOnlyPayload(images);

    console.log("📋 Payload de orden creado:", {
      count: orderOnlyPayload.length,
      payload: orderOnlyPayload,
    });

    // Verificar si hay imágenes que no son existentes (error en detección)
    const nonExistingImages = images.filter((img) => !isExistingImage(img));

    if (nonExistingImages.length > 0) {
      console.warn(
        "⚠️ Encontradas imágenes no existentes en processImagesOrderOnly:",
        nonExistingImages.map((img) => ({
          id: img.id,
          isUploaded: img.isUploaded,
          hasFile: !!img.file,
          tipo: img.tipo,
        })),
      );

      // Procesar las nuevas imágenes de forma normal
      const newImagesPayload = await Promise.all(
        nonExistingImages.map(async (img, index) => {
          if (img.file) {
            // Imágenes subidas por el usuario van a Cloudinary
            console.log(
              `☁️ Nueva imagen de usuario ${index + 1} - A Cloudinary`,
            );
            return {
              orden: images.indexOf(img) + 1,
              tipo: "cloudinary",
              contenido: img.url,
              mime_type: img.file?.type || "image/jpeg",
              nombre: img.file?.name || `imagen-nueva-${index + 1}.jpg`,
            };
          }

          console.log(`🔗 Nueva imagen externa ${index + 1} - URL`);
          return {
            orden: images.indexOf(img) + 1,
            tipo: "url",
            contenido: img.url,
            mime_type: "image/jpeg",
            nombre: `imagen-nueva-${index + 1}.jpg`,
          };
        }),
      );

      console.log("🔄 Combinando imágenes existentes + nuevas:", {
        existentes: orderOnlyPayload.length,
        nuevas: newImagesPayload.length,
        total: orderOnlyPayload.length + newImagesPayload.length,
      });

      // Combinar imágenes existentes (solo orden) con nuevas (completas)
      return [...orderOnlyPayload, ...newImagesPayload];
    }

    console.log("✅ Payload optimizado solo para orden:", {
      total: orderOnlyPayload.length,
    });

    return orderOnlyPayload;
  };

  const processHotel = async (hotel) => {
    if (!hotel) return null;

    console.log("🏨 Procesando hotel:", {
      place_id: hotel.place_id,
      id: hotel.id,
      nombre: hotel.nombre,
      estrellas: hotel.estrellas,
      estrellas_type: typeof hotel.estrellas,
      total_calificaciones: hotel.total_calificaciones,
      total_calificaciones_type: typeof hotel.total_calificaciones,
      isCustom: hotel.isCustom,
    });

    let hotelImages = [];
    const isGoogleHotel = !hotel.isCustom && !!hotel.place_id;
    const originalList = hotel.imagenes || hotel.images || [];
    const imageList = originalList.slice(0, 10);
    setHotelImagesProgress({ total: imageList.length, processed: 0, dropped: 0, errors: 0, inProgress: imageList.length > 0, lastMessage: 'Iniciando procesamiento hotel' });

    // Subir archivo de hotel a Cloudinary si no se ha subido aún.
    const ensureHotelImageInCloudinary = async (img) => {
      // Si ya viene con cloudinary_public_id o url segura, retornamos metadatos.
      if (img.cloudinary_public_id && (img.cloudinary_url || img.contenido)) {
        return {
          cloudinary_public_id: img.cloudinary_public_id,
          cloudinary_url: img.cloudinary_url || img.contenido,
        };
      }
      // Convertir dataURL a File si llega así (caso manual que no generó file)
      if (!img.file && img.contenido && typeof img.contenido === 'string' && img.contenido.startsWith('data:image')) {
        try {
          const commaIdx = img.contenido.indexOf(',');
          const meta = img.contenido.substring(0, commaIdx);
            const mimeMatch = /data:(.*?);base64/.exec(meta);
            const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
            const b64 = img.contenido.substring(commaIdx + 1);
            const bin = atob(b64);
            const len = bin.length;
            const arr = new Uint8Array(len);
            for (let i=0;i<len;i++) arr[i] = bin.charCodeAt(i);
            const file = new File([arr], img.nombre || 'hotel-inline.jpg', { type: mime });
            img.file = file; // mutación controlada para pipeline
            console.log('🧪 Convertida dataURL->File para subida hotel');
        } catch (convErr) {
          console.warn('⚠️ Falló conversión dataURL->File, descartando imagen');
          return null;
        }
      }
      if (!img.file) return null; // No hay archivo que subir después de intento de conversión
      try {
        if (!cloudinarySvc?.uploadImage) {
          console.error('❌ cloudinaryService.uploadImage no disponible');
          return null;
        }
        console.log('☁️ [ensureHotelImageInCloudinary] Subiendo a Cloudinary', img.file.name, img.file.size);
        const result = await cloudinarySvc.uploadImage(img.file, 'hoteles');
        return {
          cloudinary_public_id: result.public_id,
          cloudinary_url: result.secure_url || result.url,
        };
      } catch (e) {
        console.error('❌ Falló subida Cloudinary imagen hotel:', e);
        return null;
      }
    };

    const delay = (ms) => new Promise(r => setTimeout(r, ms));
    const fetchAsBlob = async (url, attempt = 1) => {
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return await res.blob();
      } catch (e) {
        if (attempt < 2) {
          console.warn(`↩️ Retry descarga (${attempt}) URL hotel:`, url, e.message);
          await delay(350);
          return fetchAsBlob(url, attempt + 1);
        }
        console.warn('⚠️ No se pudo descargar URL para subir a Cloudinary:', url, e.message);
        setHotelImagesProgress(prev => ({ ...prev, errors: prev.errors + 1, lastMessage: `Fallo descarga ${url.substring(0,40)}...` }));
        return null;
      }
    };

    for (let index = 0; index < imageList.length; index++) {
      const img = imageList[index];
        console.log(`🏨 Procesando imagen de hotel ${index + 1}:`, {
          tipo: img.tipo,
          hasFile: !!img.file,
          contenido: img.contenido?.substring(0, 50) + "...",
          isUserUpload: !!img.file,
        });

        // Caso especial: si es hotel Google y la imagen es google_places_url, NO convertir, se envía tal cual
        if (isGoogleHotel && img.tipo === 'google_places_url' && img.contenido) {
          const cacheKey = `google:${img.contenido}`;
          if (hotelImageCacheRef.current[cacheKey]) {
            const cached = hotelImageCacheRef.current[cacheKey];
            const entry = { orden: index + 1, ...cached };
            hotelImages.push(entry);
            setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, lastMessage: `Reutilizada Google ${index+1}` }));
            continue;
          }
          const entry = { orden: index + 1, tipo: 'google_places_url', contenido: img.contenido, mime_type: img.mime_type || 'image/jpeg', nombre: img.nombre || `hotel-google-${index + 1}.jpg` };
          hotelImageCacheRef.current[cacheKey] = { ...entry };
          hotelImages.push(entry);
          setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, lastMessage: `Imagen Google ${index+1}` }));
          continue;
        }

        // Normalizar cualquier otra entrada (file o url) a Cloudinary
        if (img.file) {
          const fileKey = `file:${img.file.name}:${img.file.size}:${img.file.lastModified}`;
          if (hotelImageCacheRef.current[fileKey]) {
            const cached = hotelImageCacheRef.current[fileKey];
            hotelImages.push({ orden: index + 1, ...cached });
            setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, lastMessage: `Reutilizada Cloudinary ${index+1}` }));
            continue;
          }
          console.log('☁️ Subiendo archivo hotel a Cloudinary');
          const uploaded = await ensureHotelImageInCloudinary(img);
          if (!uploaded?.cloudinary_url) {
            hotelImages.push({ drop: true });
            setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, dropped: prev.dropped + 1, lastMessage: `Descartada (fallo subida) ${index+1}` }));
            continue;
          }
          const cloudEntry = {
            orden: index + 1,
            tipo: 'cloudinary',
            contenido: uploaded.cloudinary_url,
            cloudinary_public_id: uploaded.cloudinary_public_id,
            cloudinary_url: uploaded.cloudinary_url,
            mime_type: img.file?.type || 'image/jpeg',
            nombre: img.file?.name || `hotel-imagen-${index + 1}.jpg`,
          };
          hotelImages.push(cloudEntry);
          hotelImageCacheRef.current[fileKey] = { ...cloudEntry };
          setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, lastMessage: `Subida cloudinary ${index+1}` }));
          continue;
        }

        const rawUrl = img.contenido || img.url;
        if (!rawUrl) {
          hotelImages.push({ drop: true });
          setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, dropped: prev.dropped + 1, lastMessage: `Sin URL ${index+1}` }));
          continue;
        }
        const urlKey = `url:${rawUrl}`;
        if (hotelImageCacheRef.current[urlKey]) {
          const cached = hotelImageCacheRef.current[urlKey];
          hotelImages.push({ orden: index + 1, ...cached });
          setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, lastMessage: `Reutilizada URL ${index+1}` }));
          continue;
        }

        console.log('🌐 Descargando para subir a Cloudinary:', rawUrl.substring(0,80)+'...');
        const blob = await fetchAsBlob(rawUrl);
        if (!blob) {
          hotelImages.push({ drop: true });
          setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, dropped: prev.dropped + 1 }));
          continue;
        }
        const fileLike = new File([blob], img.nombre || `hotel-url-${index + 1}.jpg`, { type: blob.type || 'image/jpeg' });
        try {
          const uploaded = await cloudinarySvc.uploadImage(fileLike, 'hoteles');
          const converted = {
            orden: index + 1,
            tipo: 'cloudinary',
            contenido: uploaded.secure_url || uploaded.url,
            cloudinary_public_id: uploaded.public_id,
            cloudinary_url: uploaded.secure_url || uploaded.url,
            mime_type: blob.type || 'image/jpeg',
            nombre: fileLike.name,
          };
          hotelImages.push(converted);
          hotelImageCacheRef.current[urlKey] = { ...converted };
          setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, lastMessage: `Convertida URL ${index+1}` }));
          continue;
        } catch (e) {
          console.error('❌ Falló subida desde URL para hotel -> descartada', rawUrl, e.message);
          hotelImages.push({ drop: true });
          setHotelImagesProgress(prev => ({ ...prev, processed: prev.processed + 1, dropped: prev.dropped + 1, lastMessage: `Error URL ${index+1}` }));
          continue;
        }
    }

    // Validar longitud y caracteres de cada imagen (>=2000 indica probable dataURL base64 gigante)
    const sanitizedHotelImages = hotelImages
      .map(hImg => {
        let img = { ...hImg };
        if (img.drop) return img; // marcar para filtrar luego
        if (typeof img.contenido === 'string') {
          if (img.contenido.startsWith('data:image') && img.contenido.length > 2000) {
            console.warn('⚠️ Eliminando dataURL grande de imagen hotel (subir a Cloudinary faltó). Longitud:', img.contenido.length);
            return { ...img, drop: true };
          }
          if (img.contenido.length > 2000 && img.tipo !== 'cloudinary') {
            console.warn('⚠️ Cadena >2000 (no cloudinary). Manteniendo pero revisar backend:', img.contenido.substring(0,60)+'...');
          }
        }
        if (img.cloudinary_public_id && img.cloudinary_url) {
          // Forzar uniformidad cloudinary
            img = {
            ...img,
            tipo: 'cloudinary',
            contenido: img.cloudinary_url,
          };
        }
        return img;
      })
      .filter(img => !img.drop);

    const hotelPayload = {
      placeId: hotel.place_id || hotel.id,
      nombre: hotel.nombre,
      estrellas:
        hotel.estrellas && !isNaN(hotel.estrellas)
          ? Number(hotel.estrellas)
          : 0,
      isCustom: hotel.isCustom || false,
      total_calificaciones:
        hotel.total_calificaciones && !isNaN(hotel.total_calificaciones)
          ? Number(hotel.total_calificaciones)
          : 0,
      imagenes: sanitizedHotelImages.map((img, idx) => ({
        orden: idx + 1,
        tipo: img.tipo,
        contenido: img.contenido,
        mime_type: img.mime_type || 'image/jpeg',
        nombre: img.nombre || `hotel-imagen-${idx + 1}.jpg`,
        ...(img.cloudinary_public_id ? { cloudinary_public_id: img.cloudinary_public_id } : {}),
        ...(img.cloudinary_url ? { cloudinary_url: img.cloudinary_url } : {}),
      })),
    };

  console.log("📋 Hotel payload final:", hotelPayload);
  setHotelImagesProgress(prev => ({ ...prev, inProgress: false, lastMessage: `Finalizado: ${hotelPayload.imagenes.length} válidas / ${prev.dropped} descartadas` }));

    return hotelPayload;
  };

  const origin = useMemo(
    () => ({
      lat: parseFloat(formData.origen_lat) || null,
      lng: parseFloat(formData.origen_lng) || null,
      name: formData.origen,
    }),
    [formData.origen_lat, formData.origen_lng, formData.origen],
  );

  const destination = useMemo(
    () => ({
      lat: parseFloat(formData.destino_lat) || null,
      lng: parseFloat(formData.destino_lng) || null,
      name: formData.destino,
    }),
    [formData.destino_lat, formData.destino_lng, formData.destino],
  );

  const currentPatchPayload = useMemo(() => {
    if (!originalDataRef.current) return null;

    try {
      return preparePatchPayload(originalDataRef.current, formData);
    } catch (error) {
      console.warn("Error calculando PATCH payload:", error);
      return null;
    }
  }, [formData]);

  return {
    formData,
    setFormData,
    selectionMode,
    searchValue,
    origin,
    destination,
    setSelectionMode,
    setSearchValue,
    handlePlaceSelected,
    onMapClick,
    handleFormChange,
    handleHotelSelected,
    handleImagesChange,
    handleAddDestination,
    handleRemoveDestination,
    handleSubmit,
    currentPatchPayload,
    hotelImagesProgress,
  };
};
