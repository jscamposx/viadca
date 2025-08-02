import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import {
  preparePatchPayload,
  hasChanges,
  formatPayloadForLogging,
} from "../../../utils/patchHelper";
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
        (img, index) => ({
          id: img.id || index,
          url: img.contenido?.startsWith("http")
            ? img.contenido
            : img.contenido?.startsWith("data:")
              ? img.contenido
              : `${import.meta.env.VITE_API_URL}/uploads/${img.contenido}`,
          orden: img.orden || index + 1,
          tipo: img.tipo || "url",
          file: null,
        }),
      );

      const mayoristasIds = initialPackageData.mayoristas
        ? initialPackageData.mayoristas.map((m) => m.id)
        : initialPackageData.mayoristasIds || [];

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

  const handleSubmit = async (event, addNotification, backgroundMode = false) => {
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
        if (type === 'error' && addNotification) {
          addNotification(message, type);
        }
      };

      if (backgroundMode) {
        // En modo background, retornamos inmediatamente la promesa sin esperar
        const operation = initialPackageData ? 
          handlePatchUpdate(errorOnlyNotification) : 
          handleFullCreate(errorOnlyNotification);
        
        // Retornar la promesa para que se pueda manejar en background
        return {
          operation,
          isEdit: !!initialPackageData,
          packageTitle: formData.titulo
        };
      } else {
        // Modo normal (síncrono)
        if (initialPackageData) {
          await handlePatchUpdate(errorOnlyNotification);
        } else {
          await handleFullCreate(errorOnlyNotification);
        }

        // Navegar de vuelta con información de éxito SOLO si no hubo errores
        const successMessage = initialPackageData ? 
          "Paquete actualizado exitosamente" : 
          "Paquete creado exitosamente";
        
        navigate("/admin/paquetes", { 
          state: { 
            showNotification: true,
            notificationType: "success",
            notificationMessage: successMessage,
            shouldRefresh: true
          }
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
      hotel: patchPayload.hotel === "PROCESS_HOTEL",
    };

    if (processingFlags.images || processingFlags.hotel) {
      logPatchOperation("processing", processingFlags);
    }

    if (processingFlags.images) {
      finalPayload.imagenes = await processImages(formData.imagenes || []);
    }

    if (processingFlags.hotel) {
      finalPayload.hotel = await processHotel(formData.hotel);
    }

    logPatchOperation("sending", {
      fieldCount: Object.keys(finalPayload).length,
    });

    await api.packages.updatePaquete(initialPackageData.id, finalPayload);

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
      packageTitle: formData.titulo
    };
  };

  const handleFullCreate = async (addNotification) => {
    logPatchOperation("create-mode");

    const packageImages = await processImages(formData.imagenes || []);
    const hotelPayload = await processHotel(formData.hotel);

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

    const response = await api.packages.createPaquete(payload);

    logPatchOperation("create-success");

    return {
      packageId: response.data?.id || null,
      packageTitle: formData.titulo,
      created: true
    };
  };

  const processImages = async (images) => {
    return await Promise.all(
      images.map(async (img, index) => {
        if (img.url.startsWith("data:")) {
          return {
            orden: index + 1,
            tipo: "base64",
            contenido: img.url.split(",")[1],
            mime_type: img.file.type,
            nombre: img.file.name,
          };
        }

        return {
          orden: index + 1,
          tipo: "url",
          contenido: img.url,
          mime_type: "image/jpeg",
          nombre: img.url.split("/").pop(),
        };
      }),
    );
  };

  const processHotel = async (hotel) => {
    if (!hotel) return null;

    let hotelImages = [];
    const imageList = hotel.imagenes || hotel.images || [];

    hotelImages = await Promise.all(
      imageList.map(async (img, index) => {
        if (img.tipo === "google_places_url" && img.contenido) {
          return {
            orden: index + 1,
            tipo: "google_places_url",
            contenido: img.contenido,
            mime_type: img.mime_type || "image/jpeg",
            nombre: img.nombre || `hotel-imagen-${index + 1}.jpg`,
          };
        }

        if (img.tipo === "base64" && img.contenido) {
          return {
            orden: index + 1,
            tipo: "base64",
            contenido: img.contenido,
            mime_type: img.mime_type || "image/jpeg",
            nombre: img.nombre || `hotel-imagen-${index + 1}.jpg`,
          };
        }

        if (img.file && img.contenido && img.contenido.startsWith("data:")) {
          return {
            orden: index + 1,
            tipo: "base64",
            contenido: img.contenido.split(",")[1],
            mime_type: img.file.type,
            nombre: img.file.name,
          };
        }

        const imageUrl = img.contenido || img.url;
        return {
          orden: index + 1,
          tipo: "url",
          contenido: imageUrl,
          mime_type: img.mime_type || "image/jpeg",
          nombre: img.nombre || imageUrl.split("/").pop(),
        };
      }),
    );

    return {
      placeId: hotel.place_id || hotel.id,
      nombre: hotel.nombre,
      estrellas: hotel.estrellas,
      isCustom: hotel.isCustom || false,
      total_calificaciones: hotel.total_calificaciones,
      imagenes: hotelImages,
    };
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
