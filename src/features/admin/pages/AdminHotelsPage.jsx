import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiStar } from "react-icons/fi";

const AdminHotelsPage = () => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        // Simulación de API con datos de prueba
        const mockHotels = [
          {
            id: 1,
            nombre: "Grand Paradise Resort",
            estrellas: 5,
            imagenes: [],
            ubicacion: "Cancún, México",
            habitaciones: 120
          },
          {
            id: 2,
            nombre: "Mountain View Lodge",
            estrellas: 4,
            imagenes: [],
            ubicacion: "Andes, Chile",
            habitaciones: 80
          },
          {
            id: 3,
            nombre: "Urban City Suites",
            estrellas: 3,
            imagenes: [],
            ubicacion: "Buenos Aires, Argentina",
            habitaciones: 65
          }
        ];
        
        setHoteles(mockHotels);
        console.log("Datos de prueba cargados");
      } catch (err) {
        setError("No se pudieron cargar los hoteles.");
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este hotel?")) {
      try {
        setHoteles(hoteles.filter((hotel) => hotel.id !== id));
        console.log(`Hotel con id ${id} eliminado`);
      } catch (err) {
        alert("Error al eliminar el hotel.");
      }
    }
  };

  const filteredHoteles = hoteles.filter((hotel) =>
    hotel.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StarRating = ({ rating }) => (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          className={i < rating ? "fill-current" : "text-gray-300"}
          size={18}
        />
      ))}
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-8 bg-red-50 text-red-600 rounded-xl max-w-md mx-auto mt-12 text-center">
      <p className="font-medium">{error}</p>
      <button 
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        onClick={() => window.location.reload()}
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administración de Hoteles</h1>
            <p className="text-gray-600 mt-2">
              {filteredHoteles.length} {filteredHoteles.length === 1 ? "hotel registrado" : "hoteles registrados"}
            </p>
          </div>
          <Link 
            to="/admin/hoteles/nuevo" 
            className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 hover:shadow-lg"
          >
            <FiPlus className="mr-2" />
            Nuevo Hotel
          </Link>
        </div>
        
        {/* Barra de búsqueda mejorada */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, ubicación..."
              className="pl-10 p-3 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de hoteles */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Habitaciones</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHoteles.length > 0 ? filteredHoteles.map((hotel) => (
                <tr 
                  key={hotel.id} 
                  className="transition-all hover:bg-blue-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{hotel.nombre}</div>
                        <div className="text-sm text-gray-500">ID: {hotel.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StarRating rating={hotel.estrellas} />
                    <div className="text-sm text-gray-500 mt-1">{hotel.estrellas} estrellas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {hotel.ubicacion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {hotel.habitaciones} hab.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link 
                        to={`/admin/hoteles/editar/${hotel.id}`} 
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                      >
                        <FiEdit />
                      </Link>
                      <button 
                        onClick={() => handleDelete(hotel.id)}
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <FiSearch className="text-gray-400 text-4xl mb-3" />
                      <h3 className="text-lg font-medium text-gray-900">No se encontraron hoteles</h3>
                      <p className="text-gray-500 mt-1">
                        Intenta con otro término de búsqueda o agrega un nuevo hotel
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHotelsPage;