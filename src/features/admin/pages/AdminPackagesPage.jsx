import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
import { FiDownload, FiArrowUp, FiArrowDown, FiSearch, FiPlus, FiEye, FiEdit2, FiTrash2, FiClock, FiMapPin, FiFilter, FiX } from "react-icons/fi";
import api from "../../../api";
import { useNotification } from "./AdminLayout";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPaquetes = () => {
  const { paquetes, setPaquetes, loading, error } = useAllPackages();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPaquetes, setFilteredPaquetes] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "nombre_paquete",
    direction: "asc",
  });
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [durationFilter, setDurationFilter] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const { addNotification } = useNotification();

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
      addNotification("La exportación a Excel ha comenzado.", "success");
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      addNotification("No ha sido posible exportar el archivo.", "error");
    }
  };

  useEffect(() => {
    if (paquetes) {
      let result = [...paquetes];

      // Aplicar filtro de búsqueda
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (p) =>
            p.nombre_paquete.toLowerCase().includes(term) ||
            (p.destino?.toLowerCase().includes(term) || "") ||
            p.precio_base.toString().includes(term),
        );
      }

      // Aplicar filtro de precio
      if (priceFilter.min || priceFilter.max) {
        const minPrice = priceFilter.min ? parseFloat(priceFilter.min) : 0;
        const maxPrice = priceFilter.max ? parseFloat(priceFilter.max) : Number.MAX_VALUE;
        
        result = result.filter(p => {
          const precio = parseFloat(p.precio_base);
          return precio >= minPrice && precio <= maxPrice;
        });
      }

      // Aplicar filtro de duración
      if (durationFilter) {
        result = result.filter(p => p.duracion === parseInt(durationFilter));
      }

      // Aplicar ordenamiento
      if (sortConfig.key) {
        result.sort((a, b) => {
          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];
          
          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredPaquetes(result);
    }
  }, [paquetes, searchTerm, sortConfig, priceFilter, durationFilter]);

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
      addNotification("Paquete movido a la papelera.", "success");
    } catch (err) {
      console.error("Error al eliminar el paquete:", err);
      addNotification(
        "No se pudo eliminar el paquete. Inténtalo de nuevo.",
        "error",
      );
    }
  };

  const clearFilters = () => {
    setPriceFilter({ min: "", max: "" });
    setDurationFilter("");
    setSearchTerm("");
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 p-6 rounded-2xl max-w-md text-center shadow-md">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error al cargar los paquetes
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition transform hover:-translate-y-0.5"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header mejorado */}
        <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Gestión de Paquetes
              </h1>
              <p className="text-gray-600 mt-2">
                Administra todos tus paquetes turísticos en un solo lugar
              </p>
            </div>

            <Link
              to="/admin/paquetes/nuevo"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nuevo Paquete</span>
            </Link>
          </div>
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
                placeholder="Buscar paquetes..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition text-sm sm:text-base w-full justify-center"
              >
                <FiFilter className="w-4 h-4" />
                Filtros
              </button>

              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className={`flex items-center gap-2 py-3 px-4 rounded-xl font-medium transition text-sm sm:text-base w-full justify-center ${
                  isSortMenuOpen
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />}
                Ordenar
              </button>
            </div>

            <div className="flex gap-3">
              <div className="bg-blue-50 text-blue-700 py-3 px-4 rounded-xl font-medium text-sm flex items-center gap-2 w-full justify-center">
                <span className="font-bold">{filteredPaquetes.length}</span>
                {filteredPaquetes.length === 1 ? "paquete" : "paquetes"}
              </div>
              
              {(searchTerm || priceFilter.min || priceFilter.max || durationFilter) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-xl transition text-sm sm:text-base w-full justify-center"
                >
                  <FiX className="w-4 h-4" />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Menú de ordenamiento */}
          {isSortMenuOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  sortConfig.key === "nombre_paquete"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => requestSort("nombre_paquete")}
              >
                Nombre{" "}
                {sortConfig.key === "nombre_paquete" && sortConfig.direction === "asc" && <FiArrowUp />}
                {sortConfig.key === "nombre_paquete" && sortConfig.direction === "desc" && <FiArrowDown />}
              </button>
              <button
                className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  sortConfig.key === "precio_base"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => requestSort("precio_base")}
              >
                Precio{" "}
                {sortConfig.key === "precio_base" && sortConfig.direction === "asc" && <FiArrowUp />}
                {sortConfig.key === "precio_base" && sortConfig.direction === "desc" && <FiArrowDown />}
              </button>
              <button
                className={`px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  sortConfig.key === "duracion"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => requestSort("duracion")}
              >
                Duración{" "}
                {sortConfig.key === "duracion" && sortConfig.direction === "asc" && <FiArrowUp />}
                {sortConfig.key === "duracion" && sortConfig.direction === "desc" && <FiArrowDown />}
              </button>
            </div>
          )}

          {/* Panel de filtros */}
          {isFiltersOpen && (
            <div className="mt-4 p-5 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Filtros avanzados</h3>
                <button 
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de precios
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Mínimo"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        value={priceFilter.min}
                        onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Máximo"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        value={priceFilter.max}
                        onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (días)
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 5"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lista de paquetes */}
        {filteredPaquetes.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPaquetes.map((paquete) => {
              const imagenPrincipal =
                paquete.imagenes?.length > 0 ? paquete.imagenes[0] : null;

              return (
                <div
                  key={paquete.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-52 sm:h-60 relative overflow-hidden">
                    {imagenPrincipal ? (
                      <img
                        src={getImageUrl(imagenPrincipal.url)}
                        alt={paquete.nombre_paquete}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-500 p-4">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-3">
                          <FiMapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <span className="text-sm text-center">
                          Sin imagen disponible
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      {parseFloat(paquete.precio_base).toLocaleString("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        minimumFractionDigits: 0,
                      })}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2 mb-2">
                        {paquete.nombre_paquete}
                      </h2>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FiClock className="mr-1.5" />
                          <span>{paquete.duracion} días</span>
                        </div>
                        <div className="flex items-center">
                          <FiMapPin className="mr-1.5" />
                          <span className="truncate">{paquete.destino || "Sin destino"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/paquetes/${paquete.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition text-xs sm:text-sm flex-1 min-w-[100px] justify-center"
                        title="Vista previa"
                      >
                        <FiEye className="w-3.5 h-3.5" />
                        <span>Vista previa</span>
                      </Link>

                      <Link
                        to={`/admin/paquetes/editar/${paquete.url}`}
                        className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded-lg transition text-xs sm:text-sm flex-1 min-w-[100px] justify-center"
                        title="Editar"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </Link>

                      <button
                        onClick={() => handleExport(paquete.id)}
                        className="flex items-center gap-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-3 rounded-lg transition text-xs sm:text-sm flex-1 min-w-[100px] justify-center"
                        title="Exportar a Excel"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                        <span>Excel</span>
                      </button>

                      <button
                        onClick={() => handleDelete(paquete.id)}
                        className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-3 rounded-lg transition text-xs sm:text-sm flex-1 min-w-[100px] justify-center"
                        title="Eliminar"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 md:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-500 mb-5">
                <FiSearch className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                No se encontraron paquetes
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}". Intenta con otros términos.`
                  : "Parece que no hay paquetes disponibles. Crea uno nuevo para comenzar."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
                >
                  Limpiar filtros
                </button>
                <Link
                  to="/admin/paquetes/nuevo"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-md transition"
                >
                  Crear nuevo paquete
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaquetes;