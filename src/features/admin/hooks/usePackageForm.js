import { useState, useCallback, useEffect } from "react";
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
    precio_base: "",
    itinerario: [{ dia: 1, descripcion: "" }],
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
    (coords, formattedAddress) => {
      const fieldName = selectionMode === "origen" ? "origen" : "destino";
      const simplifiedAddress = formattedAddress
        .split(",")
        .slice(0, 2)
        .join(", ");

      setFormData((prev) => ({
        ...prev,
        [`${fieldName}`]: simplifiedAddress,
        [`${fieldName}_lat`]: coords.lat,
        [`${fieldName}_lng`]: coords.lng,
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
          const addressComponents = results[0].address_components;
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

    try {
      await api.packages.createPaquete(formData);
      alert("Paquete creado con éxito");
      navigate("/admin/paquetes");
    } catch (error) {
      console.error("Error al crear el paquete:", error);
      alert("Error al crear el paquete");
    }
  };

  const origin = {
    lat: parseFloat(formData.origen_lat) || null,
    lng: parseFloat(formData.origen_lng) || null,
  };

  const destination = {
    lat: parseFloat(formData.destino_lat) || null,
    lng: parseFloat(formData.destino_lng) || null,
  };

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
    handleItinerarioChange,
    handleAddItinerario,
    handleRemoveItinerario,
    handleSubmit,
  };
};
