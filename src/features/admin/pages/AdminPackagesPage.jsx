import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  FiDollarSign,
  FiActivity,
  FiPackage,
  FiCheckCircle
} from "react-icons/fi";
import api from "../../../api";
import { useNotification } from "./AdminLayout";
import Pagination from "../../../components/ui/Pagination";
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { getImageUrl } from "../../../utils/imageUtils";
import ConfirmDialog from "../components/ConfirmDialog";

const AdminPaquetes = () => {
  const location = useLocation();
  const processedLocationKey = useRef(null);
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
    setItemsPerPage,
    refetch,
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
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    packageId: null,
    packageName: "",
  });
  const { addNotification } = useNotification();

  // Manejar notificaciones al regresar de crear/editar paquetes
  useEffect(() => {
    // Solo procesar si hay un estado de notificación y no se ha procesado esta navegación
    if (
      location.state?.showNotification &&
      location.key !== processedLocationKey.current
    ) {
      const { notificationMessage, notificationType, shouldRefresh } =
        location.state;

      // Marcar esta navegación como procesada
      processedLocationKey.current = location.key;

      // Mostrar notificación
      addNotification(notificationMessage, notificationType);

      // Refrescar la lista si es necesario
      if (shouldRefresh && refetch) {
        refetch();
      }

      // Limpiar el estado después de un breve delay para evitar conflictos
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }

    // Manejar operaciones en segundo plano
    if (
      location.state?.backgroundOperation &&
      location.key !== processedLocationKey.current
    ) {
      const { operationType, packageTitle } = location.state;

      // Marcar esta navegación como procesada
      processedLocationKey.current = location.key;

      // Mostrar notificación informativa sobre la operación en segundo plano
      const message =
        operationType === "update"
          ? `La actualización de "${packageTitle}" continúa en segundo plano`
          : `La creación de "${packageTitle}" continúa en segundo plano`;

      addNotification(message, "info");

      // Limpiar el estado después de un breve delay para evitar conflictos
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [
    location.state?.showNotification,
    location.state?.backgroundOperation,
    location.key,
    addNotification,
    refetch,
  ]);

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

  const handleDelete = (id, packageName) => {
    setConfirmDialog({
      isOpen: true,
      packageId: id,
      packageName: packageName,
    });
  };

  const confirmDelete = async () => {
    try {
      await api.packages.deletePaquete(confirmDialog.packageId);
      setPaquetes((prevPaquetes) =>
        Array.isArray(prevPaquetes)
          ? prevPaquetes.filter((p) => p.id !== confirmDialog.packageId)
          : [],
      );
      addNotification("Paquete movido a la papelera. Puedes restaurarlo desde la sección de papelera.", "success");
    } catch (err) {
      console.error("Error al eliminar el paquete:", err);
      addNotification(
        "No se pudo mover el paquete a la papelera. Inténtalo de nuevo.",
        "error",
      );
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      packageId: null,
      packageName: "",
    });
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
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gestión de Paquetes
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Administra todos tus paquetes turísticos en un solo lugar ({totalItems} total)
              </p>
            </div>

            <Link
              to="/admin/paquetes/nuevo"
              className="w-full sm:w-auto lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nuevo Paquete</span>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/95 via-purple-50/30 to-blue-50/30 backdrop-blur-sm border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-purple-400 text-base sm:text-lg" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, precio o destino..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-purple-50/50 font-medium shadow-md focus:shadow-lg transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Controles y estadísticas - Simplificado para móvil */}
            <div className="flex flex-col gap-3">
              {/* Botones de control - Solo en móvil */}
              <div className="grid grid-cols-2 gap-2 lg:hidden">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center justify-center gap-2 font-medium py-3 px-3 rounded-lg transition text-xs ${
                    isFiltersOpen
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Filtros</span>
                </button>

                <button
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg font-medium transition text-xs ${
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

              {/* Estadísticas - Solo en móvil, mejoradas */}
              <div className="grid grid-cols-2 gap-3 lg:hidden">
                <div className="rounded-xl p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" aria-label="Paquetes filtrados">
                  <div className="flex items-center gap-2">
                    <FiPackage className="w-4 h-4 opacity-95" />
                    <span className="text-xs font-medium">Paquetes</span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold leading-none">{filteredPaquetes.length}</div>
                </div>

                {paquetes && Array.isArray(paquetes) && (
                  <div className="rounded-xl p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md" aria-label="Activos">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4 opacity-95" />
                      <span className="text-xs font-medium">Activos</span>
                    </div>
                    <div className="mt-1 text-2xl font-extrabold leading-none">{paquetes.filter((p) => p.activo).length}</div>
                  </div>
                )}
              </div>

              {/* Estadísticas para desktop - en misma fila que controles */}
              <div className="hidden lg:flex lg:items-center lg:justify-between">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition text-sm ${
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
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition text-sm ${
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

                <div className="flex gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="font-bold">{filteredPaquetes.length}</span>
                    <span>paquetes</span>
                  </div>

                  {paquetes && Array.isArray(paquetes) && (
                    <>
                      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="font-bold">
                          {paquetes.filter((p) => p.activo).length}
                        </span>
                        <span>activos</span>
                      </div>

                      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
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
                        <span>mayoristas</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isSortMenuOpen && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
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
                  className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
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
                  className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
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
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-white via-purple-50/40 to-blue-50/40 rounded-lg sm:rounded-xl lg:rounded-2xl ">
              <div className="flex justify-between items-center mb-3 sm:mb-4 lg:mb-6">
                <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800">
                  Filtros avanzados
                </h3>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {/* Rango de precios */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiDollarSign className="inline w-4 h-4 mr-1" />
                    Rango de precios
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Mínimo"
                      className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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
                      className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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

                {/* Mayorista */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiUsers className="inline w-4 h-4 mr-1" />
                    Mayorista
                  </label>
                  <select
                    value={mayoristaFilter}
                    onChange={(e) => setMayoristaFilter(e.target.value)}
                    className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="">Todos los mayoristas</option>
                    {mayoristas?.map((mayorista) => (
                      <option key={mayorista.id} value={mayorista.id}>
                        {mayorista.nombre} ({mayorista.clave})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiTag className="inline w-4 h-4 mr-1" />
                    Tipo de producto
                  </label>
                  <select
                    value={tipoProductoFilter}
                    onChange={(e) => setTipoProductoFilter(e.target.value)}
                    className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="">Todos los tipos</option>
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

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiActivity className="inline w-4 h-4 mr-1" />
                    Estado del paquete
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Paquetes activos</option>
                    <option value="inactivo">Paquetes inactivos</option>
                  </select>
                </div>
              </div>

              {/* Botones de acción - Mejorados para desktop */}
              <div className="flex flex-col lg:flex-row justify-between items-center pt-4 lg:pt-6 gap-3 lg:gap-4 border-t border-gray-200 mt-4 lg:mt-6">
                <div className="text-sm lg:text-base text-gray-600 order-2 lg:order-1 text-center lg:text-left">
                  <span className="font-semibold text-blue-600">
                    {filteredPaquetes.length}
                  </span>
                  <span>
                    {" "}
                    paquete{filteredPaquetes.length !== 1 ? "s" : ""} encontrado
                    {filteredPaquetes.length !== 1 ? "s" : ""}
                  </span>
                  {totalItems > 0 && (
                    <span className="text-gray-500 ml-2">
                      de {totalItems} total
                    </span>
                  )}
                </div>
                <div className="flex gap-3 lg:gap-4 order-1 lg:order-2 w-full lg:w-auto">
                  <button
                    onClick={clearFilters}
                    className="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium rounded-lg lg:rounded-xl transition-all duration-200 text-sm lg:text-base shadow-sm hover:shadow-md"
                  >
                    Limpiar todo
                  </button>
                  <button
                    onClick={() => setIsFiltersOpen(false)}
                    className="flex-1 lg:flex-none px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg lg:rounded-xl transition-all duration-200 text-sm lg:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <FiFilter className="w-4 h-4" />
                    Aplicar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros Rápidos - Mejorado para móvil */}
        <section
          className="bg-gradient-to-r from-white via-gray-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6"
          aria-labelledby="filtros-rapidos"
        >
          <div className="space-y-3 sm:space-y-4">
            {/* Header de filtros */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
              <h2
                id="filtros-rapidos"
                className="text-xs sm:text-sm font-semibold text-gray-800"
              >
                Filtros Rápidos
              </h2>
            </div>

            {/* Filtros principales */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
              role="group"
              aria-labelledby="filtros-rapidos"
            >
              <button
                onClick={() => {
                  setMayoristaFilter("");
                  setTipoProductoFilter("");
                  setStatusFilter("");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={
                  !mayoristaFilter && !tipoProductoFilter && !statusFilter
                }
                aria-label="Mostrar todos los paquetes sin filtros"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  !mayoristaFilter && !tipoProductoFilter && !statusFilter
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiSearch className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Todos los Paquetes</span>
                  <span className="sm:hidden">Todos</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setStatusFilter("activo");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={statusFilter === "activo"}
                aria-label="Filtrar por paquetes activos"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  statusFilter === "activo"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${statusFilter === "activo" ? "bg-white" : "bg-emerald-500"}`}
                  ></div>
                  <span className="hidden sm:inline">Paquetes Activos</span>
                  <span className="sm:hidden">Activos</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setStatusFilter("inactivo");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={statusFilter === "inactivo"}
                aria-label="Filtrar por paquetes inactivos"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  statusFilter === "inactivo"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-700 border border-gray-200 hover:border-red-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${statusFilter === "inactivo" ? "bg-white" : "bg-red-500"}`}
                  ></div>
                  <span className="hidden sm:inline">Paquetes Inactivos</span>
                  <span className="sm:hidden">Inactivos</span>
                </div>
              </button>
            </div>

            {/* Filtros por mayorista - Completo para desktop, simplificado para móvil */}
            {mayoristas && mayoristas.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Filtrar por Mayorista:
                  </span>
                </div>

                {/* Versión móvil - limitada */}
                <div className="grid grid-cols-2 gap-2 lg:hidden">
                  {mayoristas.slice(0, 3).map((mayorista) => (
                    <button
                      key={mayorista.id}
                      onClick={() => {
                        setMayoristaFilter(mayorista.id);
                        setIsFiltersOpen(false);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 truncate ${
                        mayoristaFilter === mayorista.id
                          ? "bg-purple-500 text-white shadow-md"
                          : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200"
                      }`}
                      title={mayorista.nombre}
                    >
                      {mayorista.nombre.length > 12
                        ? `${mayorista.nombre.substring(0, 12)}...`
                        : mayorista.nombre}
                    </button>
                  ))}
                  {mayoristas.length > 3 && (
                    <button
                      onClick={() => setIsFiltersOpen(true)}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-300 col-span-2"
                    >
                      +{mayoristas.length - 3} más
                    </button>
                  )}
                </div>

                {/* Versión desktop - completa */}
                <div className="hidden lg:grid lg:grid-cols-4 lg:gap-3">
                  {mayoristas.map((mayorista) => (
                    <button
                      key={mayorista.id}
                      onClick={() => {
                        setMayoristaFilter(mayorista.id);
                        setIsFiltersOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        mayoristaFilter === mayorista.id
                          ? "bg-purple-500 text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200 hover:shadow-md"
                      }`}
                      title={`${mayorista.nombre} - ${mayorista.clave}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          mayoristaFilter === mayorista.id
                            ? "bg-white"
                            : "bg-purple-500"
                        }`}
                      ></div>
                      <span className="truncate">{mayorista.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón para limpiar filtros */}
            {(searchTerm ||
              priceFilter.min ||
              priceFilter.max ||
              mayoristaFilter ||
              statusFilter ||
              tipoProductoFilter) && (
              <div className="pt-2 sm:pt-2 border-t border-gray-200">
                <button
                  onClick={clearFilters}
                  aria-label="Limpiar todos los filtros aplicados"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-red-50 to-pink-50 text-red-600 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">
                    Limpiar todos los filtros
                  </span>
                  <span className="sm:hidden">Limpiar filtros</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {filteredPaquetes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {filteredPaquetes.map((paquete) => {
              return (
                <div
                  key={paquete.id}
                  className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Imagen del paquete */}
                  <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                    {paquete.primera_imagen ? (
                      <OptimizedImage
                        src={paquete.primera_imagen}
                        alt={paquete.titulo}
                        width={600}
                        height={400}
                        quality="auto"
                        format="webp"
                        crop="fill"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        lazy={true}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col items-center justify-center text-gray-500 p-4 sm:p-6">
                        <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                          <FiMapPin className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-center text-gray-600">
                          Sin imagen disponible
                        </span>
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badge de precio */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xs sm:text-sm font-bold px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
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

                    {/* Badge de estado */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                      <div
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold shadow-md backdrop-blur-sm border ${
                          paquete.activo
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400"
                            : "bg-red-500 text-white border-red-400"
                        }`}
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse"></div>
                          <span className="hidden sm:inline">
                            {paquete.activo ? "ACTIVO" : "INACTIVO"}
                          </span>
                          <span className="sm:hidden">
                            {paquete.activo ? "ACTIVO" : "INACTIVO"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Clave mayorista */}
                    {paquete.clave_mayorista && (
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                        <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg border border-gray-200">
                          {paquete.clave_mayorista}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                    {/* Título */}
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors duration-200">
                      {paquete.titulo}
                    </h2>

                    {/* Contenido variable que puede crecer */}
                    <div className="flex-1">
                      {/* Información en cards pequeñas */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {paquete.fecha_inicio && (
                          <div className="bg-blue-50 hover:bg-blue-100 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                            <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mx-auto mb-1 transition-transform duration-200" />
                            <div className="text-xs text-blue-700 font-medium">
                              {new Date(
                                paquete.fecha_inicio,
                              ).toLocaleDateString("es-MX", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        )}

                        {paquete.mayoristas &&
                          paquete.mayoristas.length > 0 && (
                            <div className="bg-purple-50 hover:bg-purple-100 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                              <FiUsers className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 mx-auto mb-1 transition-transform duration-200" />
                              <div className="text-xs text-purple-700 font-medium">
                                {paquete.mayoristas.length}{" "}
                                <span className="hidden sm:inline">mayor.</span>
                              </div>
                            </div>
                          )}

                        {paquete.destinos && paquete.destinos.length > 0 && (
                          <div className="bg-teal-50 hover:bg-teal-100 rounded-lg sm:rounded-xl p-2 sm:p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                            <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 mx-auto mb-1 transition-transform duration-200" />
                            <div className="text-xs text-teal-700 font-medium">
                              {paquete.destinos.length}{" "}
                              <span className="hidden sm:inline">dest.</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mayoristas - Completo para desktop, simplificado para móvil */}
                      {paquete.mayoristas && paquete.mayoristas.length > 0 && (
                        <div className="mb-3 sm:mb-4">
                          <p className="text-xs text-gray-500 mb-1 sm:mb-2 font-medium">
                            MAYORISTAS
                          </p>
                          <div className="flex flex-wrap gap-1 lg:gap-2">
                            {/* Versión móvil - limitada a 2 */}
                            <div className="flex flex-wrap gap-1 lg:hidden">
                              {paquete.mayoristas
                                .slice(0, 2)
                                .map((mayorista) => (
                                  <span
                                    key={mayorista.id}
                                    className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-lg"
                                    title={mayorista.clave}
                                  >
                                    {mayorista.clave.length > 8
                                      ? `${mayorista.clave.substring(0, 8)}...`
                                      : mayorista.clave}
                                  </span>
                                ))}
                              {paquete.mayoristas.length > 2 && (
                                <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg">
                                  +{paquete.mayoristas.length - 2}
                                </span>
                              )}
                            </div>

                            {/* Versión desktop - completa */}
                            <div className="hidden lg:flex lg:flex-wrap lg:gap-2">
                              {paquete.mayoristas.map((mayorista) => (
                                <span
                                  key={mayorista.id}
                                  className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-100 hover:to-indigo-100 text-gray-700 hover:text-purple-700 text-sm font-medium px-3 py-1.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                  title={`${mayorista.nombre} - ${mayorista.clave}`}
                                >
                                  {mayorista.clave}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Botones de acción - Rediseñados para móvil y siempre en la parte inferior */}
                    <div className="space-y-2 sm:space-y-3">
                      {/* Fila principal */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {/* Vista Previa */}
                        <Link
                          to={`/paquetes/${paquete.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grupo/vista-previa flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-50 hover:to-indigo-100 text-gray-700 hover:text-blue-700 font-semibold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-lg hover:scale-105 transform hover:-translate-y-1"
                          title="Vista previa del paquete"
                        >
                          <FiEye className="w-3 h-3 sm:w-4 sm:h-4 grupo-hover/vista-previa:scale-125 grupo-hover/vista-previa:text-blue-600 transition-all duration-300" />
                          <span className="hidden sm:inline grupo-hover/vista-previa:font-bold transition-all duration-200">
                            Vista previa
                          </span>
                          <span className="sm:hidden">Ver</span>
                        </Link>

                        {/* Editar */}
                        <Link
                          to={`/admin/paquetes/editar/${paquete.id}`}
                          className="grupo/editar flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                          title="Editar paquete"
                        >
                          <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4 grupo-hover/editar:scale-110 grupo-hover/editar:rotate-45 grupo-hover/editar:text-yellow-200 transition-all duration-300" />
                          <span className="hidden sm:inline grupo-hover/editar:tracking-wide transition-all duration-200">
                            Editar
                          </span>
                          <span className="sm:hidden">Editar</span>
                        </Link>
                      </div>

                      {/* Fila secundaria */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {/* Exportar */}
                        <button
                          onClick={() => handleExport(paquete.id)}
                          className="grupo/exportar flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                          title="Exportar a Excel"
                        >
                          <FiDownload className="w-3 h-3 sm:w-4 sm:h-4 grupo-hover/exportar:scale-125 grupo-hover/exportar:translate-y-2 grupo-hover/exportar:text-green-200 transition-all duration-300" />
                          <span className="hidden sm:inline grupo-hover/exportar:font-bold grupo-hover/exportar:text-green-100 transition-all duration-200">
                            Exportar
                          </span>
                          <span className="sm:hidden">Excel</span>
                        </button>

                        {/* Mover a papelera */}
                        <button
                          onClick={() =>
                            handleDelete(paquete.id, paquete.titulo)
                          }
                          className="grupo/eliminar flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-2xl transition-all duration-300 text-xs sm:text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                          title="Mover a papelera"
                        >
                          <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4 grupo-hover/eliminar:scale-125 grupo-hover/eliminar:rotate-12 grupo-hover/eliminar:text-red-200 transition-all duration-300" />
                          <span className="hidden sm:inline grupo-hover/eliminar:font-bold grupo-hover/eliminar:text-red-100 transition-all duration-200">
                            Eliminar
                          </span>
                          <span className="sm:hidden">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              {/* Icono central con animación */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 mb-4 sm:mb-6">
                <FiPackage className="w-10 h-10 sm:w-12 sm:h-12" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 animate-ping"></div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                No se encontraron paquetes
              </h3>

              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}".`
                  : mayoristaFilter
                    ? `No hay paquetes del mayorista seleccionado.`
                    : statusFilter
                      ? `No hay paquetes ${statusFilter === "activo" ? "activos" : "inactivos"}.`
                      : "Parece que no hay paquetes disponibles."}{" "}
                Intenta ajustar los filtros o crear un nuevo paquete.
              </p>

              {/* Filtros aplicados - Simplificado para móvil */}
              {(searchTerm ||
                priceFilter.min ||
                priceFilter.max ||
                mayoristaFilter ||
                statusFilter ||
                tipoProductoFilter) && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border border-gray-200">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    FILTROS APLICADOS
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {searchTerm && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Búsqueda: "</span>
                        {searchTerm}
                        <span className="hidden sm:inline">"</span>
                      </span>
                    )}
                    {mayoristaFilter && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Mayorista: </span>
                        {
                          mayoristas?.find((m) => m.id === mayoristaFilter)
                            ?.nombre
                        }
                      </span>
                    )}
                    {statusFilter && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Estado: </span>
                        {statusFilter === "activo" ? "Activos" : "Inactivos"}
                      </span>
                    )}
                    {tipoProductoFilter && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Tipo: </span>
                        {tipoProductoFilter}
                      </span>
                    )}
                    {(priceFilter.min || priceFilter.max) && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Precio: </span>$
                        {priceFilter.min || "0"} - ${priceFilter.max || "∞"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción - Responsivos */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={clearFilters}
                  className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="hidden sm:inline">Limpiar filtros</span>
                    <span className="sm:hidden">Limpiar</span>
                  </span>
                </button>

                <Link
                  to="/admin/paquetes/nuevo"
                  className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="hidden sm:inline">
                      Crear nuevo paquete
                    </span>
                    <span className="sm:hidden">Crear paquete</span>
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

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDelete}
        title="Mover a papelera"
        message="¿Estás seguro de que quieres mover este paquete a la papelera? Podrás restaurarlo desde la sección de papelera."
        itemName={confirmDialog.packageName}
        confirmText="Mover a papelera"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  );
};

export default AdminPaquetes;
