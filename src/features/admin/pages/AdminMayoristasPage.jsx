import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMayoristas } from "../hooks/useMayoristas";
import {
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiX,
  FiUsers,
  FiCalendar,
  FiTag,
  FiActivity,
  FiSettings,
} from "react-icons/fi";
import api from "../../../api";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNotification } from "./AdminLayout";

const AdminMayoristasPage = () => {
  const { mayoristas, setMayoristas, loading, error, deleteMayorista } =
    useMayoristas();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMayoristas, setFilteredMayoristas] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "nombre",
    direction: "asc",
  });
  const [tipoFilter, setTipoFilter] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    mayoristaId: null,
    mayoristaName: "",
  });
  const { addNotification } = useNotification();

  const handleDelete = (mayoristaId, mayoristaName) => {
    setConfirmDialog({
      isOpen: true,
      mayoristaId: mayoristaId,
      mayoristaName: mayoristaName,
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteMayorista(confirmDialog.mayoristaId);
      addNotification("Mayorista eliminado correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar mayorista:", error);
      addNotification("Error al eliminar el mayorista", "error");
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
    setTipoFilter("");
    setSortConfig({ key: "nombre", direction: "asc" });
  };

  useEffect(() => {
    // Asegurar que mayoristas sea un array antes de proceder
    if (!Array.isArray(mayoristas)) {
      setFilteredMayoristas([]);
      return;
    }

    let filtered = [...mayoristas];

    if (searchTerm) {
      filtered = filtered.filter(
        (mayorista) =>
          mayorista.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mayorista.clave?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mayorista.tipo_producto
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (tipoFilter) {
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

    setFilteredMayoristas(filtered);
  }, [mayoristas, searchTerm, tipoFilter, sortConfig]);

  const tiposUnicos = [
    ...new Set((mayoristas || []).map((m) => m.tipo_producto)),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Cargando mayoristas...
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
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                Gestión de Mayoristas
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Administra todos tus mayoristas en un solo lugar (
                {mayoristas.length} total)
              </p>
            </div>

            <Link
              to="/admin/mayoristas/nuevo"
              className="w-full sm:w-auto lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nuevo Mayorista</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Barra de búsqueda */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-base sm:text-lg" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, clave o tipo de producto..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 font-medium"
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

              {/* Estadísticas - Solo en móvil */}
              <div className="grid grid-cols-2 gap-2 lg:hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-3 rounded-lg font-medium text-xs flex items-center justify-center gap-1 shadow-md">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="font-bold">{filteredMayoristas.length}</span>
                  <span>may.</span>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-3 rounded-lg font-medium text-xs flex items-center justify-center gap-1 shadow-md">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="font-bold">{tiposUnicos.length}</span>
                  <span>tipos</span>
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
                      {filteredMayoristas.length}
                    </span>
                    <span>mayoristas</span>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md">
                    <FiTag className="w-4 h-4" />
                    <span className="font-bold">{tiposUnicos.length}</span>
                    <span>tipos</span>
                  </div>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              {(searchTerm || tipoFilter) && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 font-medium py-2.5 px-4 rounded-lg sm:rounded-xl transition-all duration-200 text-sm border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md"
                >
                  <FiX className="w-4 h-4" />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>
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
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 lg:p-6 bg-gray-50 rounded-lg sm:rounded-xl lg:rounded-2xl">
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
                    de {mayoristas.length} total
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

        {/* Filtros Rápidos - Mejorado para móvil */}
        <section
          className="bg-gradient-to-r from-white via-gray-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6"
          aria-labelledby="filtros-rapidos-mayoristas"
        >
          <div className="space-y-3 sm:space-y-4">
            {/* Header de filtros */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
              <h2
                id="filtros-rapidos-mayoristas"
                className="text-xs sm:text-sm font-semibold text-gray-800"
              >
                Filtros Rápidos
              </h2>
            </div>

            {/* Filtros principales */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
              role="group"
              aria-labelledby="filtros-rapidos-mayoristas"
            >
              <button
                onClick={() => {
                  setTipoFilter("");
                  setIsFiltersOpen(false);
                }}
                aria-pressed={!tipoFilter}
                aria-label="Mostrar todos los mayoristas sin filtros"
                className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  !tipoFilter
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Todos los Mayoristas</span>
                  <span className="sm:hidden">Todos</span>
                </div>
              </button>
            </div>

            {/* Filtros por tipo de producto - Completo para desktop, simplificado para móvil */}
            {tiposUnicos && tiposUnicos.length > 0 && (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <FiTag className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Filtrar por Tipo:
                  </span>
                </div>

                {/* Versión móvil - limitada */}
                <div
                  className="grid grid-cols-2 gap-2 lg:hidden"
                  role="group"
                  aria-label="Filtros por tipo de producto - versión móvil"
                >
                  {tiposUnicos.slice(0, 3).map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setTipoFilter(tipo);
                        setIsFiltersOpen(false);
                      }}
                      aria-pressed={tipoFilter === tipo}
                      aria-label={`Filtrar por tipo: ${tipo}`}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 truncate ${
                        tipoFilter === tipo
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 hover:border-orange-200"
                      }`}
                      title={tipo}
                    >
                      {tipo.length > 12 ? `${tipo.substring(0, 12)}...` : tipo}
                    </button>
                  ))}
                  {tiposUnicos.length > 3 && (
                    <button
                      onClick={() => setIsFiltersOpen(true)}
                      aria-label={`Ver ${tiposUnicos.length - 3} tipos de producto adicionales`}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-300 col-span-2"
                    >
                      +{tiposUnicos.length - 3} más
                    </button>
                  )}
                </div>

                {/* Versión desktop - completa */}
                <div
                  className="hidden lg:grid lg:grid-cols-4 lg:gap-3"
                  role="group"
                  aria-label="Filtros por tipo de producto - versión desktop"
                >
                  {tiposUnicos.map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => {
                        setTipoFilter(tipo);
                        setIsFiltersOpen(false);
                      }}
                      aria-pressed={tipoFilter === tipo}
                      aria-label={`Filtrar por tipo: ${tipo}`}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        tipoFilter === tipo
                          ? "bg-orange-500 text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 hover:border-orange-200 hover:shadow-md"
                      }`}
                      title={tipo}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          tipoFilter === tipo ? "bg-white" : "bg-orange-500"
                        }`}
                      ></div>
                      <span className="truncate">{tipo}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón para limpiar filtros */}
            {(searchTerm || tipoFilter) && (
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

        {filteredMayoristas.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 items-stretch">
            {filteredMayoristas.map((mayorista) => (
              <div
                key={mayorista.id}
                className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
              >
                {/* Header de la tarjeta */}
                <div className="relative p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <FiUsers className="text-white text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-200">
                        {mayorista.nombre}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/80 text-purple-700 shadow-sm">
                          {mayorista.clave}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                  {/* Información en cards pequeñas */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-orange-50 hover:bg-orange-100 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                      <FiTag className="w-4 h-4 text-orange-500 mx-auto mb-1 transition-transform duration-200" />
                      <div
                        className="text-xs text-orange-700 font-medium truncate"
                        title={mayorista.tipo_producto}
                      >
                        {mayorista.tipo_producto || "Sin tipo"}
                      </div>
                    </div>

                    <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-3 text-center transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">
                      <FiCalendar className="w-4 h-4 text-blue-500 mx-auto mb-1 transition-transform duration-200" />
                      <div className="text-xs text-blue-700 font-medium">
                        {mayorista.created_at
                          ? new Date(mayorista.created_at).toLocaleDateString(
                              "es-MX",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        INFORMACIÓN
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Tipo:</span>
                          <span className="text-sm font-medium text-gray-900 truncate ml-2">
                            {mayorista.tipo_producto || "No especificado"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Creado:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {mayorista.created_at
                              ? new Date(
                                  mayorista.created_at,
                                ).toLocaleDateString("es-MX")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción - Siempre en la parte inferior */}
                  <div className="space-y-2">
                    {/* Fila principal */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Editar */}
                      <Link
                        to={`/admin/mayoristas/editar/${mayorista.id}`}
                        className="grupo/editar flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                        title="Editar mayorista"
                      >
                        <FiEdit2 className="w-4 h-4 grupo-hover/editar:scale-110 grupo-hover/editar:rotate-45 transition-all duration-300" />
                        <span className="grupo-hover/editar:tracking-wide transition-all duration-200">
                          Editar
                        </span>
                      </Link>

                      {/* Eliminar */}
                      <button
                        onClick={() =>
                          handleDelete(mayorista.id, mayorista.nombre)
                        }
                        className="grupo/eliminar flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-xl hover:scale-105 transform hover:-translate-y-1"
                        title="Eliminar mayorista"
                      >
                        <FiTrash2 className="w-4 h-4 grupo-hover/eliminar:scale-125 grupo-hover/eliminar:rotate-12 transition-all duration-300" />
                        <span className="grupo-hover/eliminar:font-bold transition-all duration-200">
                          Eliminar
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              {/* Icono central con animación */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-500 mb-4 sm:mb-6">
                <FiUsers className="w-10 h-10 sm:w-12 sm:h-12" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 animate-ping"></div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                No se encontraron mayoristas
              </h3>

              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
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
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Tipo: </span>
                        {tipoFilter}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
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
          title="Eliminar mayorista"
          message="¿Estás seguro de que quieres eliminar este mayorista?"
          itemName={confirmDialog.mayoristaName}
          confirmText="Eliminar mayorista"
          cancelText="Cancelar"
          type="danger"
        />
      </div>
    </div>
  );
};

export default AdminMayoristasPage;
