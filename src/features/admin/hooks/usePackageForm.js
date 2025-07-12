import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const durangoCoordinates = {
  lat: 24.0277,
  lng: -104.6532,
};

// --- FUNCIÓN AUXILIAR FINAL ---
// Esta función se encarga de que todas las URLs sean absolutas antes de enviarlas.
const uploadImageIfNeeded = async (image) => {
  // Si la URL es externa (Pexels, Google), ya es válida.
  if (typeof image.url === "string" && image.url.startsWith("http")) {
    return { url: image.url };
  }

  // Si es una imagen nueva en Base64, se sube y se completa la URL.
  if (typeof image.url === "string" && image.url.startsWith("data:image")) {
    try {
      const response = await api.packages.uploadBase64Image({ image: image.url });
      const API_URL = import.meta.env.VITE_API_URL;
      const fullUrl = `${API_URL}${response.data.url}`;
      return { url: fullUrl };
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      return null;
    }
  }

  // Si es una ruta relativa de nuestro backend (al editar), la completamos.
  if (typeof image.url === "string" && image.url.startsWith("/uploads")) {
    const API_URL = import.meta.env.VITE_API_URL;
    const fullUrl = `${API_URL}${image.url}`;
    return { url: fullUrl };
  }

  // Para cualquier otro caso, lo devolvemos como está pero advertimos en consola.
  console.warn("URL de imagen con formato no manejado:", image.url);
  return { url: image.url };
};


export const usePackageForm = (initialPackageData = null) => {
  const [formData, setFormData] = useState({
    nombre_paquete: "",
    duracion: "",
    id_vuelo: "",
    requisitos: "",
    origen: "Durango, Dgo.",
    origen_lat: durangoCoordinates.lat,
    origen_lng: durangoCoordinates.lng,
    destino: "",
    destino_lat: "",
    destino_lng: "",
    destino_place_id: "",
    precio_base: "",
    itinerario: [{ dia: 1, descripcion: "" }],
    images: [],
    hotel: null,
  });

  useEffect(() => {
    if (initialPackageData) {
      setFormData(initialPackageData);
    }
  }, [initialPackageData]);

  const [selectionMode, setSelectionMode] = useState("destino");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setSearchValue(
      selectionMode === "origen" ? formData.origen : formData.destino,
    );
  }, [selectionMode, formData.origen, formData.destino]);

  const handlePlaceSelected = useCallback(
    (place) => {
      const { geometry, formatted_address, place_id } = place;
      if (!geometry) return;

      const { lat, lng } = geometry.location;
      const fieldName = selectionMode === "origen" ? "origen" : "destino";
      const simplifiedAddress = formatted_address
        .split(",")
        .slice(0, 2)
        .join(", ");

      setFormData((prev) => ({
        ...prev,
        [`${fieldName}`]: simplifiedAddress,
        [`${fieldName}_lat`]: lat(),
        [`${fieldName}_lng`]: lng(),
        destino_place_id:
          fieldName === "destino" ? place_id : prev.destino_place_id,
      }));
    },
    [selectionMode],
  );

  const onMapClick = useCallback(
    (event) => {
      const latLng = event.detail.latLng;
      if (!latLng) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          const place = results[0];
          const addressComponents = place.address_components;
          let city = "";
          let state = "";

          for (const component of addressComponents) {
            if (component.types.includes("locality"))
              city = component.long_name;
            if (component.types.includes("administrative_area_level_1"))
              state = component.long_name;
          }

          const locationName = [city, state].filter(Boolean).join(", ");
          const fieldName = selectionMode === "origen" ? "origen" : "destino";

          setFormData((prev) => ({
            ...prev,
            [`${fieldName}`]: locationName,
            [`${fieldName}_lat`]: latLng.lat,
            [`${fieldName}_lng`]: latLng.lng,
            destino_place_id:
              fieldName === "destino" ? place.place_id : prev.destino_place_id,
          }));
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`,
          );
        }
      });
    },
    [selectionMode],
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = useCallback((newImages) => {
    setFormData((prev) => ({ ...prev, images: newImages }));
  }, []);

  const handleHotelSelected = useCallback((hotel) => {
    setFormData((prev) => ({ ...prev, hotel: hotel }));
  }, []);

  const handleItinerarioChange = (index, event) => {
    const { name, value } = event.target;
    const itinerario = [...formData.itinerario];
    itinerario[index][name] = value;
    setFormData((prev) => ({ ...prev, itinerario }));
  };

  const handleAddItinerario = () => {
    setFormData((prev) => ({
      ...prev,
      itinerario: [
        ...prev.itinerario,
        { dia: prev.itinerario.length + 1, descripcion: "" },
      ],
    }));
  };

  const handleRemoveItinerario = (index) => {
    const itinerario = [...formData.itinerario].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, itinerario }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.origen_lat || !formData.destino_lat) {
      alert("Por favor, selecciona el origen y el destino en el mapa.");
      return;
    }

    // 1. Procesar todas las imágenes para asegurar que las URLs sean absolutas
    const processedImages = await Promise.all(
      formData.images.map(uploadImageIfNeeded)
    );
    const cleanedImages = processedImages.filter(Boolean).map(({ url }) => ({ url }));

    // 2. Procesar y limpiar el objeto del hotel
    let cleanedHotel = null;
    if (formData.hotel) {
      const {
        place_id,
        previewImageUrl,
        total_calificaciones,
        ...hotelData
      } = formData.hotel;

      let processedHotelImages = [];
      if (hotelData.images && hotelData.images.length > 0) {
        processedHotelImages = await Promise.all(
          hotelData.images.map(uploadImageIfNeeded)
        );
      }

      cleanedHotel = {
        ...hotelData,
        images: processedHotelImages.filter(Boolean).map(({ url }) => ({ url })),
      };
    }

    // 3. Construir el payload final
    const payload = {
      ...formData,
      duracion: parseInt(formData.duracion, 10),
      precio_base: parseFloat(formData.precio_base),
      itinerario: formData.itinerario.map((item) => ({
        ...item,
        dia: parseInt(item.dia, 10),
      })),
      images: cleanedImages,
      hotel: cleanedHotel,
    };

    console.log("Payload final a enviar:", payload);

    try {
      if (initialPackageData) {
        await api.packages.updatePaquete(initialPackageData.url, payload);
        alert("Paquete actualizado con éxito");
      } else {
        await api.packages.createPaquete(payload);
        alert("Paquete creado con éxito");
      }
      navigate("/admin/paquetes");
    } catch (error) {
      console.error("Error al procesar el paquete:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error al procesar el paquete: ${errorMessage}`);
    }
  };

  const origin = useMemo(
    () => ({
      lat: parseFloat(formData.origen_lat) || null,
      lng: parseFloat(formData.origen_lng) || null,
    }),
    [formData.origen_lat, formData.origen_lng],
  );

  const destination = useMemo(
    () => ({
      lat: parseFloat(formData.destino_lat) || null,
      lng: parseFloat(formData.destino_lng) || null,
      placeId: formData.destino_place_id,
      name: formData.destino,
    }),
    [
      formData.destino_lat,
      formData.destino_lng,
      formData.destino_place_id,
      formData.destino,
    ],
  );

  return {
    formData,
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
    handleItinerarioChange,
    handleAddItinerario,
    handleRemoveItinerario,
    handleImagesChange,
    handleSubmit,
  };
};