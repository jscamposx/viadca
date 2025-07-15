// src/features/admin/hooks/usePackageForm.js

import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

// --- FUNCIÓN AUXILIAR REFINADA ---
// Esta función ahora se asegura de devolver solo un UUID válido.
const processImage = async (image) => {
  // Expresión regular para validar un UUID
  const isUUID = (str) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(str);

  // Si la imagen ya tiene un ID que es un UUID (viene de la edición de un paquete), lo usamos.
  if (image.id && isUUID(image.id)) {
    return image.id;
  }

  // Si la imagen tiene una URL de nuestro backend, podemos extraer el UUID.
  // Ejemplo: /uploads/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8.avif
  if (image.url && image.url.startsWith("/uploads/")) {
    const id = image.url.split('/').pop().split('.')[0];
    if (isUUID(id)) {
      return id;
    }
  }

  // Si la imagen es nueva (Base64 o una URL externa como Pexels),
  // la subimos a nuestro endpoint /imagenes/upload para que el backend
  // la procese y nos devuelva el UUID con el que la guardó.
  if (image.url && (image.url.startsWith("data:image") || image.url.startsWith("http"))) {
    try {
      const response = await api.images.uploadImage(image.url);
      // Asumimos que la respuesta contiene el ID que es un UUID
      if (response.data && isUUID(response.data.id)) {
        return response.data.id;
      }
    } catch (error) {
      console.error("Error al subir la imagen para obtener UUID:", error);
      return null;
    }
  }

  // Si no se puede determinar un UUID, se ignora la imagen.
  console.warn("No se pudo obtener un UUID para la imagen:", image);
  return null;
};


export const usePackageForm = (initialPackageData = null) => {
    // ... (el resto del hook hasta handleSubmit se mantiene igual)
    const [formData, setFormData] = useState({
    nombre_paquete: "",
    duracion: "",
    id_vuelo: "",
    requisitos: "",
    origen: "Durango, Dgo.",
    origen_lat: 24.0277,
    origen_lng: -104.6532,
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
        setFormData({
            ...initialPackageData,
            images: initialPackageData.imagenes || [],
            hotel: initialPackageData.hotel ? {
            ...initialPackageData.hotel,
            images: initialPackageData.hotel.imagenes || []
            } : null
        });
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

    // --- LÓGICA DE CONSTRUCCIÓN DEL PAYLOAD CORREGIDA ---

    // 1. Procesar todas las imágenes del paquete para obtener un array de UUIDs.
    const packageImageIds = await Promise.all(
      formData.images.map(processImage)
    );

    // 2. Procesar las imágenes del hotel para obtener su array de UUIDs.
    let hotelPayload = null;
    if (formData.hotel) {
      const hotelData = { ...formData.hotel };
      let hotelImageIds = [];

      if (hotelData.images && hotelData.images.length > 0) {
        hotelImageIds = await Promise.all(
          hotelData.images.map(processImage)
        );
      }
      
      const {
        images, // Quitar el array de objetos de imagen
        // Asegurarnos de quitar propiedades que no van en el DTO final
        place_id,
        previewImageUrl,
        total_calificaciones,
        ...restOfHotel
      } = hotelData;

      hotelPayload = {
        ...restOfHotel,
        imageIds: hotelImageIds.filter(Boolean), // Array de UUIDs válidos
      };
    }

    // 3. Construir el payload final para el paquete
    const { images, ...restOfFormData } = formData;
    
    const payload = {
      ...restOfFormData,
      duracion: parseInt(formData.duracion, 10),
      precio_base: parseFloat(formData.precio_base),
      itinerario: formData.itinerario.map((item) => ({
        ...item,
        dia: parseInt(item.dia, 10),
      })),
      imageIds: packageImageIds.filter(Boolean), // Array de UUIDs válidos
      hotel: hotelPayload,
    };

    console.log("Payload final a enviar (con UUIDs):", payload);

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