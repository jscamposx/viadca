import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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

const isUUID = (str) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
    str,
  );

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const usePackageForm = (initialPackageData = null) => {
  const navigate = useNavigate();

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
    precio_original: "",
    notas: null,
    itinerario_texto: "",
    activo: true,
    origen: "Durango, México",
    origen_lat: 24.0277,
    origen_lng: -104.6532,
    destino: "",
    destino_lat: null,
    destino_lng: null,
    additionalDestinations: [],
    destinos: [],
    imagenes: [],
    hotel: null,
    mayoristas: [],
    mayoristasIds: [],
  });

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

      const processedImages = (initialPackageData.imagenes || []).map(
        (img, index) => {
          // Determinar si es contenido subido por usuario (que debería ir a Cloudinary)
          const isUserUpload =
            img.tipo === "cloudinary" ||
            (img.contenido && img.contenido.includes("base64")) ||
            (img.contenido && !img.contenido.startsWith("http"));

          let imageUrl;
          if (isUserUpload && !img.contenido?.startsWith("http")) {
            // Para contenido de usuario o base64 legacy
            imageUrl = img.contenido?.startsWith("data:")
              ? img.contenido
              : `data:${img.mime_type || "image/jpeg"};base64,${img.contenido}`;
          } else if (img.contenido?.startsWith("http")) {
            // Para URLs externas
            imageUrl = img.contenido;
          } else {
            // Para rutas de archivos en el servidor
            imageUrl = `${import.meta.env.VITE_API_URL}/uploads/${img.contenido}`;
          }

          return {
            id: img.id || `img-${index}`,
            url: imageUrl,
            orden: img.orden || index + 1,
            tipo: img.tipo || (isUserUpload ? "cloudinary" : "url"),
            isUploaded: img.tipo === "cloudinary" || isUserUpload,
            file: null,
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

        destino: initialDestino.destino || initialPackageData.destino || "",
        destino_lat:
          initialDestino.destino_lat || initialPackageData.destino_lat || null,
        destino_lng:
          initialDestino.destino_lng || initialPackageData.destino_lng || null,

        additionalDestinations: (initialPackageData.destinos || [])
          .slice(1)
          .map((dest) => ({
            name: dest.destino,
            lat: dest.destino_lat,
            lng: dest.destino_lng,
          })),

        destinos: initialPackageData.destinos || [],
        imagenes: processedImages,
        hotel: initialPackageData.hotel || null,
        mayoristas: initialPackageData.mayoristas || [],
        mayoristasIds: mayoristasIds,
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
      const simplifiedAddress = formatted_address
        .split(",")
        .slice(0, 2)
        .join(", ");

      setFormData((prev) => ({
        ...prev,
        ...(selectionMode === "destino"
          ? {
              destino: simplifiedAddress,
              destino_lat: lat(),
              destino_lng: lng(),
            }
          : {
              origen: simplifiedAddress,
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
            const simplifiedAddress = place.formatted_address
              .split(",")
              .slice(0, 2)
              .join(", ");

            setFormData((prev) => ({
              ...prev,
              ...(selectionMode === "destino"
                ? {
                    destino: simplifiedAddress,
                    destino_lat: latLng.lat,
                    destino_lng: latLng.lng,
                  }
                : {
                    origen: simplifiedAddress,
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

    if (!formData.origen_lat || !formData.destino_lat) {
      if (addNotification) {
        addNotification(
          "Por favor, selecciona tanto el origen como el destino en el mapa.",
          "error",
        );
      }
      return;
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

    if (processingFlags.images) {
      console.log("🖼️ Modo: Procesamiento completo de imágenes");
      finalPayload.imagenes = await processImages(formData.imagenes || []);
    } else if (processingFlags.imagesOrderOnly) {
      console.log("⚡ Modo: Solo actualización de orden (optimizado)");
      finalPayload.imagenes = await processImagesOrderOnly(
        formData.imagenes || [],
      );
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

    const packageImages = await processImages(formData.imagenes || []);
    const hotelPayload = await processHotel(formData.hotel);

    console.log("🆕 Creando paquete - Mayoristas:", {
      mayoristasIds: formData.mayoristasIds,
      count: (formData.mayoristasIds || []).length,
    });

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
      destinos: [
        {
          destino: formData.destino,
          destino_lng: parseFloat(formData.destino_lng),
          destino_lat: parseFloat(formData.destino_lat),
          orden: 1,
        },
        ...(formData.additionalDestinations || []).map((dest, index) => ({
          destino: dest.name,
          destino_lng: parseFloat(dest.lng),
          destino_lat: parseFloat(dest.lat),
          orden: index + 2,
        })),
      ],
      imagenes: packageImages,
      hotel: hotelPayload,
    };

    console.log("📤 Enviando CREATE - Payload completo:", {
      payload,
      mayoristasIncluded: "mayoristasIds" in payload,
      mayoristasCount: (payload.mayoristasIds || []).length,
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
    // Debug: mostrar información DETALLADA sobre los tipos de imágenes
    console.log("🔍 ANÁLISIS DETALLADO de imágenes a procesar:", {
      total: images.length,
      tipos: images.map((img, idx) => ({
        indice: idx,
        id: img.id,
        tipo: img.tipo || "indefinido",
        source: img.source || "sin source",
        isUploaded: img.isUploaded,
        esUsuario: img.file || img.url?.startsWith("data:"),
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
          isUserUpload: img.file || img.url?.startsWith("data:"),
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
        if (img.file || img.url?.startsWith("data:") || img.isUploaded) {
          console.log(`☁️ ✅ IMAGEN DE USUARIO - Enviar a Cloudinary`);
          return {
            orden: index + 1,
            tipo: "cloudinary",
            contenido: img.url, // El backend se encarga de subirla a Cloudinary
            mime_type: img.file?.type || "image/jpeg",
            nombre: img.file?.name || `imagen-usuario-${index + 1}.jpg`,
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
          if (img.url?.startsWith("data:image") || img.file) {
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
    const imageList = hotel.imagenes || hotel.images || [];

    hotelImages = await Promise.all(
      imageList.map(async (img, index) => {
        console.log(`🏨 Procesando imagen de hotel ${index + 1}:`, {
          tipo: img.tipo,
          hasFile: !!img.file,
          contenido: img.contenido?.substring(0, 50) + "...",
          isUserUpload: img.file || img.contenido?.startsWith("data:"),
        });

        // PRIORIDAD 1: Imágenes de Google Places
        if (img.tipo === "google_places_url" && img.contenido) {
          console.log(`🗺️ Hotel imagen Google Places`);
          return {
            orden: index + 1,
            tipo: "google_places_url",
            contenido: img.contenido,
            mime_type: img.mime_type || "image/jpeg",
            nombre: img.nombre || `hotel-imagen-${index + 1}.jpg`,
          };
        }

        // PRIORIDAD 2: Imágenes subidas por el usuario - VAN A CLOUDINARY
        if (img.file || (img.contenido && img.contenido.startsWith("data:"))) {
          console.log(`☁️ Hotel imagen de usuario - A Cloudinary`);
          return {
            orden: index + 1,
            tipo: "cloudinary",
            contenido: img.contenido || img.url,
            mime_type: img.file?.type || "image/jpeg",
            nombre: img.file?.name || `hotel-imagen-usuario-${index + 1}.jpg`,
          };
        }

        // PRIORIDAD 3: URLs externas
        const imageUrl = img.contenido || img.url;
        console.log(`🔗 Hotel imagen URL externa`);
        return {
          orden: index + 1,
          tipo: "url",
          contenido: imageUrl,
          mime_type: img.mime_type || "image/jpeg",
          nombre: img.nombre || imageUrl.split("/").pop(),
        };
      }),
    );

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
      imagenes: hotelImages,
    };

    console.log("📋 Hotel payload final:", hotelPayload);

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
  };
};
