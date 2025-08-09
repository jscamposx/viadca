import { useState, useEffect } from "react";
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
import OptimizedImage from "../../../components/ui/OptimizedImage";
import { getImageUrl } from "../../../utils/imageUtils";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../../../components/ui/Pagination";
import PapeleraItemCard from "../components/PapeleraItemCard";
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
  
  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos"); // todos, paquetes, mayoristas, usuarios
  const [sortConfig, setSortConfig] = useState({ key: "eliminadoEn", direction: "desc" });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
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

  // Combinar y filtrar datos
  const getFilteredItems = () => {
    let allItems = getAllItems();
    
    // Filtrar por tipo
    if (typeFilter !== "todos") {
      const filterType = typeFilter === "paquetes" ? "paquete" 
                       : typeFilter === "mayoristas" ? "mayorista"
                       : typeFilter === "usuarios" ? "usuario"
                       : typeFilter.slice(0, -1); // fallback
      allItems = allItems.filter(item => item.type === filterType);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      allItems = allItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.type === "paquete" && item.destinos?.some(d => 
          d.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }
    
    // Ordenar
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
  };

  const filteredItems = getFilteredItems();
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Funciones de acción
  const handleRestore = async (item) => {
    const success = await restoreItem(item.id, item.type);
    
    if (success) {
      const itemTypeText = item.type === "paquete" ? "Paquete" : 
                          item.type === "mayorista" ? "Mayorista" : "Usuario";
      addNotification(
        `${itemTypeText} "${item.name}" restaurado correctamente`,
        "success"
      );
    } else {
      const itemTypeText = item.type === "paquete" ? "el paquete" : 
                          item.type === "mayorista" ? "el mayorista" : "el usuario";
      addNotification(
        `Error al restaurar ${itemTypeText}`,
        "error"
      );
    }
    
    closeConfirmDialog();
  };

  const handleHardDelete = async (item) => {
    const success = await hardDeleteItem(item.id, item.type);
    
    if (success) {
      const itemTypeText = item.type === "paquete" ? "Paquete" : 
                          item.type === "mayorista" ? "Mayorista" : "Usuario";
      addNotification(
        `${itemTypeText} "${item.name}" eliminado permanentemente`,
        "success"
      );
    } else {
      const itemTypeText = item.type === "paquete" ? "el paquete" : 
                          item.type === "mayorista" ? "el mayorista" : "el usuario";
      addNotification(
        `Error al eliminar permanentemente ${itemTypeText}`,
        "error"
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
      itemId: item.id,
      itemName: item.name,
      itemType: item.type,
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
    
    const item = filteredItems.find(i => i.id === confirmDialog.itemId);
    if (!item) return;
    
    if (confirmDialog.type === "restore") {
      handleRestore(item);
    } else if (confirmDialog.type === "hardDelete") {
      handleHardDelete(item);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
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
      minute: "2-digit"
    });
  };

  const getDaysUntilPermanentDelete = (dateString) => {
    if (!dateString) return null;
    const deleteDate = new Date(dateString);
    const permanentDeleteDate = new Date(deleteDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 días
    const now = new Date();
    const daysLeft = Math.ceil((permanentDeleteDate - now) / (24 * 60 * 60 * 1000));
    return daysLeft > 0 ? daysLeft : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Cargando papelera...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Papelera de Reciclaje
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Restaura o elimina permanentemente elementos ({totalItems} elementos)
              </p>
              {!stats.isEmpty && (
                <div className="flex items-center gap-2 mt-2">
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
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? "animate-spin" : ""}`} />
                Actualizar
              </button>
              
              {!stats.isEmpty && (
                <button
                  onClick={() => setConfirmDialog({
                    isOpen: true,
                    type: "emptyTrash",
                    itemId: null,
                    itemName: "",
                    itemType: "",
                  })}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Vaciar papelera
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros Rápidos */}
        {!stats.isEmpty && (
          <section className="bg-gradient-to-r from-white via-gray-50 to-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-5 mb-4 sm:mb-6" aria-labelledby="filtros-rapidos">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1 h-4 sm:h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                <h2 id="filtros-rapidos" className="text-xs sm:text-sm font-semibold text-gray-800">Filtros Rápidos</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3" role="group" aria-labelledby="filtros-rapidos">
                <button
                  onClick={() => setTypeFilter('paquetes')}
                  aria-pressed={typeFilter === 'paquetes'}
                  aria-label="Filtrar por paquetes eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === 'paquetes'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiPackage className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Paquetes ({stats.totalPaquetes})</span>
                    <span className="sm:hidden">Paquetes</span>
                  </div>
                </button>

                <button
                  onClick={() => setTypeFilter('mayoristas')}
                  aria-pressed={typeFilter === 'mayoristas'}
                  aria-label="Filtrar por mayoristas eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === 'mayoristas'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Mayoristas ({stats.totalMayoristas})</span>
                    <span className="sm:hidden">Mayoristas</span>
                  </div>
                </button>

                <button
                  onClick={() => setTypeFilter('usuarios')}
                  aria-pressed={typeFilter === 'usuarios'}
                  aria-label="Filtrar por usuarios eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === 'usuarios'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Usuarios ({stats.totalUsuarios || 0})</span>
                    <span className="sm:hidden">Usuarios</span>
                  </div>
                </button>

                <button
                  onClick={() => setTypeFilter('todos')}
                  aria-pressed={typeFilter === 'todos'}
                  aria-label="Mostrar todos los elementos eliminados"
                  className={`group relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    typeFilter === 'todos'
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Todos los Elementos ({stats.total})</span>
                    <span className="sm:hidden">Todos</span>
                  </div>
                </button>
              </div>

              {/* Filtros adicionales por orden */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <FiClock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Ordenar por:</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSort('eliminadoEn')}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      sortConfig.key === 'eliminadoEn'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200'
                    } hover:shadow-md`}
                    title="Ordenar por fecha de eliminación"
                  >
                    <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Fecha Eliminación</span>
                    {sortConfig.key === 'eliminadoEn' && (
                      sortConfig.direction === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSort('name')}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      sortConfig.key === 'name'
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200'
                    } hover:shadow-md`}
                    title="Ordenar por nombre"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Nombre A-Z</span>
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Estadísticas y controles */}
        {!stats.isEmpty && (
          <div className="bg-gradient-to-br from-white/95 via-purple-50/30 to-blue-50/30 backdrop-blur-sm border border-white/40 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            {/* Estadísticas compactas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border border-indigo-200 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-1.5 rounded-lg">
                    <FiTrash2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-indigo-700 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">Total</div>
                <div className="text-slate-800 text-lg sm:text-xl font-bold">{stats.total}</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 border border-teal-200 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-1.5 rounded-lg">
                    <FiPackage className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-teal-700 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">Paquetes</div>
                <div className="text-slate-800 text-lg sm:text-xl font-bold">{stats.totalPaquetes}</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 border border-teal-200 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-1.5 rounded-lg">
                    <FiUsers className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-teal-700 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">Mayoristas</div>
                <div className="text-slate-800 text-lg sm:text-xl font-bold">{stats.totalMayoristas}</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-teal-100 border border-teal-200 rounded-xl p-3 sm:p-4 text-center hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-1.5 rounded-lg">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-teal-700 text-xs sm:text-sm font-semibold mb-1 uppercase tracking-wide">Usuarios</div>
                <div className="text-slate-800 text-lg sm:text-xl font-bold">{stats.totalUsuarios || 0}</div>
              </div>
            </div>
            
            {/* Información de actualización */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3 sm:p-4 mb-4">
              <div className="flex items-center gap-2 text-purple-700">
                <FiClock className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Última actualización: {lastUpdated ? new Date(lastUpdated).toLocaleDateString("es-ES") : "Cargando..."}
                </span>
              </div>
            </div>
            
            {/* Búsqueda y filtros */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-purple-400 text-base sm:text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-purple-50/50 font-medium shadow-md focus:shadow-lg transition-all duration-200"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  <option value="todos">Todos los elementos</option>
                  <option value="paquetes">Solo paquetes</option>
                  <option value="mayoristas">Solo mayoristas</option>
                  <option value="usuarios">Solo usuarios</option>
                </select>
                
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-medium transition-all border ${
                    isFiltersOpen 
                      ? "bg-blue-100 text-blue-700 border-blue-300" 
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Ordenar</span>
                  {sortConfig.direction === "asc" ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Panel de ordenamiento */}
              {isFiltersOpen && (
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSort("eliminadoEn")}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                        sortConfig.key === "eliminadoEn" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <FiCalendar className="w-4 h-4" />
                      Fecha eliminación
                      {sortConfig.key === "eliminadoEn" && (
                        sortConfig.direction === "asc" ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleSort("name")}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                        sortConfig.key === "name" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Nombre
                      {sortConfig.key === "name" && (
                        sortConfig.direction === "asc" ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleSort("type")}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                        sortConfig.key === "type" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Tipo
                      {sortConfig.key === "type" && (
                        sortConfig.direction === "asc" ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {stats.isEmpty && (
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200 mb-4 sm:mb-6">
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
                No hay elementos en la papelera. Todos los paquetes, mayoristas y usuarios están en su lugar correcto.
              </p>

              {/* Botón de acción */}
              <div className="flex justify-center">
                <Link
                  to="/admin"
                  className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="hidden sm:inline">Volver al Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Lista de elementos */}
        {currentItems.length === 0 && !stats.isEmpty ? (
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              {/* Icono central con animación */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 mb-4 sm:mb-6">
                <FiSearch className="w-10 h-10 sm:w-12 sm:h-12" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 animate-ping"></div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                No se encontraron elementos
              </h3>

              <p className="text-gray-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                {searchTerm
                  ? `No hay resultados para "${searchTerm}".`
                  : typeFilter !== "todos"
                    ? `No hay ${typeFilter} en la papelera.`
                    : "No hay elementos que coincidan con los filtros aplicados."}{" "}
                Intenta ajustar los filtros o volver al dashboard.
              </p>

              {/* Filtros aplicados */}
              {(searchTerm || typeFilter !== "todos") && (
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
                    {typeFilter !== "todos" && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Tipo: </span>
                        {typeFilter === "paquetes" ? "Paquetes" : 
                         typeFilter === "mayoristas" ? "Mayoristas" : 
                         typeFilter === "usuarios" ? "Usuarios" : "Todos"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("todos");
                    setSortConfig({ key: "eliminadoEn", direction: "desc" });
                  }}
                  className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="hidden sm:inline">Limpiar filtros</span>
                    <span className="sm:hidden">Limpiar</span>
                  </span>
                </button>

                <Link
                  to="/admin"
                  className="group px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="hidden sm:inline">Volver al Dashboard</span>
                    <span className="sm:hidden">Dashboard</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          currentItems.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentItems.map((item) => (
                  <PapeleraItemCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onRestore={(item) => openConfirmDialog("restore", item)}
                    onHardDelete={(item) => openConfirmDialog("hardDelete", item)}
                    formatDate={formatDate}
                    getDaysUntilPermanentDelete={getDaysUntilPermanentDelete}
                  />
                ))}
              </div>
              
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
          )
        )}
      </div>

      {/* Diálogo de confirmación */}
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
                confirmDialog.itemType === "paquete" ? "el paquete" : 
                confirmDialog.itemType === "mayorista" ? "el mayorista" : "el usuario"
              } "${confirmDialog.itemName}"?`
            : confirmDialog.type === "emptyTrash"
            ? `¿Estás seguro de que quieres vaciar TODA la papelera? Se eliminarán permanentemente ${stats.total} elementos. Esta acción no se puede deshacer.`
            : `¿Estás seguro de que quieres eliminar PERMANENTEMENTE ${
                confirmDialog.itemType === "paquete" ? "el paquete" : 
                confirmDialog.itemType === "mayorista" ? "el mayorista" : "el usuario"
              } "${confirmDialog.itemName}"? Esta acción no se puede deshacer.`
        }
        itemName={confirmDialog.type === "emptyTrash" ? "Papelera completa" : confirmDialog.itemName}
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
    </div>
  );
};

export default PapeleraPage;
