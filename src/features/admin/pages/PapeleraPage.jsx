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
  const [typeFilter, setTypeFilter] = useState("todos"); // todos, paquetes, mayoristas
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
    itemType: "", // paquete, mayorista
  });

  // Combinar y filtrar datos
  const getFilteredItems = () => {
    let allItems = getAllItems();
    
    // Filtrar por tipo
    if (typeFilter !== "todos") {
      allItems = allItems.filter(item => item.type === typeFilter.slice(0, -1)); // remove 's' from 'paquetes'/'mayoristas'
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
      addNotification(
        `${item.type === "paquete" ? "Paquete" : "Mayorista"} "${item.name}" restaurado correctamente`,
        "success"
      );
    } else {
      addNotification(
        `Error al restaurar ${item.type === "paquete" ? "el paquete" : "el mayorista"}`,
        "error"
      );
    }
    
    closeConfirmDialog();
  };

  const handleHardDelete = async (item) => {
    const success = await hardDeleteItem(item.id, item.type);
    
    if (success) {
      addNotification(
        `${item.type === "paquete" ? "Paquete" : "Mayorista"} "${item.name}" eliminado permanentemente`,
        "success"
      );
    } else {
      addNotification(
        `Error al eliminar permanentemente ${item.type === "paquete" ? "el paquete" : "el mayorista"}`,
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
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
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
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="text-center sm:text-left lg:text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                Papelera de Reciclaje
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Restaura o elimina permanentemente elementos ({totalItems} elementos)
              </p>
              {totalItems > 0 && (
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
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Vaciar papelera
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas y controles */}
        {!stats.isEmpty && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            {/* Estadísticas compactas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-red-600 text-xs sm:text-sm font-medium mb-1">Total</div>
                <div className="text-red-700 text-lg sm:text-xl font-bold">{stats.total}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-blue-600 text-xs sm:text-sm font-medium mb-1">Paquetes</div>
                <div className="text-blue-700 text-lg sm:text-xl font-bold">{stats.totalPaquetes}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-green-600 text-xs sm:text-sm font-medium mb-1">Mayoristas</div>
                <div className="text-green-700 text-lg sm:text-xl font-bold">{stats.totalMayoristas}</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-purple-600 text-xs sm:text-sm font-medium mb-1">Actualizado</div>
                <div className="text-purple-700 text-xs sm:text-sm font-semibold">
                  {lastUpdated ? new Date(lastUpdated).toLocaleDateString("es-ES") : "Cargando..."}
                </div>
              </div>
            </div>
            
            {/* Búsqueda y filtros */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-base sm:text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="todos">Todos los elementos</option>
                  <option value="paquetes">Solo paquetes</option>
                  <option value="mayoristas">Solo mayoristas</option>
                </select>
                
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-medium transition-all ${
                    isFiltersOpen 
                      ? "bg-red-100 text-red-700 border-2 border-red-300" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300"
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
                        sortConfig.key === "eliminadoEn" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                        sortConfig.key === "name" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                        sortConfig.key === "type" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                No hay elementos en la papelera. Todos los paquetes y mayoristas están en su lugar correcto.
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
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 text-red-500 mb-4 sm:mb-6">
                <FiSearch className="w-10 h-10 sm:w-12 sm:h-12" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 animate-ping"></div>
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
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl sm:rounded-2xl border border-gray-200">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    FILTROS APLICADOS
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {searchTerm && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Búsqueda: "</span>
                        {searchTerm}
                        <span className="hidden sm:inline">"</span>
                      </span>
                    )}
                    {typeFilter !== "todos" && (
                      <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs rounded-lg sm:rounded-xl font-medium shadow-md">
                        <span className="hidden sm:inline">Tipo: </span>
                        {typeFilter === "paquetes" ? "Paquetes" : "Mayoristas"}
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
            ? `¿Estás seguro de que quieres restaurar ${confirmDialog.itemType === "paquete" ? "el paquete" : "el mayorista"} "${confirmDialog.itemName}"?`
            : confirmDialog.type === "emptyTrash"
            ? `¿Estás seguro de que quieres vaciar TODA la papelera? Se eliminarán permanentemente ${stats.total} elementos. Esta acción no se puede deshacer.`
            : `¿Estás seguro de que quieres eliminar PERMANENTEMENTE ${confirmDialog.itemType === "paquete" ? "el paquete" : "el mayorista"} "${confirmDialog.itemName}"? Esta acción no se puede deshacer.`
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
