import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePaginatedPackages } from "../../package/hooks/usePaginatedPackages";
import { useMayoristas } from "../hooks/useMayoristas";
import {
  FiDownload,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiMapPin,
  FiFilter,
  FiX,
  FiUsers,
  FiTag,
  FiCalendar,
} from "react-icons/fi";
import api from "../../../api";
import { useNotification } from "./AdminLayout";
import Pagination from "../../../components/ui/Pagination";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPaquetes = () => {
  const { 
    paquetes, 
    setPaquetes, 
    loading, 
    error, 
    page, 
    limit, 
    totalPages, 
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage
  } = usePaginatedPackages();
  const { mayoristas, loading: mayoristasLoading } = useMayoristas();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPaquetes, setFilteredPaquetes] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "titulo",
    direction: "asc",
  });
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [durationFilter, setDurationFilter] = useState("");
  const [mayoristaFilter, setMayoristaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tipoProductoFilter, setTipoProductoFilter] = useState("");
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
    if (paquetes && Array.isArray(paquetes)) {
      let result = [...paquetes];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(
          (p) =>
            p.titulo?.toLowerCase().includes(term) ||
            p.precio_total?.toString().includes(term) ||
            (p.destinos &&
              p.destinos.some((d) => d.destino?.toLowerCase().includes(term))),
        );
      }

      if (priceFilter.min || priceFilter.max) {
        const minPrice = priceFilter.min ? parseFloat(priceFilter.min) : 0;
        const maxPrice = priceFilter.max
          ? parseFloat(priceFilter.max)
          : Number.MAX_VALUE;

        result = result.filter((p) => {
          const precio = parseFloat(p.precio_total);
          return !isNaN(precio) && precio >= minPrice && precio <= maxPrice;
        });
      }

      if (mayoristaFilter) {
        result = result.filter((p) => {
          return (
            p.mayoristas && p.mayoristas.some((m) => m.id === mayoristaFilter)
          );
        });
      }

      if (tipoProductoFilter) {
        result = result.filter((p) => {
          return (
            p.mayoristas &&
            p.mayoristas.some((m) => m.tipo_producto === tipoProductoFilter)
          );
        });
      }

      if (statusFilter) {
        if (statusFilter === "activo") {
          result = result.filter((p) => p.activo === true);
        } else if (statusFilter === "inactivo") {
          result = result.filter((p) => p.activo === false);
        }
      }

      if (sortConfig.key) {
        result.sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];

          if (sortConfig.key === "precio_total") {
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;
          }

          if (sortConfig.key === "activo") {
            aValue = aValue ? 1 : 0;
            bValue = bValue ? 1 : 0;
          }

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
    } else {
      setFilteredPaquetes([]);
    }
  }, [
    paquetes,
    searchTerm,
    sortConfig,
    priceFilter,
    mayoristaFilter,
    statusFilter,
    tipoProductoFilter,
  ]);

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
      setPaquetes((prevPaquetes) => 
        Array.isArray(prevPaquetes) ? prevPaquetes.filter((p) => p.id !== id) : []
      );
      addNotification("Paquete eliminado exitosamente.", "success");
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
    setMayoristaFilter("");
    setStatusFilter("");
    setTipoProductoFilter("");
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

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 lg:p-6 mb-6">
          <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, precio o destino..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Controles y estadísticas */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Botones de control */}
              <div className="flex gap-2 flex-1">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition text-sm flex-1 min-h-[48px] ${
                    isFiltersOpen
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Filtros avanzados</span>
                </button>

                <button
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition text-sm flex-1 min-h-[48px] ${
                    isSortMenuOpen
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sortConfig.direction === "asc" ? (
                    <FiArrowUp className="w-4 h-4" />
                  ) : (
                    <FiArrowDown className="w-4 h-4" />
                  )}
                  <span>Ordenar</span>
                </button>
              </div>

              {/* Estadísticas - Diseño mejorado */}
              <div className="flex flex-wrap gap-3 sm:justify-end">
                <div className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 min-h-[42px] shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="font-bold">{filteredPaquetes.length}</span>
                  <span>paquetes</span>
                </div>

                {paquetes && Array.isArray(paquetes) && (
                  <>
                    <div className="group bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 min-h-[42px] shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="font-bold">
                        {paquetes.filter((p) => p.activo).length}
                      </span>
                      <span className="hidden sm:inline">activos</span>
                      <span className="sm:hidden">✓</span>
                    </div>

                    <div className="group bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 min-h-[42px] shadow-md hover:shadow-lg transition-all duration-200">
                      <FiUsers className="w-4 h-4" />
                      <span className="font-bold">
                        {
                          new Set(
                            paquetes.flatMap(
                              (p) => p.mayoristas?.map((m) => m.id) || [],
                            ),
                          ).size
                        }
                      </span>
                      <span className="hidden sm:inline">mayoristas</span>
                    </div>
                  </>
                )}

                {(searchTerm ||
                  priceFilter.min ||
                  priceFilter.max ||
                  mayoristaFilter ||
                  statusFilter ||
                  tipoProductoFilter) && (
                  <button
                    onClick={clearFilters}
                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm border border-red-200 hover:border-red-300 min-h-[42px] shadow-sm hover:shadow-md"
                  >
                    <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {isSortMenuOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "titulo"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => requestSort("titulo")}
                >
                  <span>Nombre</span>
                  {sortConfig.key === "titulo" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "precio_total"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => requestSort("precio_total")}
                >
                  <span>Precio</span>
                  {sortConfig.key === "precio_total" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
                <button
                  className={`px-3 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "activo"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => requestSort("activo")}
                >
                  <span>Estado</span>
                  {sortConfig.key === "activo" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
              </div>
            </div>
          )}

          {isFiltersOpen && (
            <div className="mt-4 p-4 sm:p-5 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  Filtros avanzados
                </h3>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rango de precios
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Mínimo"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={priceFilter.min}
                      onChange={(e) =>
                        setPriceFilter({
                          ...priceFilter,
                          min: e.target.value,
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Máximo"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={priceFilter.max}
                      onChange={(e) =>
                        setPriceFilter({
                          ...priceFilter,
                          max: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiUsers className="inline w-4 h-4 mr-1" />
                    Mayorista
                  </label>
                  <select
                    value={mayoristaFilter}
                    onChange={(e) => setMayoristaFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todos</option>
                    {mayoristas?.map((mayorista) => (
                      <option key={mayorista.id} value={mayorista.id}>
                        {mayorista.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiTag className="inline w-4 h-4 mr-1" />
                    Tipo
                  </label>
                  <select
                    value={tipoProductoFilter}
                    onChange={(e) => setTipoProductoFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todos</option>
                    {mayoristas &&
                      Array.from(
                        new Set(mayoristas.map((m) => m.tipo_producto)),
                      )
                        .filter(Boolean)
                        .map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row justify-between items-center pt-4 gap-3">
                  <span className="text-sm text-gray-600 order-2 sm:order-1">
                    {filteredPaquetes.length} paquete
                    {filteredPaquetes.length !== 1 ? "s" : ""} encontrado
                    {filteredPaquetes.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex gap-2 order-1 sm:order-2">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition text-sm"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => setIsFiltersOpen(false)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition text-sm flex items-center gap-2"
                    >
                      <FiFilter className="w-4 h-4" />
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros Rápidos - Diseño Moderno */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5 mb-6">
          <div className="space-y-4">
            {/* Header de filtros */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-800">Filtros Rápidos</h3>
            </div>
            
            {/* Filtros principales */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setStatusFilter("activo");
                  setIsFiltersOpen(false);
                }}
                className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[40px] ${
                  statusFilter === "activo"
                    ? "bg-emerald-500 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusFilter === "activo" ? "bg-white" : "bg-emerald-500"}`}></div>
                  <span>Paquetes Activos</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setStatusFilter("inactivo");
                  setIsFiltersOpen(false);
                }}
                className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[40px] ${
                  statusFilter === "inactivo"
                    ? "bg-red-500 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-700 border border-gray-200 hover:border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusFilter === "inactivo" ? "bg-white" : "bg-red-500"}`}></div>
                  <span>Paquetes Inactivos</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setMayoristaFilter("");
                  setTipoProductoFilter("");
                  setStatusFilter("");
                  setIsFiltersOpen(false);
                }}
                className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[40px] ${
                  !mayoristaFilter && !tipoProductoFilter && !statusFilter
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FiSearch className="w-4 h-4" />
                  <span>Todos los Paquetes</span>
                </div>
              </button>
            </div>

            {/* Filtros por mayorista - Mejorado */}
            {mayoristas && mayoristas.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Filtrar por Mayorista:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {mayoristas.slice(0, 4).map((mayorista) => (
                    <button
                      key={mayorista.id}
                      onClick={() => {
                        setMayoristaFilter(mayorista.id);
                        setIsFiltersOpen(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-h-[36px] ${
                        mayoristaFilter === mayorista.id
                          ? "bg-purple-500 text-white shadow-md transform scale-105"
                          : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200"
                      }`}
                    >
                      {mayorista.nombre}
                    </button>
                  ))}
                  {mayoristas.length > 4 && (
                    <button
                      onClick={() => setIsFiltersOpen(true)}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 min-h-[36px] border border-gray-300"
                    >
                      +{mayoristas.length - 4} más mayoristas
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Botón para limpiar filtros - Mejorado */}
            {(searchTerm ||
              priceFilter.min ||
              priceFilter.max ||
              mayoristaFilter ||
              statusFilter ||
              tipoProductoFilter) && (
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 transition-all duration-200 flex items-center justify-center gap-2 min-h-[40px]"
                >
                  <FiX className="w-4 h-4" />
                  <span>Limpiar todos los filtros</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredPaquetes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredPaquetes.map((paquete) => {
              return (
                <div
                  key={paquete.id}
                  className="group bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Imagen del paquete con zoom sutil */}
                  <div className="relative h-64 overflow-hidden">
                    {paquete.primera_imagen ? (
                      <img
                        src={getImageUrl(paquete.primera_imagen)}
                        alt={paquete.titulo}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col items-center justify-center text-gray-500 p-6">
                        <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl w-20 h-20 flex items-center justify-center mb-4 shadow-lg">
                          <FiMapPin className="w-10 h-10 text-gray-400" />
                        </div>
                        <span className="text-sm font-medium text-center text-gray-600">
                          Sin imagen disponible
                        </span>
                      </div>
                    )}

                    {/* Overlay sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badge de precio - Diseño premium */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
                        {parseFloat(paquete.precio_total).toLocaleString(
                          "es-MX",
                          {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 0,
                          },
                        )}
                      </div>
                    </div>

                    {/* Badge de estado - Simplificado */}
                    <div className="absolute top-4 left-4">
                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md backdrop-blur-sm border ${
                          paquete.activo
                            ? "bg-emerald-500 text-white border-emerald-400"
                            : "bg-red-500 text-white border-red-400"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-white`}></div>
                          <span>{paquete.activo ? "ACTIVO" : "INACTIVO"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Clave mayorista - Si existe */}
                    {paquete.clave_mayorista && (
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-gray-200">
                          {paquete.clave_mayorista}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contenido de la tarjeta - Diseño premium */}
                  <div className="p-6">
                    {/* Título con hover suave */}
                    <h2 className="text-xl font-bold text-gray-900 line-clamp-2 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                      {paquete.titulo}
                    </h2>

                    {/* Información en cards pequeñas con hover independiente */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {paquete.fecha_inicio && (
                        <div className="group/date bg-blue-50 hover:bg-blue-100 rounded-xl p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                          <FiCalendar className="w-4 h-4 text-blue-500 mx-auto mb-1 group-hover/date:scale-110 group-hover/date:rotate-12 transition-transform duration-200" />
                          <div className="text-xs text-blue-700 font-medium">
                            {new Date(paquete.fecha_inicio).toLocaleDateString("es-MX", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      )}

                      {paquete.mayoristas && paquete.mayoristas.length > 0 && (
                        <div className="group/users bg-purple-50 hover:bg-purple-100 rounded-xl p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                          <FiUsers className="w-4 h-4 text-purple-500 mx-auto mb-1 group-hover/users:scale-110 group-hover/users:-rotate-12 transition-transform duration-200" />
                          <div className="text-xs text-purple-700 font-medium">
                            {paquete.mayoristas.length} mayor.
                          </div>
                        </div>
                      )}

                      {paquete.destinos && paquete.destinos.length > 0 && (
                        <div className="group/map bg-orange-50 hover:bg-orange-100 rounded-xl p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                          <FiMapPin className="w-4 h-4 text-orange-500 mx-auto mb-1 group-hover/map:scale-110 group-hover/map:bounce transition-all duration-200" />
                          <div className="text-xs text-orange-700 font-medium">
                            {paquete.destinos.length} dest.
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mayoristas - Chips modernos */}
                    {paquete.mayoristas && paquete.mayoristas.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2 font-medium">MAYORISTAS</p>
                        <div className="flex flex-wrap gap-1">
                          {paquete.mayoristas.slice(0, 2).map((mayorista) => (
                            <span
                              key={mayorista.id}
                              className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-lg"
                            >
                              {mayorista.clave}
                            </span>
                          ))}
                          {paquete.mayoristas.length > 2 && (
                            <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg">
                              +{paquete.mayoristas.length - 2} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Botones de acción - Hover independiente para cada botón */}
                    <div className="space-y-3">
                      {/* Fila principal */}
                      <div className="flex gap-3">
                        {/* Vista Previa - Animación de pulso y levitación */}
                        <Link
                          to={`/paquetes/${paquete.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/preview flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-indigo-100 text-gray-700 hover:text-blue-700 font-semibold py-3 px-4 rounded-2xl transition-all duration-300 text-sm flex-1 min-h-[48px] shadow-sm hover:shadow-lg hover:scale-105 transform hover:-translate-y-1"
                          title="Vista previa del paquete"
                        >
                          <FiEye className="w-4 h-4 group-hover/preview:scale-125 group-hover/preview:text-blue-600 transition-all duration-300 group-hover/preview:animate-pulse" />
                          <span className="group-hover/preview:font-bold transition-all duration-200">Vista previa</span>
                        </Link>

                        {/* Editar - Animación de rotación y cambio de color */}
                        <Link
                          to={`/admin/paquetes/editar/${paquete.id}`}
                          className="group/edit flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 text-sm flex-1 min-h-[48px] shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                          title="Editar paquete"
                        >
                          <FiEdit2 className="w-4 h-4 group-hover/edit:scale-110 group-hover/edit:rotate-45 group-hover/edit:text-yellow-200 transition-all duration-300" />
                          <span className="group-hover/edit:tracking-wide transition-all duration-200">Editar</span>
                        </Link>
                      </div>

                      {/* Fila secundaria */}
                      <div className="flex gap-3">
                        {/* Exportar - Animación de descarga y rebote */}
                        <button
                          onClick={() => handleExport(paquete.id)}
                          className="group/export flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 text-sm flex-1 min-h-[48px] shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                          title="Exportar a Excel"
                        >
                          <FiDownload className="w-4 h-4 group-hover/export:scale-125 group-hover/export:translate-y-2 group-hover/export:text-green-200 transition-all duration-300 group-hover/export:drop-shadow-lg" />
                          <span className="group-hover/export:font-bold group-hover/export:text-green-100 transition-all duration-200">Exportar</span>
                        </button>

                        {/* Eliminar - Animación de temblor y escalado dramático */}
                        <button
                          onClick={() => handleDelete(paquete.id)}
                          className="group/delete flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 text-sm flex-1 min-h-[48px] shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                          title="Eliminar paquete"
                        >
                          <FiTrash2 className="w-4 h-4 group-hover/delete:scale-125 group-hover/delete:rotate-12 group-hover/delete:text-red-200 transition-all duration-300 group-hover/delete:animate-bounce" />
                          <span className="group-hover/delete:font-bold group-hover/delete:text-red-100 transition-all duration-200">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              {/* Icono central con animación */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 mb-6">
                <FiSearch className="w-12 h-12" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 animate-ping"></div>
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                No se encontraron paquetes
              </h3>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}".`
                  : mayoristaFilter
                    ? `No hay paquetes del mayorista seleccionado.`
                    : statusFilter
                      ? `No hay paquetes ${statusFilter === "activo" ? "activos" : "inactivos"}.`
                      : "Parece que no hay paquetes disponibles."}{" "}
                Intenta ajustar los filtros o crear un nuevo paquete.
              </p>

              {/* Filtros aplicados - Diseño moderno */}
              {(searchTerm ||
                priceFilter.min ||
                priceFilter.max ||
                mayoristaFilter ||
                statusFilter ||
                tipoProductoFilter) && (
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    FILTROS APLICADOS
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {searchTerm && (
                      <span className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs rounded-xl font-medium shadow-md">
                        Búsqueda: "{searchTerm}"
                      </span>
                    )}
                    {mayoristaFilter && (
                      <span className="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs rounded-xl font-medium shadow-md">
                        Mayorista: {mayoristas?.find((m) => m.id === mayoristaFilter)?.nombre}
                      </span>
                    )}
                    {statusFilter && (
                      <span className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs rounded-xl font-medium shadow-md">
                        Estado: {statusFilter === "activo" ? "Activos" : "Inactivos"}
                      </span>
                    )}
                    {tipoProductoFilter && (
                      <span className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-xl font-medium shadow-md">
                        Tipo: {tipoProductoFilter}
                      </span>
                    )}
                    {(priceFilter.min || priceFilter.max) && (
                      <span className="px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs rounded-xl font-medium shadow-md">
                        Precio: ${priceFilter.min || "0"} - ${priceFilter.max || "∞"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción - Modernos */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearFilters}
                  className="group px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  <span className="flex items-center gap-2">
                    <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    Limpiar filtros
                  </span>
                </button>
                
                <Link
                  to="/admin/paquetes/nuevo"
                  className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="flex items-center gap-2">
                    <FiPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    Crear nuevo paquete
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Componente de Paginación */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={goToPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  );
};

export default AdminPaquetes;
