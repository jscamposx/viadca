import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAllPackages } from "../../package/hooks/useAllPackages";
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
} from "react-icons/fi";
import api from "../../../api";
import { useNotification } from "./AdminLayout";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPaquetes = () => {
  const { paquetes, setPaquetes, loading, error } = useAllPackages();
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
    if (paquetes) {
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
      setPaquetes((prevPaquetes) => prevPaquetes.filter((p) => p.id !== id));
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="relative lg:col-span-5">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, precio o destino..."
                className="w-full pl-10 pr-4 py-3 lg:py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:col-span-4">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center justify-center gap-2 font-medium py-3 lg:py-4 px-4 lg:px-6 rounded-xl transition text-sm lg:text-base w-full ${
                  isFiltersOpen
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <FiFilter className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Filtros</span>
                <span className="sm:hidden">Filtrar</span>
              </button>

              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className={`flex items-center justify-center gap-2 py-3 lg:py-4 px-4 lg:px-6 rounded-xl font-medium transition text-sm lg:text-base w-full ${
                  isSortMenuOpen
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sortConfig.direction === "asc" ? (
                  <FiArrowUp className="w-4 h-4 lg:w-5 lg:h-5" />
                ) : (
                  <FiArrowDown className="w-4 h-4 lg:w-5 lg:h-5" />
                )}
                <span className="hidden sm:inline">Ordenar</span>
                <span className="sm:hidden">Orden</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 lg:col-span-3">
              <div className="bg-blue-50 text-blue-700 py-2 px-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 justify-center flex-1">
                <span className="font-bold">{filteredPaquetes.length}</span>
                <span className="hidden sm:inline">
                  {filteredPaquetes.length === 1 ? "paquete" : "paquetes"}
                </span>
                <span className="sm:hidden">pqts</span>
              </div>

              {paquetes && (
                <div className="hidden lg:flex gap-2 flex-1">
                  <div className="bg-green-50 text-green-700 py-2 px-3 rounded-xl font-medium text-xs flex items-center gap-1 justify-center flex-1">
                    <span className="font-bold">
                      {paquetes.filter((p) => p.activo).length}
                    </span>
                    <span className="text-xs">activos</span>
                  </div>

                  <div className="bg-purple-50 text-purple-700 py-2 px-3 rounded-xl font-medium text-xs flex items-center gap-1 justify-center flex-1">
                    <FiUsers className="w-3 h-3" />
                    <span className="font-bold">
                      {
                        new Set(
                          paquetes.flatMap(
                            (p) => p.mayoristas?.map((m) => m.id) || [],
                          ),
                        ).size
                      }
                    </span>
                  </div>
                </div>
              )}

              {(searchTerm ||
                priceFilter.min ||
                priceFilter.max ||
                mayoristaFilter ||
                statusFilter ||
                tipoProductoFilter) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-xl transition text-xs border border-red-200"
                >
                  <FiX className="w-3 h-3" />
                  <span className="hidden sm:inline">Limpiar</span>
                </button>
              )}
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

        <div className="bg-white rounded-2xl shadow-md p-3 sm:p-4 mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center mb-1 sm:mb-0">
              Filtros rápidos:
            </span>

            <button
              onClick={() => {
                setStatusFilter("activo");
                setIsFiltersOpen(false);
              }}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition ${
                statusFilter === "activo"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Activos
            </button>

            <div className="hidden sm:flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setMayoristaFilter("");
                  setIsFiltersOpen(false);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition ${
                  !mayoristaFilter
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Todos los mayoristas
              </button>

              {mayoristas?.slice(0, 2).map((mayorista) => (
                <button
                  key={mayorista.id}
                  onClick={() => {
                    setMayoristaFilter(mayorista.id);
                    setIsFiltersOpen(false);
                  }}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition ${
                    mayoristaFilter === mayorista.id
                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {mayorista.nombre}
                </button>
              ))}

              {mayoristas &&
                Array.from(new Set(mayoristas.map((m) => m.tipo_producto)))
                  .filter(Boolean)
                  .slice(0, 1)
                  .map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setTipoProductoFilter(tipo);
                        setIsFiltersOpen(false);
                      }}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium transition ${
                        tipoProductoFilter === tipo
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
            </div>

            {(searchTerm ||
              priceFilter.min ||
              priceFilter.max ||
              mayoristaFilter ||
              statusFilter ||
              tipoProductoFilter) && (
              <button
                onClick={clearFilters}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition flex items-center gap-1"
              >
                <FiX className="w-3 h-3" />
                <span className="hidden sm:inline">Limpiar todo</span>
                <span className="sm:hidden">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {filteredPaquetes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredPaquetes.map((paquete) => {
              return (
                <div
                  key={paquete.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-48 sm:h-56 lg:h-64 xl:h-72 relative overflow-hidden">
                    {paquete.primera_imagen ? (
                      <img
                        src={getImageUrl(paquete.primera_imagen)}
                        alt={paquete.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-500 p-4">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center mb-3">
                          <FiMapPin className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
                        </div>
                        <span className="text-sm lg:text-base text-center">
                          Sin imagen disponible
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      <div className="bg-blue-600 text-white text-sm lg:text-base font-semibold px-3 lg:px-4 py-2 lg:py-2.5 rounded-full shadow-sm">
                        {parseFloat(paquete.precio_total).toLocaleString(
                          "es-MX",
                          {
                            style: "currency",
                            currency: "MXN",
                            minimumFractionDigits: 0,
                          },
                        )}
                      </div>

                      {paquete.clave_mayorista && (
                        <div className="bg-gray-700 text-white text-sm lg:text-base font-semibold px-3 lg:px-4 py-2 lg:py-2.5 rounded-full shadow-sm">
                          {paquete.clave_mayorista}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 lg:p-6">
                    <div className="mb-4 lg:mb-5">
                      <h2 className="text-base lg:text-xl xl:text-2xl font-bold text-gray-800 line-clamp-2 mb-3">
                        {paquete.titulo}
                      </h2>

                      <div className="flex flex-wrap gap-2 lg:gap-3 mb-3 lg:mb-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm lg:text-base font-medium ${
                            paquete.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {paquete.activo ? "Activo" : "Inactivo"}
                        </span>

                        {paquete.fecha_inicio && (
                          <span className="px-3 py-1.5 rounded-full text-sm lg:text-base font-medium bg-blue-100 text-blue-700 flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {new Date(
                                paquete.fecha_inicio,
                              ).toLocaleDateString("es-MX", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span className="sm:hidden">
                              {new Date(
                                paquete.fecha_inicio,
                              ).toLocaleDateString("es-MX", {
                                month: "numeric",
                                day: "numeric",
                              })}
                            </span>
                          </span>
                        )}

                        {paquete.mayoristas &&
                          paquete.mayoristas.length > 0 && (
                            <span className="px-3 py-1.5 rounded-full text-sm lg:text-base font-medium bg-purple-100 text-purple-700 flex items-center gap-2">
                              <FiUsers className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {paquete.mayoristas.length} mayorista
                                {paquete.mayoristas.length > 1 ? "s" : ""}
                              </span>
                              <span className="sm:hidden">
                                {paquete.mayoristas.length}
                              </span>
                            </span>
                          )}

                        {paquete.destinos && paquete.destinos.length > 0 && (
                          <span className="px-3 py-1.5 rounded-full text-sm lg:text-base font-medium bg-orange-100 text-orange-700 flex items-center gap-2">
                            <FiMapPin className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {paquete.destinos.length} destino
                              {paquete.destinos.length > 1 ? "s" : ""}
                            </span>
                            <span className="sm:hidden">
                              {paquete.destinos.length}
                            </span>
                          </span>
                        )}
                      </div>

                      {paquete.mayoristas && paquete.mayoristas.length > 0 && (
                        <div className="mb-3 lg:mb-4 hidden sm:block">
                          <p className="text-sm lg:text-base text-gray-500 mb-2">
                            Mayoristas:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {paquete.mayoristas.slice(0, 2).map((mayorista) => (
                              <span
                                key={mayorista.id}
                                className="text-sm lg:text-base bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md"
                              >
                                {mayorista.clave}
                              </span>
                            ))}
                            {paquete.mayoristas.length > 2 && (
                              <span className="text-sm lg:text-base text-gray-500">
                                +{paquete.mayoristas.length - 2} más
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                      <Link
                        to={`/paquetes/${paquete.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 lg:py-3 px-3 lg:px-4 rounded-lg transition text-sm lg:text-base"
                        title="Vista previa"
                      >
                        <FiEye className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="hidden sm:inline">Vista</span>
                      </Link>

                      <Link
                        to={`/admin/paquetes/editar/${paquete.id}`}
                        className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2.5 lg:py-3 px-3 lg:px-4 rounded-lg transition text-sm lg:text-base"
                        title="Editar"
                      >
                        <FiEdit2 className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="hidden sm:inline">Editar</span>
                      </Link>

                      <button
                        onClick={() => handleExport(paquete.id)}
                        className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2.5 lg:py-3 px-3 lg:px-4 rounded-lg transition text-sm lg:text-base"
                        title="Exportar a Excel"
                      >
                        <FiDownload className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="hidden sm:inline">Excel</span>
                      </button>

                      <button
                        onClick={() => handleDelete(paquete.id)}
                        className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2.5 lg:py-3 px-3 lg:px-4 rounded-lg transition text-sm lg:text-base"
                        title="Eliminar"
                      >
                        <FiTrash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                        <span className="hidden sm:inline">Eliminar</span>
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
                  ? `No hay resultados para "${searchTerm}".`
                  : mayoristaFilter
                    ? `No hay paquetes del mayorista seleccionado.`
                    : statusFilter
                      ? `No hay paquetes ${statusFilter === "activo" ? "activos" : "inactivos"}.`
                      : "Parece que no hay paquetes disponibles."}{" "}
                Intenta ajustar los filtros o crear un nuevo paquete.
              </p>

              {(searchTerm ||
                priceFilter.min ||
                priceFilter.max ||
                mayoristaFilter ||
                statusFilter ||
                tipoProductoFilter) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Filtros aplicados:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {searchTerm && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Búsqueda: "{searchTerm}"
                      </span>
                    )}
                    {mayoristaFilter && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Mayorista:{" "}
                        {
                          mayoristas?.find((m) => m.id === mayoristaFilter)
                            ?.nombre
                        }
                      </span>
                    )}
                    {statusFilter && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Estado:{" "}
                        {statusFilter === "activo" ? "Activos" : "Inactivos"}
                      </span>
                    )}
                    {tipoProductoFilter && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        Tipo: {tipoProductoFilter}
                      </span>
                    )}
                    {(priceFilter.min || priceFilter.max) && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Precio: ${priceFilter.min || "0"} - $
                        {priceFilter.max || "∞"}
                      </span>
                    )}
                  </div>
                </div>
              )}

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
