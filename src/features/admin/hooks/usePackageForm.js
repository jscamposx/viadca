import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const isUUID = (str) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
    str,
  );

const processImage = async (image) => {
  if (
    typeof image === "string" &&
    (isUUID(image) || image.startsWith("http"))
  ) {
    return image;
  }
  if (image.id && isUUID(image.id)) {
    return image.id;
  }
  if (image.url && image.url.startsWith("/uploads/")) {
    const id = image.url.split("/").pop().split(".")[0];
    if (isUUID(id)) return id;
  }
  if (image.url && image.url.startsWith("http")) {
    return image.url;
  }
  if (image.url && image.url.startsWith("data:image")) {
    try {
      const response = await api.images.upload({ image: image.url });
      if (response.data && response.data.id) {
        return response.data.id;
      }
    } catch (error) {
      console.error("Error al subir la imagen Base64:", error);
      return null;
    }
  }
  console.warn("No se pudo procesar la imagen:", image);
  return null;
};

export const usePackageForm = (initialPackageData = null) => {
  const [flights, setFlights] = useState([]);
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
      const sortedImages = (initialPackageData.imagenes || []).sort(
        (a, b) => a.orden - b.orden,
      );
      const sortedHotelImages = initialPackageData.hotel
        ? (initialPackageData.hotel.imagenes || []).sort(
            (a, b) => a.orden - b.orden,
          )
        : [];

      setFormData({
        ...initialPackageData,
        images: sortedImages,
        hotel: initialPackageData.hotel
          ? {
              ...initialPackageData.hotel,
              images: sortedHotelImages,
            }
          : null,
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

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await api.flights.getVuelos();
        setFlights(response.data);
      } catch (error) {
        console.error("Error al obtener los vuelos:", error);
      }
    };
    fetchFlights();
  }, []);

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

    let hotelPayload = null;
    if (formData.hotel) {
      const hotelImageIds = await Promise.all(
        (formData.hotel.images || []).map(processImage),
      );

      hotelPayload = {
        placeId: formData.hotel.place_id || formData.hotel.id,
        nombre: formData.hotel.nombre,
        estrellas: formData.hotel.estrellas,
        isCustom: formData.hotel.isCustom || false,
        total_calificaciones: formData.hotel.total_calificaciones,
        imageIds: hotelImageIds.filter(Boolean),
      };
    }

    const packageImageIds = await Promise.all(
      (formData.images || []).map(processImage),
    );

    const { images, ...restOfFormData } = formData;

    const payload = {
      ...restOfFormData,
      duracion: parseInt(formData.duracion, 10),
      precio_base: parseFloat(formData.precio_base),
      itinerario: formData.itinerario.map((item) => ({
        ...item,
        dia: parseInt(item.dia, 10),
      })),
      imageIds: packageImageIds.filter(Boolean),
      hotel: hotelPayload,
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
    flights,
    searchValue,
    origin,
    destination,
     setFormData,
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
