import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const durangoCoordinates = {
  lat: 24.0277,
  lng: -104.6532,
};

export const usePackageForm = () => {
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
    hotel: null, // Se añade el hotel al estado inicial
  });

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
        [`${fieldName}_place_id`]:
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
            [`${fieldName}_place_id`]:
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
    console.log("Hotel seleccionado, se agregará al formulario:", hotel);
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

    const payload = {
      ...formData,
      duracion: parseInt(formData.duracion, 10),
      precio_base: parseFloat(formData.precio_base),
      itinerario: formData.itinerario.map((item) => ({
        ...item,
        dia: parseInt(item.dia, 10),
      })),
      images: formData.images.map((img, index) => ({
        url: img.url,
        isUploaded: img.isUploaded,
        orden: index,
      })),
      hotel: formData.hotel, // Se incluye el hotel en el payload
    };

    console.log("Payload a enviar:", payload); 

    /*
    try {
      await api.packages.createPaquete(payload);
      alert("Paquete creado con éxito");
      navigate("/admin/paquetes");
    } catch (error) {
      console.error("Error al crear el paquete:", error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error al crear el paquete: ${errorMessage}`);
    }
    */
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
    handleHotelSelected, // Se exporta el nuevo manejador
    handleItinerarioChange,
    handleAddItinerario,
    handleRemoveItinerario,
    handleImagesChange,
    handleSubmit,
  };
};