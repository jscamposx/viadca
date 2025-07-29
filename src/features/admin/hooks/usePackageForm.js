import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const isUUID = (str) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
    str,
  );

// Helper para convertir archivos a Base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const usePackageForm = (initialPackageData = null) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: "",
    fecha_inicio: "",
    fecha_fin: "",
    incluye: "",
    no_incluye: "",
    requisitos: "",
    descuento: "",
    anticipo: "",
    precio_total: "",
    notas: "",
    itinerario_texto: "",
    activo: true, // Campo requerido por el backend
    origen: "Durango, México", // Valor por defecto
    origen_lat: 24.0277,
    origen_lng: -104.6532,
    destino: "",
    destino_lat: null,
    destino_lng: null,
    additionalDestinations: [], // Para destinos adicionales
    destinos: [],
    imagenes: [],
    hotel: null,
    mayoristasIds: [], // Añadido para los IDs de mayoristas
  });

  useEffect(() => {
    if (initialPackageData) {
      // Mapear datos existentes al nuevo formato del formulario
      const initialDestino = initialPackageData.destinos?.[0] || {};
      setFormData({
        ...initialPackageData,
        // Asegurar que los campos de origen estén poblados
        origen: initialPackageData.origen || "Durango, México",
        origen_lat: initialPackageData.origen_lat || 24.0277,
        origen_lng: initialPackageData.origen_lng || -104.6532,
        // Asegurar que los campos de destino estén poblados desde el destino principal
        destino: initialDestino.destino || initialPackageData.destino,
        destino_lat: initialDestino.destino_lat || initialPackageData.destino_lat,
        destino_lng: initialDestino.destino_lng || initialPackageData.destino_lng,
        // Mapear destinos adicionales
        additionalDestinations: (initialPackageData.destinos || [])
          .slice(1) // Omitir el primer destino (principal)
          .map(dest => ({
            name: dest.destino,
            lat: dest.destino_lat,
            lng: dest.destino_lng
          })),
      });
    }
  }, [initialPackageData]);

  const [selectionMode, setSelectionMode] = useState("destino");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(
      selectionMode === "destino" 
        ? formData.destino 
        : formData.origen
    );
  }, [selectionMode, formData.origen, formData.destino]);

  const handlePlaceSelected = useCallback((place) => {
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
          })
    }));
  }, [selectionMode]);

  const onMapClick = useCallback((event) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ 
      location: latLng,
      language: "es",
      region: "MX" // Preferencia por México, pero no restricción
    }, (results, status) => {
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
              })
        }));
      }
    });
  }, [selectionMode]);

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

  const handleAddDestination = useCallback((destination) => {
    // Verificar que no sea duplicado
    const isDuplicate = 
      (formData.destino === destination.name) ||
      (formData.additionalDestinations || []).some(dest => dest.name === destination.name);
    
    if (isDuplicate) {
      console.warn('Destino duplicado, no se agregará:', destination.name);
      return false;
    }

    setFormData((prev) => ({
      ...prev,
      additionalDestinations: [...(prev.additionalDestinations || []), destination]
    }));
    return true;
  }, [formData.destino, formData.additionalDestinations]);

  const handleRemoveDestination = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      additionalDestinations: prev.additionalDestinations.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSubmit = async (event, addNotification) => {
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

    // Procesar imágenes del paquete
    const packageImages = await Promise.all(
      (formData.imagenes || []).map(async (img, index) => {
        if (img.url.startsWith("data:")) {
          // Es una nueva imagen en base64
          return {
            orden: index + 1,
            tipo: "base64",
            contenido: img.url.split(",")[1], // Solo la parte base64
            mime_type: img.file.type,
            nombre: img.file.name,
          };
        }
        // Es una imagen existente (URL)
        return {
          orden: index + 1,
          tipo: "url",
          contenido: img.url,
          mime_type: "image/jpeg", // Asumir o derivar si es posible
          nombre: img.url.split("/").pop(),
        };
      }),
    );

    // Procesar imágenes del hotel si existe
    let hotelPayload = null;
    if (formData.hotel) {
      const hotelImages = await Promise.all(
        (formData.hotel.images || []).map(async (img, index) => {
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

      hotelPayload = {
        placeId: formData.hotel.place_id || formData.hotel.id,
        nombre: formData.hotel.nombre,
        estrellas: formData.hotel.estrellas,
        isCustom: formData.hotel.isCustom || false,
        total_calificaciones: formData.hotel.total_calificaciones,
        imagenes: hotelImages,
      };
    }

    const payload = {
      titulo: formData.titulo,
      origen: formData.origen,
      origen_lat: formData.origen_lat,
      origen_lng: formData.origen_lng,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      incluye: formData.incluye,
      no_incluye: formData.no_incluye,
      requisitos: formData.requisitos,
      precio_total: parseFloat(formData.precio_total),
      descuento: formData.descuento ? parseFloat(formData.descuento) : null,
      anticipo: formData.anticipo ? parseFloat(formData.anticipo) : null,
      notas: formData.notas,
      activo: formData.activo,
      mayoristasIds: formData.mayoristasIds,
      itinerario_texto: formData.itinerario_texto,
      destinos: [
        {
          destino: formData.destino,
          destino_lng: formData.destino_lng,
          destino_lat: formData.destino_lat,
          orden: 1,
        },
        // Agregar destinos adicionales
        ...(formData.additionalDestinations || []).map((dest, index) => ({
          destino: dest.name,
          destino_lng: dest.lng,
          destino_lat: dest.lat,
          orden: index + 2,
        })),
      ],
      imagenes: packageImages,
      hotel: hotelPayload,
    };

    // Eliminar campos que no van en el payload final - mantener origen, origen_lat, origen_lng
    // porque el backend los espera
    // No eliminar nada de origen
    console.log("Payload a enviar:", payload);

    try {
      if (initialPackageData) {
        await api.packages.updatePaquete(initialPackageData.id, payload);
        if (addNotification)
          addNotification("Paquete actualizado con éxito", "success");
      } else {
        await api.packages.createPaquete(payload);
        if (addNotification)
          addNotification("Paquete creado con éxito", "success");
      }
      navigate("/admin/paquetes");
    } catch (error) {
      console.error("Error al procesar el paquete:", error.response || error);
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error inesperado.";
      if (addNotification) addNotification(`Error: ${errorMessage}`, "error");
    }
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
  };
};
