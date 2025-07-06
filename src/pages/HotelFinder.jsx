import React, { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { getHotelesByLocation } from "../api/hotelService";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHotelId, setSelectedHotelId] = useState("");

  const handleMapClick = async (latlng) => {
    setSelectedPosition(latlng);
    setLoading(true);
    setError("");
    setHoteles([]);
    setSearchTerm("");
    setSelectedHotelId("");

    try {
      const response = await getHotelesByLocation(latlng);
      const validHoteles = (response.elements || []).filter(
        (h) => h.tags && h.tags.name,
      );
      setHoteles(validHoteles);
    } catch (err) {
      setError(
        "No se pudieron cargar los hoteles. Inténtalo de nuevo más tarde.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = useMemo(() => {
    if (!searchTerm) {
      return hoteles;
    }
    return hoteles.filter((hotel) =>
      hotel.tags.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [hoteles, searchTerm]);

  const selectedHotel = useMemo(() => {
    if (!selectedHotelId) return null;
    return hoteles.find((h) => h.id === Number(selectedHotelId));
  }, [selectedHotelId, hoteles]);

  const createGoogleSearchLink = (hotelName) => {
    const query = encodeURIComponent(`${hotelName} Durango`);
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Busca Hoteles en el Mapa</h1>
      <p className="mb-4">
        Datos de{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          OpenStreetMap
        </a>
        . Haz clic para encontrar hoteles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MapContainer
            center={[24.0277, -104.6533]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents onMapClick={handleMapClick} />

            {selectedPosition && (
              <Marker position={selectedPosition}>
                <Popup>Buscando hoteles cerca de aquí</Popup>
              </Marker>
            )}

            {selectedHotel && (
              <Marker position={[selectedHotel.lat, selectedHotel.lon]}>
                <Popup>
                  <b>{selectedHotel.tags.name}</b>
                  <br />
                  {selectedHotel.tags["addr:street"]}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">Hoteles Encontrados</h2>
          {loading && <p>Buscando hoteles...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && hoteles.length === 0 && (
            <p>
              No se han encontrado hoteles. Selecciona otro punto en el mapa.
            </p>
          )}

          {hoteles.length > 0 && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="search-hotel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Buscar por nombre:
                </label>
                <input
                  type="text"
                  id="search-hotel"
                  placeholder="Escribe un nombre..."
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="select-hotel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Selecciona un hotel ({filteredHotels.length} resultados):
                </label>
                <select
                  id="select-hotel"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                >
                  <option value="">-- Elige un hotel --</option>
                  {filteredHotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.tags.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* --- DETALLES DEL HOTEL SELECCIONADO (SIN ICONOS) --- */}
              {selectedHotel && (
                <div
                  key={selectedHotel.id}
                  className="p-4 border rounded-lg shadow-sm flex flex-col mt-4"
                >
                  <h3 className="text-xl font-bold mb-2">
                    {selectedHotel.tags.name}
                  </h3>

                  {(() => {
                    const address =
                      `${selectedHotel.tags["addr:street"] || ""} ${selectedHotel.tags["addr:housenumber"] || ""}`.trim();
                    return (
                      address && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Dirección:</strong> {address}
                        </p>
                      )
                    );
                  })()}

                  {selectedHotel.tags.phone && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Teléfono:</strong> {selectedHotel.tags.phone}
                    </p>
                  )}

                  {selectedHotel.tags.website && (
                    <p className="text-sm text-gray-600 mb-3 truncate">
                      <strong>Sitio web:</strong>
                      <a
                        href={selectedHotel.tags.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-600 hover:underline"
                      >
                        {selectedHotel.tags.website}
                      </a>
                    </p>
                  )}
                  <div className="mt-auto pt-2">
                    <a
                      href={createGoogleSearchLink(selectedHotel.tags.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-blue-600 font-semibold hover:underline"
                    >
                      Ver precios y reseñas →
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelFinder;
