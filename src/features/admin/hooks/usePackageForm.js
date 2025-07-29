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
    duracion_dias: "",
    incluye: "",
    no_incluye: "",
    requisitos: "",
    descuento: "",
    anticipo: "",
    precio_total: "",
    notas: "",
    itinerario_texto: "",
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
        // Asegurarse de que los campos de destino principales estén poblados
        destino: initialDestino.destino,
        destino_lat: initialDestino.destino_lat,
        destino_lng: initialDestino.destino_lng,
      });
    }
  }, [initialPackageData]);

  const [selectionMode, setSelectionMode] = useState("destino");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(selectionMode === "destino" ? formData.destino : "");
  }, [selectionMode, formData.destino]);

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
      destino: simplifiedAddress,
      destino_lat: lat(),
      destino_lng: lng(),
    }));
  }, []);

  const onMapClick = useCallback((event) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        const place = results[0];
        const simplifiedAddress = place.formatted_address
          .split(",")
          .slice(0, 2)
          .join(", ");

        setFormData((prev) => ({
          ...prev,
          destino: simplifiedAddress,
          destino_lat: latLng.lat,
          destino_lng: latLng.lng,
        }));
      }
    });
  }, []);

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

  const handleSubmit = async (event, addNotification) => {
    event.preventDefault();

    if (!formData.destino_lat) {
      if (addNotification) {
        addNotification(
          "Por favor, selecciona un destino en el mapa.",
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
      ...formData,
      duracion_dias: parseInt(formData.duracion_dias, 10),
      precio_total: parseFloat(formData.precio_total),
      descuento: formData.descuento ? parseFloat(formData.descuento) : null,
      anticipo: formData.anticipo ? parseFloat(formData.anticipo) : null,
      destinos: [
        {
          destino: formData.destino,
          destino_lng: formData.destino_lng,
          destino_lat: formData.destino_lat,
          orden: 1,
        },
      ],
      imagenes: packageImages,
      hotel: hotelPayload,
      // Aquí puedes agregar la lógica para mayoristasIds si tienes un selector en el formulario
    };

    // Eliminar campos que no van en el payload final
    delete payload.destino;
    delete payload.destino_lat;
    delete payload.destino_lng;

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
    destination,
    setSelectionMode,
    setSearchValue,
    handlePlaceSelected,
    onMapClick,
    handleFormChange,
    handleHotelSelected,
    handleImagesChange,
    handleSubmit,
  };
};
