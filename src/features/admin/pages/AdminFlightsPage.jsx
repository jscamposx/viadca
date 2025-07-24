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
} from "react-icons/fi";
import { useNotification } from "./AdminLayout"; // 1. Importar el hook de notificación

const API_URL = import.meta.env.VITE_API_URL;

const AdminFlightsPage = () => {
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Se mantiene para el error de carga inicial
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "nombre",
    direction: "ascending",
  });
  const [expandedFlight, setExpandedFlight] = useState(null);
  const { addNotification } = useNotification(); // 2. Obtener la función de notificación

  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        const response = await api.flights.getVuelos();
        setVuelos(response.data);
      } catch (err) {
        setError(
          "No se pudieron cargar los vuelos. Por favor, inténtelo de nuevo más tarde.",
        );
        console.error("Error al cargar los vuelos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVuelos();
  }, []);

  // 3. Modificar handleDelete para usar notificaciones
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este vuelo?")) {
      try {
        await api.flights.deleteVuelo(id);
        setVuelos(vuelos.filter((vuelo) => vuelo.id !== id));
        addNotification("Vuelo movido a la papelera con éxito.", "success");
      } catch (err) {
        console.error("Error al eliminar el vuelo:", err);
        addNotification("Error al eliminar el vuelo. Por favor, inténtelo de nuevo.", "error");
      }
    }
  };

  const getImageUrl = (vuelo) => {
    if (vuelo.imagenes && vuelo.imagenes.length > 0) {
      const url = vuelo.imagenes[0].url;
      if (url.startsWith("http")) return url;
      return `${API_URL}${url}`;
    }
    return "https://via.placeholder.com/100x50/3b82f6/ffffff?text=Sin+Imagen";
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
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Cargando vuelos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Administración de Vuelos
            </h1>
            <p className="mt-1 text-gray-600 text-sm sm:text-base">
              Gestiona todos los vuelos disponibles
            </p>
          </div>
          <Link
            to="/admin/vuelos/nuevo"
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full md:w-auto"
          >
            <FiPlus className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Agregar Nuevo Vuelo</span>
            <span className="sm:hidden">Nuevo Vuelo</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md mb-6 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar vuelos..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-end sm:justify-start">
              {filteredVuelos.length}{" "}
              {filteredVuelos.length === 1
                ? "vuelo encontrado"
                : "vuelos encontrados"}
            </div>
          </div>
        </div>

        {/* Tabla de vuelos */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4"
                  >
                    Vuelo
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4"
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort("nombre")}
                    >
                      Nombre
                      {sortConfig.key === "nombre" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        ))}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4"
                  >
                    <button
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort("transporte")}
                    >
                      Transporte
                      {sortConfig.key === "transporte" &&
                        (sortConfig.direction === "ascending" ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        ))}
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVuelos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-3 py-10 text-center sm:px-6">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-14 h-14 sm:w-16 sm:h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <h3 className="mt-3 text-base sm:text-lg font-medium text-gray-900">
                          No se encontraron vuelos
                        </h3>
                        <p className="mt-1 text-gray-500 text-sm sm:text-base">
                          Intenta cambiar tus criterios de búsqueda
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVuelos.map((vuelo) => (
                    <React.Fragment key={vuelo.id}>
                      <tr
                        className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                        onClick={() => toggleFlightDetails(vuelo.id)}
                      >
                        <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                              <img
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover"
                                src={getImageUrl(vuelo)}
                                alt={vuelo.nombre}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/100x50/3b82f6/ffffff?text=Sin+Imagen";
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                            {vuelo.nombre}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                          <div className="text-xs sm:text-sm text-gray-700 bg-blue-100 px-2 py-1 rounded-full inline-block truncate max-w-[80px] sm:max-w-none">
                            {vuelo.transporte}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium sm:px-4">
                          <div className="flex justify-end space-x-2 sm:space-x-3">
                            <Link
                              to={`/admin/vuelos/editar/${vuelo.id}`}
                              className="text-blue-600 hover:text-blue-900 p-1 sm:p-2 rounded-full hover:bg-blue-100 transition-colors"
                              title="Editar vuelo"
                              aria-label="Editar vuelo"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiEdit size={16} className="sm:w-5" />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(vuelo.id);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 sm:p-2 rounded-full hover:bg-red-100 transition-colors"
                              title="Eliminar vuelo"
                              aria-label="Eliminar vuelo"
                            >
                              <FiTrash2 size={16} className="sm:w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFlightDetails(vuelo.id);
                              }}
                              className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
                              aria-label={expandedFlight === vuelo.id ? "Contraer detalles del vuelo" : "Expandir detalles del vuelo"}
                            >
                              {expandedFlight === vuelo.id ? (
                                <FiChevronUp size={16} className="sm:w-5" />
                              ) : (
                                <FiChevronDown size={16} className="sm:w-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedFlight === vuelo.id && (
                        <tr className="bg-blue-50">
                          <td colSpan="4" className="px-3 py-4 sm:px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                  Detalles del Vuelo
                                </h4>
                                <div className="space-y-1 text-xs sm:text-sm">
                                  <div className="flex">
                                    <span className="text-gray-500 w-20 sm:w-28">
                                      Origen:
                                    </span>
                                    <span className="text-gray-800 font-medium truncate">
                                      {vuelo.origen || "No especificado"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-20 sm:w-28">
                                      Destino:
                                    </span>
                                    <span className="text-gray-800 font-medium truncate">
                                      {vuelo.destino || "No especificado"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-20 sm:w-28">
                                      Fecha:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      {vuelo.fecha || "No especificado"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                  Precios
                                </h4>
                                <div className="space-y-1 text-xs sm:text-sm">
                                  <div className="flex">
                                    <span className="text-gray-500 w-20 sm:w-28">
                                      Económico:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      ${vuelo.precioEconomico || "0.00"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-20 sm:w-28">
                                      Ejecutivo:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      ${vuelo.precioEjecutivo || "0.00"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-20 sm:w-28">
                                      Primera:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      ${vuelo.precioPrimera || "0.00"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                                  Información Adicional
                                </h4>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  {vuelo.descripcion ||
                                    "No hay descripción disponible."}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFlightsPage;