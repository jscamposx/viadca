// === Versión LIMPIA reconstruida ===
import { useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiRefreshCw, FiSearch, FiHome } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";
import Pagination from "../../../components/ui/Pagination";
import usePapelera from "../hooks/usePapelera";
import AdminHeaderCard from "../components/AdminHeaderCard";

const PapeleraItemCard = lazy(() => import("../components/PapeleraItemCard"));
const ConfirmDialog = lazy(() => import("../components/ConfirmDialog"));

const ITEMS_PER_PAGE = 12;

const PapeleraPage = () => {
  const { notify } = useNotifications();
  const {
    loading,
    stats,
    getAllItems,
    restoreItem,
    hardDeleteItem,
    emptyTrash,
    loadDeletedData,
  } = usePapelera();

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [sortConfig, setSortConfig] = useState({ key: "eliminadoEn", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "",
    itemId: null,
    itemName: "",
    itemType: "",
  });

  const safeStats = stats || { total: 0, isEmpty: true };
  const isLoading = loading;

  // Data derivada
  const allItems = useMemo(() => getAllItems(), [getAllItems]);

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (typeFilter !== "todos") items = items.filter((i) => i.type === typeFilter.slice(0, -1)); // 'paquetes' -> 'paquete'
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      items = items.filter((i) => i.name?.toLowerCase().includes(t));
    }
    // sort
    items = [...items].sort((a, b) => {
      const { key, direction } = sortConfig;
      let av = a[key];
      let bv = b[key];
      if (key === "eliminadoEn") {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
      } else {
        av = (av || "").toString().toLowerCase();
        bv = (bv || "").toString().toLowerCase();
      }
      if (av < bv) return direction === "asc" ? -1 : 1;
      if (av > bv) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return items;
  }, [allItems, typeFilter, searchTerm, sortConfig]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Helpers
  const openConfirmDialog = (type, item) => {
    setConfirmDialog({
      isOpen: true,
      type,
      itemId: item?.id ?? null,
      itemName: item?.name ?? "",
      itemType: item?.type ?? "",
    });
  };
  const closeConfirmDialog = () => setConfirmDialog((d) => ({ ...d, isOpen: false }));

  const handleRestore = async (item) => {
    await notify.operation(
      async () => {
        const ok = await restoreItem(item.id, item.type);
        if (!ok) throw new Error("No se pudo restaurar");
      },
      {
        loadingMessage: "Restaurando...",
        successMessage: "Elemento restaurado",
        errorMessage: "Error al restaurar",
        loadingTitle: "Restaurando",
        successTitle: "Restaurado",
        errorTitle: "Error",
      },
    );
    closeConfirmDialog();
  };

  const handleHardDelete = async (item) => {
    await notify.operation(
      async () => {
        const ok = await hardDeleteItem(item.id, item.type);
        if (!ok) throw new Error("No se pudo eliminar");
      },
      {
        loadingMessage: "Eliminando...",
        successMessage: "Elemento eliminado permanentemente",
        errorMessage: "Error al eliminar",
        loadingTitle: "Eliminando",
        successTitle: "Eliminado",
        errorTitle: "Error",
      },
    );
    closeConfirmDialog();
  };

  const handleEmptyTrash = async () => {
    await notify.operation(
      async () => {
        const ok = await emptyTrash();
        if (!ok) throw new Error("No se pudo vaciar");
      },
      {
        loadingMessage: "Vaciando papelera...",
        successMessage: "Papelera vaciada",
        errorMessage: "Error al vaciar",
        loadingTitle: "Vaciando",
        successTitle: "Vaciada",
        errorTitle: "Error",
      },
    );
    closeConfirmDialog();
  };

  const confirmAction = () => {
    if (confirmDialog.type === "emptyTrash") return handleEmptyTrash();
    const item = filteredItems.find((i) => i.id === confirmDialog.itemId);
    if (!item) return;
    if (confirmDialog.type === "restore") return handleRestore(item);
    if (confirmDialog.type === "hardDelete") return handleHardDelete(item);
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("es-ES") : "");
  const getDaysUntilPermanentDelete = (deletedAt) => {
    if (!deletedAt) return null;
    const del = new Date(deletedAt).getTime();
    const deadline = del + 14 * 86400000; // 14 días
    const diff = Math.ceil((deadline - Date.now()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  // Sort toggle helper
  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: key === "eliminadoEn" ? "desc" : "asc" };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <AdminHeaderCard
          title="Papelera de Reciclaje"
            loading={isLoading}
          description={!isLoading && "Restaura o elimina permanentemente elementos"}
          persistentGlass
          actions={(
            <>
              <button
                onClick={() => loadDeletedData(true)}
                disabled={isLoading}
                className={`group relative flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-all text-sm sm:text-base whitespace-nowrap ${isLoading ? "bg-gray-100 text-gray-400 border border-gray-200" : "bg-white/70 hover:bg-white/90 text-gray-700 border border-white/60 shadow-sm hover:shadow"}`}
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
                <span>Actualizar</span>
              </button>
              {!safeStats.isEmpty && (
                <button
                  onClick={() => openConfirmDialog("emptyTrash")}
                  className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Vaciar papelera</span>
                </button>
              )}
            </>
          )}
        />

        {/* Controles básicos */}
        {(!safeStats.isEmpty || isLoading) && (
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl sm:rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-purple-400" />
                </div>
                <input
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-purple-50/50 font-medium"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "todos", label: "Todos" },
                  { key: "paquetes", label: "Paquetes" },
                  { key: "mayoristas", label: "Mayoristas" },
                  { key: "usuarios", label: "Usuarios" },
                ].map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => { setTypeFilter(btn.key); setCurrentPage(1); }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition ${typeFilter === btn.key ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {btn.label}
                  </button>
                ))}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => toggleSort("eliminadoEn")}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border ${sortConfig.key === "eliminadoEn" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                  >
                    Fecha {sortConfig.key === "eliminadoEn" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </button>
                  <button
                    onClick={() => toggleSort("name")}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border ${sortConfig.key === "name" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                  >
                    Nombre {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista / Estados */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 animate-pulse min-h-[220px]" />
            ))}
          </div>
        ) : totalItems === 0 ? (
          <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-500 mb-5">
                <FiTrash2 className="w-10 h-10" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-indigo-700">¡Papelera vacía!</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">No hay elementos en la papelera.</p>
              <Link to="/admin" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5">
                <FiHome className="w-4 h-4" /> Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 animate-pulse min-h-[220px]" />
                  ))}
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentItems.map((item) => (
                  <PapeleraItemCard
                    key={`${item.type}-${item.id}`}
                    item={item}
                    onRestore={(it) => openConfirmDialog("restore", it)}
                    onHardDelete={(it) => openConfirmDialog("hardDelete", it)}
                    formatDate={formatDate}
                    getDaysUntilPermanentDelete={getDaysUntilPermanentDelete}
                  />
                ))}
              </div>
            </Suspense>
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

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
                ? `¿Restaurar ${confirmDialog.itemType} "${confirmDialog.itemName}"?`
                : confirmDialog.type === "emptyTrash"
                  ? `¿Vaciar la papelera? Se eliminarán ${safeStats.total} elementos definitivamente.`
                  : `¿Eliminar permanentemente ${confirmDialog.itemType} "${confirmDialog.itemName}"? Esta acción no se puede deshacer.`
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
        </Suspense>
      </div>
    </div>
  );
};

export default PapeleraPage;
