import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiInfo,
  FiPhone,
  FiGlobe,
  FiNavigation
} from "react-icons/fi";
import { useNotification } from "./AdminLayout";

const API_URL = import.meta.env.VITE_API_URL;

const AdminFlightsPage = () => {
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "nombre",
    direction: "ascending",
  });
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        setLoading(true);
        const response = await api.flights.getVuelos();
        setVuelos(response.data);
      } catch (err) {
        setError(
          "No se pudieron cargar los vuelos. Por favor, inténtelo de nuevo más tarde.",
        );
        console.error("Error al cargar los vuelos:", err);
        addNotification("Error al cargar los vuelos", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchVuelos();
  }, []);

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el vuelo "${nombre}"?`)) {
      try {
        await api.flights.deleteVuelo(id);
        setVuelos(vuelos.filter((vuelo) => vuelo.id !== id));
        addNotification(`Vuelo "${nombre}" movido a la papelera con éxito.`, "success");
      } catch (err) {
        console.error("Error al eliminar el vuelo:", err);
        addNotification(
          "Error al eliminar el vuelo. Por favor, inténtelo de nuevo.",
          "error",
        );
      }
    }
  };

  const getImageUrl = (vuelo) => {
    if (vuelo.imagenes && vuelo.imagenes.length > 0) {
      const url = vuelo.imagenes[0].url;
      if (url.startsWith("http")) return url;
      return `${API_URL}${url}`;
    }
    return "https://via.placeholder.com/300x150/0ea5e9/ffffff?text=Sin+Imagen";
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedVuelos = [...vuelos].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredVuelos = sortedVuelos.filter(
    (vuelo) =>
      vuelo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuelo.transporte.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <FiNavigation className="text-blue-500 w-12 h-12" />
            <div className="absolute -inset-2 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 text-xl font-medium mt-6">
            Cargando vuelos...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Preparando la información de vuelos
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full mb-5">
                <FiInfo className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Error al cargar vuelos
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-3">
                <button
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
                  onClick={() => window.history.back()}
                >
                  Regresar
                </button>
                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
                  onClick={() => window.location.reload()}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-xl">
                <FiNavigation className="text-white w-6 h-6" />
              </div>
              <span>Administración de Vuelos</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Gestiona todos los vuelos disponibles en el sistema
            </p>
          </div>
          <Link
            to="/admin/vuelos/nuevo"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base w-full md:w-auto"
          >
            <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Agregar Nuevo Vuelo</span>
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Buscar vuelos por nombre o transporte..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 text-blue-700 py-3 px-4 rounded-xl font-medium text-sm flex items-center gap-2 justify-center">
              <span className="font-bold">{filteredVuelos.length}</span>
              {filteredVuelos.length === 1 ? "vuelo encontrado" : "vuelos encontrados"}
            </div>
          </div>
        </div>

        {/* Lista de vuelos */}
        {filteredVuelos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-5">
                <FiSearch className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                No se encontraron vuelos
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}". Intenta con otros términos.`
                  : "Parece que no hay vuelos registrados todavía."}
              </p>
              <Link
                to="/admin/vuelos/nuevo"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition"
              >
                <FiPlus className="w-4 h-4" />
                Crear nuevo vuelo
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVuelos.map((vuelo) => (
              <div 
                key={vuelo.id} 
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    src={getImageUrl(vuelo)}
                    alt={vuelo.nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x150/0ea5e9/ffffff?text=Sin+Imagen";
                    }}
                  />
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                        {vuelo.nombre}
                      </h2>
                      <div className="mt-1 flex items-center text-blue-600 font-medium">
                        <FiNavigation className="mr-1.5" />
                        <span>{vuelo.transporte}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/vuelos/editar/${vuelo.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Editar vuelo"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vuelo.id, vuelo.nombre)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Eliminar vuelo"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
               
                </div>
              </div>
            ))}
          </div>
        )}
        
      
      </div>
    </div>
  );
};

export default AdminFlightsPage;