import {
  useState,
  useEffect,
  useMemo,
  lazy,
  Suspense,
  useDeferredValue,
} from "react";
import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiRotateCcw,
  FiAlertTriangle,
  FiCalendar,
  FiUser,
  FiPackage,
  FiUsers,
  FiClock,
  FiFilter,
  FiX,
  FiSearch,
  FiEye,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiDatabase,
  FiHeart,
  FiActivity,
  FiHome,
  FiPlus,
} from "react-icons/fi";
import { useNotification } from "./AdminLayout";
const OptimizedImage = lazy(
  () => import("../../../components/ui/OptimizedImage"),
);
const PapeleraItemCard = lazy(() => import("../components/PapeleraItemCard"));
const ConfirmDialog = lazy(() => import("../components/ConfirmDialog"));
import Pagination from "../../../components/ui/Pagination";
import usePapelera from "../hooks/usePapelera";

const PapeleraPage = () => {
  const { addNotification } = useNotification();

  // Hook personalizado para gestionar la papelera
  const {
    loading,
    error,
    stats,
    getAllItems,
    restoreItem,
    hardDeleteItem,
    emptyTrash,
    loadDeletedData,
    lastUpdated,
  } = usePapelera();

  // Nuevo: banderas y valores seguros para mostrar UI estable durante loading
  const isLoading = loading;
  const safeStats = {
    isEmpty: stats?.isEmpty ?? false,
    totalPaquetes: stats?.totalPaquetes ?? 0,
    totalMayoristas: stats?.totalMayoristas ?? 0,
    totalUsuarios: stats?.totalUsuarios ?? 0,
    total: stats?.total ?? 0,
  };

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [typeFilter, setTypeFilter] = useState("todos"); // todos, paquetes, mayoristas, usuarios
  const [sortConfig, setSortConfig] = useState({
    key: "eliminadoEn",
    direction: "desc",
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // Nuevo: control de menú de orden
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Estados de modales
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "", // restore, hardDelete, emptyTrash
    itemId: null,
    itemName: "",
    itemType: "", // paquete, mayorista, usuario
  });

  // Combinar y filtrar datos (memoizado)
  const filteredItems = useMemo(() => {
    let allItems = getAllItems();

    if (typeFilter !== "todos") {
      const filterType =
        typeFilter === "paquetes"
          ? "paquete"
          : typeFilter === "mayoristas"
            ? "mayorista"
            : typeFilter === "usuarios"
              ? "usuario"
              : typeFilter.slice(0, -1);
      allItems = allItems.filter((item) => item.type === filterType);
    }

    if (deferredSearch) {
      const term = deferredSearch.toLowerCase();
      allItems = allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(term) ||
          (item.type === "paquete" &&
            item.destinos?.some((d) => d.nombre?.toLowerCase().includes(term))),
      );
    }

    allItems.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "eliminadoEn") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return allItems;
  }, [getAllItems, typeFilter, deferredSearch, sortConfig]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Funciones de acción
  const handleRestore = async (item) => {
    const success = await restoreItem(item.id, item.type);

    if (success) {
      const itemTypeText =
        item.type === "paquete"
          ? "Paquete"
          : item.type === "mayorista"
            ? "Mayorista"
            : "Usuario";
      addNotification(
        `${itemTypeText} "${item.name}" restaurado correctamente`,
        "success",
      );
    } else {
      const itemTypeText =
        item.type === "paquete"
          ? "el paquete"
          : item.type === "mayorista"
            ? "el mayorista"
            : "el usuario";
      addNotification(`Error al restaurar ${itemTypeText}`, "error");
    }

    closeConfirmDialog();
  };

  const handleHardDelete = async (item) => {
    const success = await hardDeleteItem(item.id, item.type);

    if (success) {
      const itemTypeText =
        item.type === "paquete"
          ? "Paquete"
          : item.type === "mayorista"
            ? "Mayorista"
            : "Usuario";
      addNotification(
        `${itemTypeText} "${item.name}" eliminado permanentemente`,
        "success",
      );
    } else {
      const itemTypeText =
        item.type === "paquete"
          ? "el paquete"
          : item.type === "mayorista"
            ? "el mayorista"
            : "el usuario";
      addNotification(
        `Error al eliminar permanentemente ${itemTypeText}`,
        "error",
      );
    }

    closeConfirmDialog();
  };

  const handleEmptyTrash = async () => {
    const success = await emptyTrash();

    if (success) {
      addNotification("Papelera vaciada correctamente", "success");
    } else {
      addNotification("Error al vaciar la papelera", "error");
    }

    closeConfirmDialog();
  };

  const openConfirmDialog = (type, item) => {
    setConfirmDialog({
      isOpen: true,
      type,
      itemId: item?.id ?? null,
      itemName: item?.name ?? "",
      itemType: item?.type ?? "",
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: "",
      itemId: null,
      itemName: "",
      itemType: "",
    });
  };

  const confirmAction = () => {
    if (confirmDialog.type === "emptyTrash") {
      handleEmptyTrash();
      return;
    }

    const item = filteredItems.find((i) => i.id === confirmDialog.itemId);
    if (!item) return;

    if (confirmDialog.type === "restore") {
      handleRestore(item);
    } else if (confirmDialog.type === "hardDelete") {
      handleHardDelete(item);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Nuevo: formato con coma entre fecha y hora, como en el diseño provisto
  const formatDateTime = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    const fecha = d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora = d.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${fecha}, ${hora}`;
  };

  const getDaysUntilPermanentDelete = (dateString) => {
    if (!dateString) return null;
    const deleteDate = new Date(dateString);
    const permanentDeleteDate = new Date(
      deleteDate.getTime() + 14 * 24 * 60 * 60 * 1000,
    ); // 14 días
    const now = new Date();
    const daysLeft = Math.ceil(
      (permanentDeleteDate - now) / (24 * 60 * 60 * 1000),
    );
    return daysLeft > 0 ? daysLeft : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Papelera de Reciclaje
              </h1>
              {isLoading ? (
                <div className="mt-2 h-4 sm:h-5 w-44 sm:w-64 bg-gray-200 rounded animate-pulse mx-auto sm:mx-0" />
              ) : (
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Restaura o elimina permanentemente elementos ({totalItems}{" "}
                  elementos)
                </p>
              )}
              {(!safeStats.isEmpty || isLoading) && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <FiAlertTriangle className="text-orange-500 w-4 h-4" />
                  <span className="text-xs sm:text-sm text-orange-600 font-medium">
                    Los elementos se eliminan automáticamente después de 14 días
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={loadDeletedData}
                disabled={isLoading}
                className="w-full sm:w-auto lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 px-5 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                <FiRefreshCw
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? "animate-spin" : ""}`}
                />
                Actualizar
              </button>

              {!safeStats.isEmpty && (
                <button
                  onClick={() =>
                    setConfirmDialog({
                      isOpen: true,
                      type: "emptyTrash",
                      itemId: null,
                      itemName: "",
                      itemType: "",
                    })
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Vaciar papelera
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sección principal: estadísticas (chips) + búsqueda/controles */}
        {(!safeStats.isEmpty || isLoading) && (
          <div className="bg-gradient-to-br from-white/95 via-purple-50/30 to-blue-50/30 backdrop-blur-sm border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            {/* Búsqueda y controles rápidos */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-purple-400 text-base sm:text-lg" />
                </div>
                <input
                  placeholder="Buscar por nombre o destino..."
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-purple-50/50 font-medium shadow-md focus:shadow-lg transition-all duration-200"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col gap-3">
                {/* Controles móviles */}
                {/* Igual que en AdminMayoristasPage: Filtros y Ordenar */}
                <div className="grid grid-cols-2 gap-2 lg:hidden">
                  <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className={`flex items-center justify-center gap-2 font-medium py-3 px-3 rounded-lg transition text-xs ${
                      isFiltersOpen
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    disabled={isLoading}
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

                {/* Estadísticas móviles (chips) */}
                <div className="grid grid-cols-2 gap-3 lg:hidden">
                  <div
                    className="rounded-xl p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    aria-label="Paquetes"
                  >
                    <div className="flex items-center gap-2">
                      <FiPackage className="w-4 h-4 opacity-95" />
                      <span className="text-xs font-medium">Paquetes</span>
                    </div>
                    {isLoading ? (
                      <div className="mt-1 h-6 w-10 bg-white/40 rounded animate-pulse" />
                    ) : (
                      <div className="mt-1 text-2xl font-extrabold leading-none">
                        {safeStats.totalPaquetes}
                      </div>
                    )}
                  </div>
                  <div
                    className="rounded-xl p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    aria-label="Mayoristas"
                  >
                    <div className="flex items-center gap-2">
                      <FiUsers className="w-4 h-4 opacity-95" />
                      <span className="text-xs font-medium">Mayoristas</span>
                    </div>
                    {isLoading ? (
                      <div className="mt-1 h-6 w-10 bg-white/40 rounded animate-pulse" />
                    ) : (
                      <div className="mt-1 text-2xl font-extrabold leading-none">
                        {safeStats.totalMayoristas}
                      </div>
                    )}
                  </div>
                  <div
                    className="rounded-xl p-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md"
                    aria-label="Usuarios"
                  >
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 opacity-95" />
                      <span className="text-xs font-medium">Usuarios</span>
                    </div>
                    {isLoading ? (
                      <div className="mt-1 h-6 w-10 bg-white/40 rounded animate-pulse" />
                    ) : (
                      <div className="mt-1 text-2xl font-extrabold leading-none">
                        {safeStats.totalUsuarios}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controles desktop + chips alineados como en AdminMayoristasPage */}
                <div className="hidden lg:flex lg:items-center lg:justify-between">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className={`flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-xl transition text-sm ${
                        isFiltersOpen
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                      disabled={isLoading}
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
                      <FiPackage className="w-4 h-4" />
                      <span className="font-bold">
                        {isLoading ? (
                          <span className="inline-block h-4 w-6 bg-white/40 rounded animate-pulse" />
                        ) : (
                          safeStats.totalPaquetes
                        )}
                      </span>
                      <span>paquetes</span>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                      <FiUsers className="w-4 h-4" />
                      <span className="font-bold">
                        {isLoading ? (
                          <span className="inline-block h-4 w-6 bg-white/40 rounded animate-pulse" />
                        ) : (
                          safeStats.totalMayoristas
                        )}
                      </span>
                      <span>mayoristas</span>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                      <FiUser className="w-4 h-4" />
                      <span className="font-bold">
                        {isLoading ? (
                          <span className="inline-block h-4 w-6 bg-white/40 rounded animate-pulse" />
                        ) : (
                          safeStats.totalUsuarios
                        )}
                      </span>
                      <span>usuarios</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menú de ordenamiento (como en AdminMayoristasPage) */}
              {isSortMenuOpen && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                        sortConfig.key === "eliminadoEn"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleSort("eliminadoEn")}
                    >
                      <span>Fecha de eliminación</span>
                      {sortConfig.key === "eliminadoEn" &&
                        (sortConfig.direction === "asc" ? (
                          <FiArrowUp className="w-3 h-3" />
                        ) : (
                          <FiArrowDown className="w-3 h-3" />
                        ))}
                    </button>
                    <button
                      className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                        sortConfig.key === "name"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleSort("name")}
                    >
                      <span>Nombre</span>
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <FiArrowUp className="w-3 h-3" />
                        ) : (
                          <FiArrowDown className="w-3 h-3" />
                        ))}
                    </button>
                    <button
                      className={`px-3 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm ${
                        sortConfig.key === "type"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleSort("type")}
                    >
                      <span>Tipo</span>
                      {sortConfig.key === "type" &&
                        (sortConfig.direction === "asc" ? (
                          <FiArrowUp className="w-3 h-3" />
                        ) : (
                          <FiArrowDown className="w-3 h-3" />
                        ))}
                    </button>
                  </div>
                </div>
              )}

              {/* Filtros (panel desplegable) */}
              {isFiltersOpen && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-white via-purple-50/40 to-blue-50/40 rounded-lg sm:rounded-xl lg:rounded-2xl border border-purple-100">
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
                    {/* Filtro por tipo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                        <FiTrash2 className="inline w-4 h-4 mr-1" />
                        Tipo de Elemento
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                      >
                        <option value="todos">Todos los elementos</option>
                        <option value="paquetes">Solo paquetes</option>
                        <option value="mayoristas">Solo mayoristas</option>
                        <option value="usuarios">Solo usuarios</option>
                      </select>
                    </div>

                    {/* Filtro por ordenamiento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 lg:mb-3">
                        <FiArrowUp className="inline w-4 h-4 mr-1" />
                        Ordenar por
                      </label>
                      <select
                        value={`${sortConfig.key}-${sortConfig.direction}`}
                        onChange={(e) => {
                          const [key, direction] = e.target.value.split("-");
                          setSortConfig({ key, direction });
                        }}
                        className="w-full px-3 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                      >
                        <option value="eliminadoEn-desc">Más recientes</option>
                        <option value="eliminadoEn-asc">Más antiguos</option>
                        <option value="name-asc">Nombre (A-Z)</option>
                        <option value="name-desc">Nombre (Z-A)</option>
                        <option value="type-asc">Tipo (A-Z)</option>
                        <option value="type-desc">Tipo (Z-A)</option>
                      </select>
                    </div>
                  </div>

                  {/* Botones de acción de filtros */}
                  <div className="flex flex-col lg:flex-row justify-between items-center pt-4 lg:pt-6 gap-3 lg:gap-4 border-t border-gray-200 mt-4 lg:mt-6">
                    <div className="text-sm lg:text-base text-gray-600 order-2 lg:order-1 text-center lg:text-left">
                      {isLoading ? (
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto lg:mx-0" />
                      ) : (
                        <>
                          <span className="font-semibold text-blue-600">
                            {filteredItems.length}
                          </span>
                          <span>
                            {" "}
                            elemento{filteredItems.length !== 1 ? "s" : ""}{" "}
                            encontrado{filteredItems.length !== 1 ? "s" : ""}
                          </span>
                          <span className="text-gray-500 ml-2">
                            de {getAllItems().length} total
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-3 lg:gap-4 order-1 lg:order-2 w-full lg:w-auto">
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setTypeFilter("todos");
                          setSortConfig({
                            key: "eliminadoEn",
                            direction: "desc",
                          });
                          setIsFiltersOpen(false);
                        }}
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
          </div>
        )}

        {/* Filtros Rápidos */}
        {(!safeStats.isEmpty || isLoading) && (
          <section
            className="bg-gradient-to-r from-white via-gray-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6"
            aria-labelledby="filtros-rapidos"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                <h2
                  id="filtros-rapidos"
                  className="text-xs sm:text-sm font-semibold text-gray-800"
                >
                  Filtros Rápidos
                </h2>
              </div>

              <div
                className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
                role="group"
                aria-labelledby="filtros-rapidos"
              >
                {/* Primer chip a la izquierda con contador (Total) */}
                <button
                  onClick={() => setTypeFilter("todos")}
                  aria-pressed={typeFilter === "todos"}
                  aria-label="Mostrar todos los elementos eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === "todos"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">
                      Todos los Elementos
                    </span>
                    <span className="sm:hidden">Todos</span>
                  </div>
                </button>

                {/* Resto de chips sin contador */}
                <button
                  onClick={() => setTypeFilter("paquetes")}
                  aria-pressed={typeFilter === "paquetes"}
                  aria-label="Filtrar por paquetes eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === "paquetes"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiPackage className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Paquetes</span>
                  </div>
                </button>

                <button
                  onClick={() => setTypeFilter("mayoristas")}
                  aria-pressed={typeFilter === "mayoristas"}
                  aria-label="Filtrar por mayoristas eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === "mayoristas"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Mayoristas</span>
                  </div>
                </button>

                <button
                  onClick={() => setTypeFilter("usuarios")}
                  aria-pressed={typeFilter === "usuarios"}
                  aria-label="Filtrar por usuarios eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === "usuarios"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 border border-gray-200 hover:border-yellow-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Usuarios</span>
                  </div>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Lista / Estado vacío / Paginación */}
        {isLoading ? (
          // Skeleton list: solo contenedor estable para evitar CLS y trabajar menos en primer render
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 [content-visibility:auto] [contain-intrinsic-size:600px_900px]">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 animate-pulse min-h-[220px]"
              />
            ))}
          </div>
        ) : totalItems === 0 ? (
          // Estado vacío
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              {/* Icono central con animación */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 mb-4 sm:mb-6">
                <FiTrash2 className="w-10 h-10 sm:w-12 sm:h-12" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 animate-ping"></div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                ¡Papelera vacía!
              </h3>

              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                No hay elementos en la papelera. Todos los paquetes, mayoristas
                y usuarios están en su lugar correcto.
              </p>

              {/* Botón de acción */}
              <div className="flex justify-center">
                <Link
                  to="/admin"
                  className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="hidden sm:inline">
                      Volver al Dashboard
                    </span>
                    <span className="sm:hidden">Dashboard</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 animate-pulse min-h-[220px]"
                    />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 [content-visibility:auto] [contain-intrinsic-size:600px_900px]">
                {currentItems.map((item) => (
                  <PapeleraItemCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onRestore={(item) => openConfirmDialog("restore", item)}
                    onHardDelete={(item) =>
                      openConfirmDialog("hardDelete", item)
                    }
                    formatDate={formatDate}
                    getDaysUntilPermanentDelete={getDaysUntilPermanentDelete}
                  />
                ))}
              </div>
            </Suspense>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Diálogo de confirmación */}
      <Suspense fallback={null}>
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmAction}
          title={
            confirmDialog.type === "restore"
              ? "Restaurar elemento"
              : confirmDialog.type === "emptyTrash"
                ? "Vaciar papelera"
                : "Eliminar permanentemente"
          }
          message={
            confirmDialog.type === "restore"
              ? `¿Estás seguro de que quieres restaurar ${
                  confirmDialog.itemType === "paquete"
                    ? "el paquete"
                    : confirmDialog.itemType === "mayorista"
                      ? "el mayorista"
                      : "el usuario"
                } "${confirmDialog.itemName}"?`
              : confirmDialog.type === "emptyTrash"
                ? `¿Estás seguro de que quieres vaciar TODA la papelera? Se eliminarán permanentemente ${safeStats.total} elementos. Esta acción no se puede deshacer.`
                : `¿Estás seguro de que quieres eliminar PERMANENTEMENTE ${
                    confirmDialog.itemType === "paquete"
                      ? "el paquete"
                      : confirmDialog.itemType === "mayorista"
                        ? "el mayorista"
                        : "el usuario"
                  } "${confirmDialog.itemName}"? Esta acción no se puede deshacer.`
          }
          itemName={
            confirmDialog.type === "emptyTrash"
              ? "Papelera completa"
              : confirmDialog.itemName
          }
          confirmText={
            confirmDialog.type === "restore"
              ? "Restaurar"
              : confirmDialog.type === "emptyTrash"
                ? "Vaciar papelera"
                : "Eliminar permanentemente"
          }
          cancelText="Cancelar"
          type={confirmDialog.type === "restore" ? "success" : "danger"}
        />
      </Suspense>
    </div>
  );
};

export default PapeleraPage;
