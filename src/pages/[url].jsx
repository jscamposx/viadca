import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function PaqueteDetalle() {
  const [paquete, setPaquete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url } = useParams();

  useEffect(() => {
    const fetchPaquete = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/paquetes/${url}`);
        if (!response.ok) {
          throw new Error('El paquete que buscas no existe o no se pudo encontrar.');
        }
        const data = await response.json();
        setPaquete(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchPaquete();
    }
  }, [url]);

  if (loading) return <div className="text-center p-10">🔍 Cargando datos del paquete...</div>;
  if (error) return <div className="text-center p-10 text-red-500">❌ Error: {error}</div>;
  if (!paquete) return <div className="text-center p-10">No se encontró información del paquete.</div>;


  const originPosition = [parseFloat(paquete.origen_lat), parseFloat(paquete.origen_lng)];
  const destinationPosition = [parseFloat(paquete.destino_lat), parseFloat(paquete.destino_lng)];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden my-10">
      <div className="relative">
        {paquete.imagenes && paquete.imagenes.length > 0 ? (
          <Carousel 
            showArrows={true} 
            showThumbs={false} 
            infiniteLoop={true} 
            useKeyboardArrows={true} 
            autoPlay={true}
            interval={5000}
          >
            {paquete.imagenes.map((imagen) => (
              <div key={imagen.id}>
                <img 
                  className="w-full h-96 object-cover" 
                  src={`http://localhost:3000${imagen.url}`} 
                  alt={imagen.nombre} 
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500">Imagen no disponible</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white p-5 w-full">
          <h1 className="text-4xl font-bold">{paquete.nombre_paquete}</h1>
          <p className="text-lg mt-1">{paquete.origen} → {paquete.destino}</p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
          <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
            <p className="text-sm text-blue-800 font-semibold">Duración</p>
            <p className="text-2xl font-bold">{paquete.duracion} días</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow-sm">
            <p className="text-sm text-green-800 font-semibold">Vuelo</p>
            <p className="text-2xl font-bold">{paquete.id_vuelo}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
            <p className="text-sm text-yellow-800 font-semibold">Precio Base</p>
            <p className="text-2xl font-bold text-yellow-900">${parseFloat(paquete.precio_base).toFixed(2)}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Itinerario del Viaje</h2>
          <ul className="space-y-4">
            {paquete.itinerario.map((item) => (
              <li key={item.id} className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center font-bold mr-4">
                  {item.dia}
                </div>
                <div className="flex-1">
                  <p className="font-bold">Día {item.dia}</p>
                  <p className="text-gray-600">{item.descripcion}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Mapa de la Ruta</h2>
          <MapContainer center={originPosition} zoom={4} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={originPosition}>
              <Popup>
                <strong>Origen:</strong> {paquete.origen}
              </Popup>
            </Marker>
            <Marker position={destinationPosition}>
              <Popup>
                <strong>Destino:</strong> {paquete.destino}
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div>
          <h2 className="text-3xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">Requisitos para el Viaje</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">{paquete.requisitos}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaqueteDetalle;