import {
  useState,
  useEffect,
  useDeferredValue,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useMayoristas } from "../hooks/useMayoristas";
import {
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiPlus,
  FiFilter,
  FiX,
  FiUsers,
  FiTag,
  FiRefreshCw,
} from "react-icons/fi";
import AdminHeaderCard from "../components/AdminHeaderCard";
import MayoristaCard from "../components/MayoristaCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNotifications } from "../hooks/useNotifications";
import Pagination from "../../../components/ui/Pagination";
import api from "../../../api";
import { getOperation, clearOperation } from "../utils/operationBus";

const AdminMayoristasPage = () => {
  const location = useLocation();
  const processedLocationKey = useRef(null);
  const { notify } = useNotifications();
  const {
    mayoristas,
    /* setMayoristas, */ loading,
    error,
    deleteMayorista,
    refetch,
    // Controles de paginación del hook
    page,
    limit,
    totalPages,
    totalItems,
    goToPage,
    setItemsPerPage,
    // búsqueda backend
    search,
    setSearch,
  } = useMayoristas();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [sortConfig, setSortConfig] = useState({
    key: "nombre",
    direction: "asc",
  });
  // Estados añadidos tras refactor de header que se habían perdido
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    mayoristaId: null,
    mayoristaName: "",
  });
  // Stats (placeholder). Si existe endpoint futuro se puede poblar aquí.
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Carga inicial: mientras el hook indica loading y aún no hay datos cargados
  const isInitialLoading = loading && (!Array.isArray(mayoristas) || mayoristas.length === 0);
  const [tipoFilter, setTipoFilter] = useState("");
  const [tipoProductoFilter, setTipoProductoFilter] = useState(''); // '' = todos, 'Crucero', 'Circuito', 'Paquete', 'Hotel'
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // Gestionar operación pendiente (bloque restaurado dentro de useEffect)
  useEffect(() => {
    if (
      location.state?.pendingOperation &&
      location.key !== processedLocationKey.current
    ) {
      const { operationType, mayoristaName, opKey } = location.state;
      processedLocationKey.current = location.key;

      const loadingId = notify.loading(
        operationType === "update"
          ? `Actualizando "${mayoristaName}"...`
          : `Creando "${mayoristaName}"...`,
        {
          title:
            operationType === "update"
              ? "Actualizando mayorista"
              : "Creando mayorista",
          persistent: true,
        },
      );

      const doneSuccess = () =>
        notify.updateLoadingNotification(
          loadingId,
          "success",
          operationType === "update"
            ? `"${mayoristaName}" actualizado exitosamente`
            : `"${mayoristaName}" creado exitosamente`,
          {
            title:
              operationType === "update"
                ? "Mayorista actualizado"
                : "Mayorista creado",
            duration: 5000,
          },
        );

      const doneError = (err) =>
        notify.updateLoadingNotification(
          loadingId,
          "error",
          `Error: ${err?.response?.data?.message || err?.message || "Ocurrió un error"}`,
          {
            title:
              operationType === "update"
                ? "Error al actualizar"
                : "Error al crear",
            duration: 5000,
          },
        );

      const promise = opKey ? getOperation(opKey) : null;
      if (promise && typeof promise.then === "function") {
        promise
          .then(async () => {
            await refetch(true);
            doneSuccess();
          })
          .catch((err) => {
            doneError(err);
          })
          .finally(() => {
            if (opKey) clearOperation(opKey);
          });
      } else {
        // Fallback con polling si no se encuentra la promesa compartida
        const start = Date.now();
        const MAX_WAIT = 20000;
        const INTERVAL = 1500;
        const poll = async () => {
          try {
            await refetch(true);
            doneSuccess();
          } catch (err) {
            if (Date.now() - start < MAX_WAIT) {
              setTimeout(poll, INTERVAL);
            } else {
              doneError(err);
            }
          }
        };
        poll();
      }
      // Limpiar el state de la navegación para evitar reprocesos
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state?.pendingOperation, location.key, refetch, notify]);

  // Sincronizar búsqueda local con el hook (backend)
  useEffect(() => {
    setSearch(deferredSearchTerm);
  }, [deferredSearchTerm, setSearch]);

  const handleDelete = useCallback((mayoristaId, mayoristaName) => {
    setConfirmDialog({
      isOpen: true,
      mayoristaId: mayoristaId,
      mayoristaName: mayoristaName,
    });
  }, []);

  const confirmDelete = async () => {
    try {
      await notify.operation(() => deleteMayorista(confirmDialog.mayoristaId), {
        loadingMessage: `Moviendo "${confirmDialog.mayoristaName}" a la papelera...`,
        successMessage: `"${confirmDialog.mayoristaName}" movido a la papelera. Puedes restaurarlo desde la sección de papelera.`,
        errorMessage: "Error al mover el mayorista a la papelera",
        loadingTitle: "Eliminando mayorista",
        successTitle: "Mayorista eliminado",
        errorTitle: "Error al eliminar",
      });
    } catch (error) {
      console.error("Error al eliminar mayorista:", error);
      // El error ya se maneja en notify.operation
    } finally {
      closeConfirmDialog();
    }
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      mayoristaId: null,
      mayoristaName: "",
    });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setIsSortMenuOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSearch(""); // Limpiar búsqueda en el backend
    setTipoFilter("");
    setTipoProductoFilter("");
    setSortConfig({ key: "nombre", direction: "asc" });
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch(true);
      // Notificaciones removidas para el botón de actualizar
    } catch (e) {
      // Silenciar notificaciones en errores de actualización; solo registrar en consola
      console.error("Error al actualizar la lista de mayoristas:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // useEffect reemplazado por useMemo para evitar un render extra al derivar estado
  const filteredMayoristas = useMemo(() => {
    if (!Array.isArray(mayoristas)) return [];

    let filtered = [...mayoristas];

    // La búsqueda ahora se hace en el backend (no filtrar por deferredSearchTerm aquí)

    // Filtrar por tipo de producto (filtros rápidos)
    if (tipoProductoFilter) {
      filtered = filtered.filter(
        (mayorista) => mayorista.tipo_producto === tipoProductoFilter,
      );
    }

    // Filtrar por tipo de producto (filtro avanzado)
    if (tipoFilter && tipoFilter !== tipoProductoFilter) {
      filtered = filtered.filter(
        (mayorista) => mayorista.tipo_producto === tipoFilter,
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
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

    return filtered;
  }, [mayoristas, /*deferredSearchTerm,*/ tipoFilter, tipoProductoFilter, sortConfig]);

  const tiposUnicos = useMemo(
    () =>
      [...new Set((mayoristas || []).map((m) => m.tipo_producto))].filter(
        Boolean,
      ),
    [mayoristas],
  );

  // Skeleton de tarjetas para carga inicial
  const renderSkeletonCards = (count = 9) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 [content-visibility:auto] [contain-intrinsic-size:600px_900px]">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 animate-pulse min-h-[220px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="h-10 bg-gray-200 rounded-xl" />
            <div className="h-10 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  // Eliminar pantalla de carga bloqueante para mejorar LCP
  // if (loading) { ... }  -> Se reemplaza por UI con skeletons

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 p-6 rounded-2xl max-w-md text-center shadow-md">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error al cargar los mayoristas
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
        <AdminHeaderCard
          title="Gestión de Mayoristas"
          loading={isInitialLoading}
          description={!isInitialLoading && 'Administra todos tus mayoristas en un solo lugar'}
          persistentGlass
          actions={(
            <>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className={`group relative flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all text-sm sm:text-base whitespace-nowrap ${
                  isRefreshing || loading
                    ? 'bg-gray-100 text-gray-400 border border-gray-200'
                    : 'bg-white/70 hover:bg-white/90 text-gray-700 border border-white/60 shadow-sm hover:shadow'
                }`}
                aria-label="Actualizar lista de mayoristas"
                title="Actualizar"
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                <span>Actualizar</span>
              </button>
              <Link
                to="/admin/mayoristas/nuevo"
                className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:from-blue-600 hover:via-indigo-500 hover:to-purple-600 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all duration-400 ease-out transform hover:-translate-y-0.5 hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Nuevo Mayorista</span>
              </Link>
            </>
          )}
        />

        <div className="bg-gradient-to-br from-white/95 via-purple-50/30 to-blue-50/30 backdrop-blur-sm border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-purple-400 text-base sm:text-lg" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, clave o tipo de producto..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-purple-50/50 font-medium shadow-md focus:shadow-lg transition-all duración-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Controles y estadísticas */}
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

              {/* Estadísticas - Solo en móvil (mejoradas) */}
              <div className="grid grid-cols-2 gap-3 lg:hidden">
                <div
                  className="rounded-xl p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                  aria-label="Mayoristas"
                >
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 opacity-95" />
                    <span className="text-xs font-medium">Mayoristas</span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold leading-none">
                    {statsLoading ? (
                      <div className="h-7 w-8 bg-white/30 rounded animate-pulse" />
                    ) : (
                      (stats?.total ?? stats?.mayoristas ?? totalItems ?? mayoristas?.length ?? 0)
                    )}
                  </div>
                </div>

                <div
                  className="rounded-xl p-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md"
                  aria-label="Tipos de producto"
                >
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 opacity-95" />
                    <span className="text-xs font-medium">
                      Tipos de producto
                    </span>
                  </div>
                  <div className="mt-1 text-2xl font-extrabold leading-none">
                    {statsLoading ? (
                      <div className="h-7 w-8 bg-white/30 rounded animate-pulse" />
                    ) : (
                      (stats?.tipos ?? 0)
                    )}
                  </div>
                </div>
              </div>

              {/* Estadísticas para desktop */}
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
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="font-bold">
                      {statsLoading ? (
                        <span className="inline-block h-4 w-6 bg-white/40 rounded animate-pulse" />
                      ) : (
                        (stats?.total ?? stats?.mayoristas ?? totalItems ?? mayoristas?.length ?? 0)
                      )}
                    </span>
                    <span>mayoristas</span>
                  </div>

                  <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                    <FiTag className="w-4 h-4" />
                    <span className="font-bold">
                      {statsLoading ? (
                        <span className="inline-block h-4 w-6 bg-white/40 rounded animate-pulse" />
                      ) : (
                        (stats?.tipos ?? 0)
                      )}
                    </span>
                    <span>tipos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros Rápidos (se removió de aquí para respetar la sección separada) */}
          </div>

          {isSortMenuOpen && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "nombre"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSort("nombre")}
                >
                  <span>Nombre</span>
                  {sortConfig.key === "nombre" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
                <button
                  className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "clave"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSort("clave")}
                >
                  <span>Clave</span>
                  {sortConfig.key === "clave" &&
                    (sortConfig.direction === "asc" ? (
                      <FiArrowUp className="w-3 h-3" />
                    ) : (
                      <FiArrowDown className="w-3 h-3" />
                    ))}
                </button>
                <button
                  className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                    sortConfig.key === "tipo_producto"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSort("tipo_producto")}
                >
                  <span>Tipo</span>
                  {sortConfig.key === "tipo_producto" &&
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

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {/* Tipo de producto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                    <FiTag className="inline w-4 h-4 mr-1" />
                    Tipo de Producto
                  </label>
                  <select
                    value={tipoFilter}
                    onChange={(e) => setTipoFilter(e.target.value)}
                    className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                  >
                    <option value="">Todos los tipos</option>
                    {tiposUnicos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col lg:flex-row justify-between items-center pt-4 lg:pt-6 gap-3 lg:gap-4 border-t border-gray-200 mt-4 lg:mt-6">
                <div className="text-sm lg:text-base text-gray-600 order-2 lg:order-1 text-center lg:text-left">
                  <span className="font-semibold text-blue-600">
                    {filteredMayoristas.length}
                  </span>
                  <span>
                    {" "}
                    mayorista{filteredMayoristas.length !== 1 ? "s" : ""}{" "}
                    encontrado{filteredMayoristas.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-gray-500 ml-2">
                    de {Array.isArray(mayoristas) ? mayoristas.length : 0} total
                  </span>
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

        {/* 🎯 FILTROS RÁPIDOS POR TIPO DE PRODUCTO */}
        <section
          className="bg-gradient-to-r from-white via-gray-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6"
          aria-labelledby="filtros-rapidos-mayoristas"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                <h2
                  id="filtros-rapidos-mayoristas"
                  className="text-xs sm:text-sm font-semibold text-gray-800"
                >
                  Filtros Rápidos
                </h2>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
              role="group"
              aria-labelledby="filtros-rapidos-mayoristas"
            >
              {/* Botón: Todos */}
              <button
                onClick={() => {
                  setTipoProductoFilter('');
                  goToPage(1);
                }}
                aria-pressed={tipoProductoFilter === ''}
                aria-label="Mostrar todos los mayoristas sin filtros"
                className={`
                  group relative px-3 sm:px-4 py-2 sm:py-2.5 
                  rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium 
                  transition-all duration-200
                  ${tipoProductoFilter === '' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                  <span className="hidden sm:inline">Todos los Mayoristas</span>
                  <span className="sm:hidden">Todos</span>
                </div>
              </button>

              {/* Botón: Crucero */}
              <button
                onClick={() => {
                  setTipoProductoFilter('Crucero');
                  goToPage(1);
                }}
                aria-pressed={tipoProductoFilter === 'Crucero'}
                aria-label="Mostrar solo Crucero"
                className={`
                  group relative px-3 sm:px-4 py-2 sm:py-2.5 
                  rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium 
                  transition-all duration-200
                  ${tipoProductoFilter === 'Crucero'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
                    />
                  </svg>
                  <span className="hidden sm:inline">Crucero</span>
                  <span className="sm:hidden truncate max-w-[70px]">Crucero</span>
                </div>
              </button>

              {/* Botón: Circuito */}
              <button
                onClick={() => {
                  setTipoProductoFilter('Circuito');
                  goToPage(1);
                }}
                aria-pressed={tipoProductoFilter === 'Circuito'}
                aria-label="Mostrar solo Circuito"
                className={`
                  group relative px-3 sm:px-4 py-2 sm:py-2.5 
                  rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium 
                  transition-all duration-200
                  ${tipoProductoFilter === 'Circuito'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                    />
                  </svg>
                  <span className="hidden sm:inline">Circuito</span>
                  <span className="sm:hidden truncate max-w-[70px]">Circuito</span>
                </div>
              </button>

              {/* Botón: Paquete */}
              <button
                onClick={() => {
                  setTipoProductoFilter('Paquete');
                  goToPage(1);
                }}
                aria-pressed={tipoProductoFilter === 'Paquete'}
                aria-label="Mostrar solo Paquete"
                className={`
                  group relative px-3 sm:px-4 py-2 sm:py-2.5 
                  rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium 
                  transition-all duration-200
                  ${tipoProductoFilter === 'Paquete'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                    />
                  </svg>
                  <span className="hidden sm:inline">Paquete</span>
                  <span className="sm:hidden truncate max-w-[70px]">Paquete</span>
                </div>
              </button>

              {/* Botón: Hotel */}
              <button
                onClick={() => {
                  setTipoProductoFilter('Hotel');
                  goToPage(1);
                }}
                aria-pressed={tipoProductoFilter === 'Hotel'}
                aria-label="Mostrar solo Hotel"
                className={`
                  group relative px-3 sm:px-4 py-2 sm:py-2.5 
                  rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium 
                  transition-all duration-200
                  ${tipoProductoFilter === 'Hotel'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    />
                  </svg>
                  <span className="hidden sm:inline">Hotel</span>
                  <span className="sm:hidden truncate max-w-[70px]">Hotel</span>
                </div>
              </button>
            </div>
          </div>

          {/* Badge de filtros activos */}
          {tipoProductoFilter && (
            <div className="mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filtrando por: {tipoProductoFilter}</span>
                <button
                  onClick={() => setTipoProductoFilter('')}
                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                  aria-label="Quitar filtro"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Lista / Skeleton / Vacío */}
        {isInitialLoading ? (
          renderSkeletonCards()
        ) : filteredMayoristas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 items-stretch [content-visibility:auto] [contain-intrinsic-size:600px_900px]">
              {filteredMayoristas.map((mayorista) => (
                <MayoristaCard
                  key={mayorista.id}
                  mayorista={mayorista}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Paginación */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems || mayoristas.length}
              itemsPerPage={limit}
              onPageChange={goToPage}
            />
          </>
        ) : (
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-500 mb-4 sm:mb-6">
                <FiUsers className="w-10 h-10 sm:w-12 sm:h-12" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 animate-ping"></div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-700 mb-3 sm:mb-4">
                No se encontraron mayoristas
              </h3>

              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base max-w-prose mx-auto">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}".`
                  : tipoFilter
                    ? `No hay mayoristas del tipo "${tipoFilter}".`
                    : "Parece que no hay mayoristas disponibles."}{" "}
                Intenta ajustar los filtros o crear un nuevo mayorista.
              </p>

              {/* Filtros aplicados */}
              {(searchTerm || tipoFilter) && (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl sm:rounded-2xl border border-gray-200">
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
                    {tipoFilter && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Tipo: </span>
                        {tipoFilter}
                      </span>
                    )}
                  </div>
                </div>
              )}

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
                  to="/admin/mayoristas/nuevo"
                  className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="hidden sm:inline">
                      Crear nuevo mayorista
                    </span>
                    <span className="sm:hidden">Crear mayorista</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Diálogo de confirmación */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmDelete}
          title="Mover a papelera"
          message="¿Estás seguro de que quieres mover este mayorista a la papelera? Podrás restaurarlo desde la sección de papelera."
          itemName={confirmDialog.mayoristaName}
          confirmText="Mover a papelera"
          cancelText="Cancelar"
          type="warning"
        />
      </div>
    </div>
  );
};

export default AdminMayoristasPage;
