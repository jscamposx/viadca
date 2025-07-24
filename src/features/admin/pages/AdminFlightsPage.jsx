import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiNavigation,
  FiChevronRight
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
  const [expandedFlight, setExpandedFlight] = useState(null);
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

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este vuelo?")) {
      try {
        await api.flights.deleteVuelo(id);
        setVuelos(vuelos.filter((vuelo) => vuelo.id !== id));
        addNotification("Vuelo movido a la papelera con éxito.", "success");
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

  const toggleFlightDetails = (id) => {
    setExpandedFlight(expandedFlight === id ? null : id);
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Cargando vuelos...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Por favor, espere un momento
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 border border-red-100">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error al cargar vuelos</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiNavigation className="text-blue-600 w-6 h-6" />
              Administración de Vuelos
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

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Buscar vuelos..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSort("nombre")}
                className={`flex items-center gap-2 w-full py-3 px-4 rounded-xl font-medium transition text-sm sm:text-base justify-center ${
                  sortConfig.key === "nombre"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ordenar por Nombre
                {sortConfig.key === "nombre" && sortConfig.direction === "ascending" ? 
                  <FiChevronUp /> : <FiChevronDown />
                }
              </button>
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
          <div className="grid grid-cols-1 gap-5">
            {filteredVuelos.map((vuelo) => (
              <div 
                key={vuelo.id} 
                className={`bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 ${
                  expandedFlight === vuelo.id 
                    ? "ring-2 ring-blue-500" 
                    : "hover:shadow-lg"
                }`}
              >
                <div 
                  className="p-5 sm:p-6 cursor-pointer"
                  onClick={() => toggleFlightDetails(vuelo.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-gray-200"
                        src={getImageUrl(vuelo)}
                        alt={vuelo.nombre}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x150/0ea5e9/ffffff?text=Sin+Imagen";
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                          {vuelo.nombre}
                        </h2>
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                          {vuelo.transporte}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-3">
                        <div className="flex items-center text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
                          <FiMapPin className="mr-1.5 text-gray-500" />
                          <span>{vuelo.origen || "Origen no especificado"}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <FiChevronRight className="w-4 h-4" />
                        </div>
                        <div className="flex items-center text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
                          <FiMapPin className="mr-1.5 text-gray-500" />
                          <span>{vuelo.destino || "Destino no especificado"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/vuelos/editar/${vuelo.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Editar vuelo"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(vuelo.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Eliminar vuelo"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlightDetails(vuelo.id);
                        }}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        title={expandedFlight === vuelo.id ? "Ocultar detalles" : "Ver detalles"}
                      >
                        {expandedFlight === vuelo.id ? (
                          <FiChevronUp className="w-5 h-5" />
                        ) : (
                          <FiChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {expandedFlight === vuelo.id && (
                  <div className="border-t border-gray-200 p-5 sm:p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <FiInfo className="text-blue-500" />
                          Información del vuelo
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <FiCalendar className="text-gray-500 mr-2" />
                            <span className="text-gray-800 font-medium">
                              Fecha: {vuelo.fecha || "No especificada"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FiMapPin className="text-gray-500 mr-2" />
                            <span className="text-gray-800 font-medium">
                              Origen: {vuelo.origen || "No especificado"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <FiMapPin className="text-gray-500 mr-2" />
                            <span className="text-gray-800 font-medium">
                              Destino: {vuelo.destino || "No especificado"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <FiDollarSign className="text-green-500" />
                          Precios
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Económico:</span>
                            <span className="text-gray-800 font-medium">
                              ${vuelo.precioEconomico || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Ejecutivo:</span>
                            <span className="text-gray-800 font-medium">
                              ${vuelo.precioEjecutivo || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Primera Clase:</span>
                            <span className="text-gray-800 font-medium">
                              ${vuelo.precioPrimera || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                          <FiInfo className="text-purple-500" />
                          Descripción
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {vuelo.descripcion || "No hay descripción disponible."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Link
                        to={`/admin/vuelos/editar/${vuelo.id}`}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiEdit className="w-4 h-4" />
                        Editar vuelo
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFlightsPage;