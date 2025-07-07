import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import api from "../../../api";

import PackageForm from "../../../components/admin/PackageForm";
import LocationSelector from "../../../components/admin/LocationSelector";
import ItineraryEditor from "../../../components/admin/ItineraryEditor";

const durangoCoordinates = {
  lat: 24.0277,
  lng: -104.6532,
};

const NuevoPaquete = () => {
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
  const navigate = useNavigate();

  const setCoordinates = useCallback(
    (coords) => {
      if (selectionMode === "origen") {
        setFormData((prev) => ({
          ...prev,
          origen_lat: coords.lat,
          origen_lng: coords.lng,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          destino_lat: coords.lat,
          destino_lng: coords.lng,
        }));
      }
    },
    [selectionMode],
  );

  const onMapClick = useCallback(
    (event) => {
      const { lat, lng } = event.detail.latLng; // NO usar lat()
      setCoordinates({ lat, lng });
    },
    [setCoordinates],
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
    const itinerario = [...formData.itinerario];
    itinerario.splice(index, 1);
    setFormData((prev) => ({ ...prev, itinerario }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.origen_lat ||
      !formData.origen_lng ||
      !formData.destino_lat ||
      !formData.destino_lng
    ) {
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

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_Maps_API_KEY}
      libraries={["places"]}
    >
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">
          Crear Nuevo Paquete Turístico
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PackageForm formData={formData} onFormChange={handleFormChange} />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Selección de Ubicación</h2>
            <div className="flex items-center gap-4 mb-4">
              <p>Seleccionando:</p>
              <button
                type="button"
                onClick={() => setSelectionMode("origen")}
                className={`p-2 rounded font-bold ${selectionMode === "origen" ? "bg-blue-600 text-white" : "bg-blue-200"}`}
                aria-pressed={selectionMode === "origen"}
              >
                Origen
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode("destino")}
                className={`p-2 rounded font-bold ${selectionMode === "destino" ? "bg-green-600 text-white" : "bg-green-200"}`}
                aria-pressed={selectionMode === "destino"}
              >
                Destino
              </button>
            </div>
            <LocationSelector
              onMapClick={onMapClick}
              origin={
                isFinite(parseFloat(formData.origen_lat)) &&
                isFinite(parseFloat(formData.origen_lng))
                  ? {
                      lat: parseFloat(formData.origen_lat),
                      lng: parseFloat(formData.origen_lng),
                    }
                  : null
              }
              destination={
                isFinite(parseFloat(formData.destino_lat)) &&
                isFinite(parseFloat(formData.destino_lng))
                  ? {
                      lat: parseFloat(formData.destino_lat),
                      lng: parseFloat(formData.destino_lng),
                    }
                  : null
              }
            />
          </div>

          <ItineraryEditor
            itinerario={formData.itinerario}
            onItinerarioChange={handleItinerarioChange}
            onAddItinerario={handleAddItinerario}
            onRemoveItinerario={handleRemoveItinerario}
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded font-bold"
          >
            Crear Paquete
          </button>
        </form>
      </div>
    </APIProvider>
  );
};

export default NuevoPaquete;
