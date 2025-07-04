import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { getHotelesByLocation } from '../api/hotelService';
import 'leaflet/dist/leaflet.css';

// El componente para manejar los eventos del mapa no cambia
function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function HotelFinder() {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMapClick = async (latlng) => {
    setSelectedPosition(latlng);
    setLoading(true);
    setError('');
    setHoteles([]);

    try {
      const response = await getHotelesByLocation(latlng);
      setHoteles(response.elements || []);
    } catch (err) {
      setError('No se pudieron cargar los hoteles. Inténtalo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear el enlace de búsqueda en Google
  const createGoogleSearchLink = (hotelName) => {
    const query = encodeURIComponent(`${hotelName} Durango`);
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Busca Hoteles en el Mapa</h1>
      <p className="mb-4">Datos de <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenStreetMap</a>. Haz clic para encontrar hoteles.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* El mapa no cambia */}
          <MapContainer center={[24.0277, -104.6533]} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents onMapClick={handleMapClick} />
            {selectedPosition && (
              <Marker position={selectedPosition}>
                <Popup>Ubicación seleccionada</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Hoteles Disponibles</h2>
          {loading && <p>Buscando hoteles...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && hoteles.length > 0 && (
            <p className="text-sm mb-2">Mostrando {hoteles.length} resultados.</p>
          )}
          {!loading && !error && hoteles.length === 0 && (
            <p>No se han encontrado hoteles. Selecciona otro punto en el mapa.</p>
          )}
          
          <div className="space-y-4">
            {hoteles.map((hotel) => {
              const tags = hotel.tags || {};
              const hotelName = tags.name || 'Nombre no disponible';
              
              // No mostramos resultados sin nombre
              if (hotelName === 'Nombre no disponible') return null;

              // Construimos la dirección completa
              const address = `${tags['addr:street'] || ''} ${tags['addr:housenumber'] || ''}`.trim();

              return (
                <div key={hotel.id} className="p-4 border rounded-lg shadow-sm flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{hotelName}</h3>
                  
                  {/* Dirección */}
                  {address && (
                    <p className="text-sm text-gray-600 mb-1">📍 {address}</p>
                  )}

                  {/* Teléfono */}
                  {tags.phone && (
                    <p className="text-sm text-gray-600 mb-1">📞 {tags.phone}</p>
                  )}
                  
                  {/* Sitio Web */}
                  {tags.website && (
                    <a 
                      href={tags.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mb-3 truncate"
                    >
                      🌐 {tags.website}
                    </a>
                  )}
                  
                  {/* Enlace a Google para detalles comerciales */}
                  <div className="mt-auto pt-2">
                    <a 
                      href={createGoogleSearchLink(hotelName)} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 font-semibold hover:underline"
                    >
                      Ver precios y reseñas →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelFinder;