import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import { FiDownload, FiArrowUp, FiArrowDown, FiSearch } from "react-icons/fi";
import api from "../../../api";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPaquetes = () => {
  const { paquetes, setPaquetes, loading, error } = useAllPackages();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPaquetes, setFilteredPaquetes] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "nombre",
    direction: "asc",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const handleExport = async (paqueteId) => {
    try {
      const response = await api.packages.exportToExcel(paqueteId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `paquete-${paqueteId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      alert("No ha sido posible exportar el archivo de Excel.");
    }
  };

  useEffect(() => {
    if (paquetes) {
      let result = [...paquetes];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (p) =>
            p.nombre_paquete.toLowerCase().includes(term) ||
            p.descripcion?.toLowerCase().includes(term) ||
            p.precio_base.toString().includes(term),
        );
      }

      if (sortConfig.key) {
        result.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      setFilteredPaquetes(result);
    }
  }, [paquetes, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setIsSortMenuOpen(false);
  };

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600x400?text=Sin+Imagen";
    if (url.startsWith("http") || url.startsWith("data:")) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  const handleDelete = async (id) => {
    try {
      await api.packages.deletePaquete(id);

      setPaquetes((prevPaquetes) => prevPaquetes.filter((p) => p.id !== id));
      alert("Paquete eliminado con éxito.");
    } catch (err) {
      console.error("Error al eliminar el paquete:", err);
      alert("No se pudo eliminar el paquete. Inténtalo de nuevo.");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Cargando paquetes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 p-6 rounded-xl max-w-md text-center">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error al cargar los paquetes
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="mb-3 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Gestión de Paquetes
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {paquetes?.length || 0}{" "}
              {paquetes?.length === 1 ? "paquete" : "paquetes"}
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar paquetes..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Link
                to="/admin/paquetes/nuevo"
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="hidden sm:inline">Nuevo Paquete</span>
                <span className="sm:hidden">Nuevo</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 mb-5 sm:mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-gray-700 font-medium text-sm sm:text-base">
              Ordenar por:
            </div>

            <div className="sm:hidden relative w-full">
              <button
                className={`w-full px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-between gap-1.5 ${
                  isSortMenuOpen
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              >
                <span>
                  {sortConfig.key === "nombre" && "Nombre"}
                  {sortConfig.key === "precio_base" && "Precio"}
                  {sortConfig.key === "duracion" && "Duración"}
                </span>
                {isSortMenuOpen ? <FiArrowUp /> : <FiArrowDown />}
              </button>

              {isSortMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                  <button
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-1.5 ${
                      sortConfig.key === "nombre"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => requestSort("nombre")}
                  >
                    Nombre
                    {sortConfig.key === "nombre" &&
                      sortConfig.direction === "asc" && (
                        <FiArrowUp className="ml-auto" />
                      )}
                    {sortConfig.key === "nombre" &&
                      sortConfig.direction === "desc" && (
                        <FiArrowDown className="ml-auto" />
                      )}
                  </button>
                  <button
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-1.5 ${
                      sortConfig.key === "precio_base"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => requestSort("precio_base")}
                  >
                    Precio
                    {sortConfig.key === "precio_base" &&
                      sortConfig.direction === "asc" && (
                        <FiArrowUp className="ml-auto" />
                      )}
                    {sortConfig.key === "precio_base" &&
                      sortConfig.direction === "desc" && (
                        <FiArrowDown className="ml-auto" />
                      )}
                  </button>
                  <button
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-1.5 ${
                      sortConfig.key === "duracion"
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => requestSort("duracion")}
                  >
                    Duración
                    {sortConfig.key === "duracion" &&
                      sortConfig.direction === "asc" && (
                        <FiArrowUp className="ml-auto" />
                      )}
                    {sortConfig.key === "duracion" &&
                      sortConfig.direction === "desc" && (
                        <FiArrowDown className="ml-auto" />
                      )}
                  </button>
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 text-sm ${
                  sortConfig.key === "nombre"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => requestSort("nombre")}
              >
                Nombre{" "}
                {sortConfig.key === "nombre" &&
                  (sortConfig.direction === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  ))}
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 text-sm ${
                  sortConfig.key === "precio_base"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => requestSort("precio_base")}
              >
                Precio{" "}
                {sortConfig.key === "precio_base" &&
                  (sortConfig.direction === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  ))}
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 text-sm ${
                  sortConfig.key === "duracion"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => requestSort("duracion")}
              >
                Duración{" "}
                {sortConfig.key === "duracion" &&
                  (sortConfig.direction === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  ))}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredPaquetes.length > 0 ? (
            filteredPaquetes.map((paquete) => {
              const imagenPrincipal =
                paquete.imagenes?.length > 0 ? paquete.imagenes[0] : null;

              return (
                <div
                  key={paquete.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="h-48 sm:h-56 relative overflow-hidden">
                    {imagenPrincipal ? (
                      <img
                        src={getImageUrl(imagenPrincipal.url)}
                        alt={paquete.nombre_paquete}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center text-gray-500 p-4">
                        <svg
                          className="w-10 h-10 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-center">
                          Sin imagen disponible
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">
                      {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="pr-2">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2">
                          {paquete.nombre_paquete}
                        </h2>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <svg
                            className="w-3.5 h-3.5 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{paquete.duracion} días</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                        Activo
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/paquetes/${paquete.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1.5 px-3 rounded-lg transition text-xs sm:text-sm"
                        title="Vista previa"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="hidden sm:inline">Vista previa</span>
                        <span className="sm:hidden">Ver</span>
                      </Link>

                      <Link
                        to={`/admin/paquetes/editar/${paquete.url}`}
                        className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1.5 px-3 rounded-lg transition text-xs sm:text-sm"
                        title="Editar"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span className="hidden sm:inline">Editar</span>
                        <span className="sm:hidden">Edit</span>
                      </Link>

                      <button
                        onClick={() => setDeleteConfirm(paquete.id)}
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-3 rounded-lg transition text-xs sm:text-sm"
                        title="Eliminar"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="hidden sm:inline">Eliminar</span>
                        <span className="sm:hidden">Del</span>
                      </button>
                      <button
                        onClick={() => handleExport(paquete.id)}
                        className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-1.5 px-3 rounded-lg transition text-xs sm:text-sm"
                        title="Exportar a Excel"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Excel</span>
                        <span className="sm:hidden">XLS</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-6 sm:p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 mb-4 sm:mb-6">
                  <svg
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                  No se encontraron paquetes
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {searchTerm
                    ? `No hay resultados para "${searchTerm}".`
                    : "Parece que no hay paquetes disponibles."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-4 sm:p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                ¿Eliminar paquete?
              </h3>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Esta acción eliminará permanentemente el paquete. ¿Estás seguro
                de continuar?
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className="px-4 py-2 sm:px-5 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm sm:text-base"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 sm:px-5 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition text-sm sm:text-base"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaquetes;
