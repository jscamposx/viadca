// /src/pages/admin/Dashboard/NuevoPaquete.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// NUEVO: Importaciones de la biblioteca de Google Maps y React
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import api from '../../../api';

// NUEVO: Estilos para el contenedor del mapa
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

// NUEVO: Coordenadas iniciales para centrar el mapa (ej. centro de México)
const center = {
  lat: 23.6345,
  lng: -102.5528
};


const NuevoPaquete = () => {
  const [nombrePaquete, setNombrePaquete] = useState('');
  const [duracion, setDuracion] = useState('');
  const [idVuelo, setIdVuelo] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [origen, setOrigen] = useState('');
  const [origenLat, setOrigenLat] = useState('');
  const [origenLng, setOrigenLng] = useState('');
  const [destino, setDestino] = useState('');
  const [destinoLat, setDestinoLat] = useState('');
  const [destinoLng, setDestinoLng] = useState('');
  const [precioBase, setPrecioBase] = useState('');
  const [itinerario, setItinerario] = useState([{ dia: 1, descripcion: '' }]);
  const navigate = useNavigate();

  // NUEVO: Estado para saber qué estamos seleccionando: 'origen' o 'destino'
  const [selectionMode, setSelectionMode] = useState('origen');

  // NUEVO: Hook para cargar la API de Google Maps de forma segura
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY, // Usa tu variable de entorno
  });

  // NUEVO: Función para manejar el clic en el mapa
  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (selectionMode === 'origen') {
      setOrigenLat(lat);
      setOrigenLng(lng);
      console.log('Coordenadas de Origen seleccionadas:', { lat, lng });
    } else {
      setDestinoLat(lat);
      setDestinoLng(lng);
      console.log('Coordenadas de Destino seleccionadas:', { lat, lng });
    }
  }, [selectionMode]);


  const handleItinerarioChange = (index, event) => {
    const values = [...itinerario];
    if (event.target.name === 'dia') {
      values[index].dia = parseInt(event.target.value, 10);
    } else {
      values[index].descripcion = event.target.value;
    }
    setItinerario(values);
  };

  const handleAddItinerario = () => {
    setItinerario([...itinerario, { dia: itinerario.length + 1, descripcion: '' }]);
  };

  const handleRemoveItinerario = (index) => {
    const values = [...itinerario];
    values.splice(index, 1);
    setItinerario(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validar que se hayan seleccionado las coordenadas
    if (!origenLat || !origenLng || !destinoLat || !destinoLng) {
      alert('Por favor, selecciona el origen y el destino en el mapa.');
      return;
    }

    const paqueteData = {
      nombre_paquete: nombrePaquete,
      duracion: parseInt(duracion, 10),
      id_vuelo: idVuelo,
      requisitos,
      origen,
      origen_lat: parseFloat(origenLat),
      origen_lng: parseFloat(origenLng),
      destino,
      destino_lat: parseFloat(destinoLat),
      destino_lng: parseFloat(destinoLng),
      precio_base: parseFloat(precioBase),
      itinerario,
    };

    try {
      await api.packages.createPaquete(paqueteData);
      alert('Paquete creado con éxito');
      navigate('/admin/paquetes');
    } catch (error) {
      console.error('Error al crear el paquete:', error);
      alert('Error al crear el paquete');
    }
  };

  // NUEVO: Renderizado condicional mientras carga el mapa
  if (loadError) return "Error al cargar el mapa";
  if (!isLoaded) return "Cargando Mapa...";

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Paquete Turístico</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            value={nombrePaquete}
            onChange={(e) => setNombrePaquete(e.target.value)}
            placeholder="Nombre del Paquete"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            placeholder="Duración (días)"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={idVuelo}
            onChange={(e) => setIdVuelo(e.target.value)}
            placeholder="ID del Vuelo"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            placeholder="Nombre del Origen (ej. Ciudad de México)"
            className="p-2 border rounded"
            required
          />
          {/* MODIFICADO: Inputs de coordenadas ahora son de solo lectura */}
          <input
            type="number"
            step="any"
            value={origenLat}
            readOnly
            placeholder="Latitud Origen (selecciona en mapa)"
            className="p-2 border rounded bg-gray-100"
            required
          />
          <input
            type="number"
            step="any"
            value={origenLng}
            readOnly
            placeholder="Longitud Origen (selecciona en mapa)"
            className="p-2 border rounded bg-gray-100"
            required
          />
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Nombre del Destino (ej. Cancún)"
            className="p-2 border rounded"
            required
          />
          {/* MODIFICADO: Inputs de coordenadas ahora son de solo lectura */}
          <input
            type="number"
            step="any"
            value={destinoLat}
            readOnly
            placeholder="Latitud Destino (selecciona en mapa)"
            className="p-2 border rounded bg-gray-100"
            required
          />
          <input
            type="number"
            step="any"
            value={destinoLng}
            readOnly
            placeholder="Longitud Destino (selecciona en mapa)"
            className="p-2 border rounded bg-gray-100"
            required
          />
          <input
            type="number"
            step="any"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
            placeholder="Precio Base"
            className="p-2 border rounded"
            required
          />
        </div>

        {/* NUEVO: Controles y visualización del mapa */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Selección de Ubicación</h2>
          <div className="flex items-center gap-4 mb-4">
            <p>Seleccionando:</p>
            <button
              type="button"
              onClick={() => setSelectionMode('origen')}
              className={`p-2 rounded font-bold ${selectionMode === 'origen' ? 'bg-blue-600 text-white' : 'bg-blue-200'}`}
            >
              Origen
            </button>
            <button
              type="button"
              onClick={() => setSelectionMode('destino')}
              className={`p-2 rounded font-bold ${selectionMode === 'destino' ? 'bg-green-600 text-white' : 'bg-green-200'}`}
            >
              Destino
            </button>
          </div>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={5}
            onClick={onMapClick}
          >
            {/* Marcador para el origen */}
            {origenLat && origenLng && (
              <MarkerF position={{ lat: parseFloat(origenLat), lng: parseFloat(origenLng) }} label="O" />
            )}
            {/* Marcador para el destino */}
            {destinoLat && destinoLng && (
              <MarkerF position={{ lat: parseFloat(destinoLat), lng: parseFloat(destinoLng) }} label="D" />
            )}
          </GoogleMap>
        </div>


        <textarea
          value={requisitos}
          onChange={(e) => setRequisitos(e.target.value)}
          placeholder="Requisitos"
          className="w-full p-2 border rounded"
          required
        />

        <h2 className="text-xl font-semibold">Itinerario</h2>
        {itinerario.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="number"
              name="dia"
              value={item.dia}
              onChange={(e) => handleItinerarioChange(index, e)}
              className="p-2 border rounded w-20"
              required
            />
            <input
              type="text"
              name="descripcion"
              value={item.descripcion}
              onChange={(e) => handleItinerarioChange(index, e)}
              className="p-2 border rounded flex-grow"
              placeholder={`Descripción del día ${item.dia}`}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveItinerario(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItinerario}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Añadir Día
        </button>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded font-bold"
        >
          Crear Paquete
        </button>
      </form>
    </div>
  );
};

export default NuevoPaquete;