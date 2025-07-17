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

  useEffect(() => {
    const fetchVuelos = async () => {
      try {
        const response = await api.flights.getVuelos();
        setVuelos(response.data);
      } catch (err) {
        setError(
          "No se pudieron cargar los vuelos. Por favor, inténtalo de nuevo más tarde.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVuelos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este vuelo?")) {
      try {
        await api.flights.deleteVuelo(id);
        setVuelos(vuelos.filter((vuelo) => vuelo.id !== id));
      } catch (err) {
        alert("Error al eliminar el vuelo. Por favor, inténtalo de nuevo.");
        console.error(err);
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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Administración de Vuelos
            </h1>
            <p className="mt-2 text-gray-600">
              Gestiona todos los vuelos disponibles en la plataforma
            </p>
          </div>
          <Link
            to="/admin/vuelos/nuevo"
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          >
            <FiPlus className="mr-2" />
            Agregar Nuevo Vuelo
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar vuelos por nombre o transporte..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                {filteredVuelos.length}{" "}
                {filteredVuelos.length === 1
                  ? "vuelo encontrado"
                  : "vuelos encontrados"}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vuelo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVuelos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-400"
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
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                          No se encontraron vuelos
                        </h3>
                        <p className="mt-1 text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {vuelo.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                            {vuelo.transporte}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              to={`/admin/vuelos/editar/${vuelo.id}`}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                              title="Editar vuelo"
                            >
                              <FiEdit size={18} />
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(vuelo.id);
                              }}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                              title="Eliminar vuelo"
                            >
                              <FiTrash2 size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFlightDetails(vuelo.id);
                              }}
                              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              {expandedFlight === vuelo.id ? (
                                <FiChevronUp size={18} />
                              ) : (
                                <FiChevronDown size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedFlight === vuelo.id && (
                        <tr className="bg-blue-50">
                          <td colSpan="4" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Detalles del Vuelo
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex">
                                    <span className="text-gray-500 w-28">
                                      Origen:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      {vuelo.origen || "No especificado"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-28">
                                      Destino:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      {vuelo.destino || "No especificado"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-28">
                                      Fecha:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      {vuelo.fecha || "No especificado"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Precios
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex">
                                    <span className="text-gray-500 w-28">
                                      Económico:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      ${vuelo.precioEconomico || "0.00"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-28">
                                      Ejecutivo:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      ${vuelo.precioEjecutivo || "0.00"}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-gray-500 w-28">
                                      Primera:
                                    </span>
                                    <span className="text-gray-800 font-medium">
                                      ${vuelo.precioPrimera || "0.00"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                  Información Adicional
                                </h4>
                                <p className="text-gray-600 text-sm">
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
