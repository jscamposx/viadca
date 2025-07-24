import { useState, useEffect } from "react";
import api from "../../../api";
import {
  FiRefreshCw,
  FiTrash2,
  FiPackage,
  FiSend,
  FiClock,
  FiCornerUpLeft,
  FiTrash,
  FiAlertTriangle
} from "react-icons/fi";
import { useNotification } from "./AdminLayout";

const AdminTrashPage = () => {
  const [trashItems, setTrashItems] = useState({
    paquetes: [],
    vuelos: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const { addNotification } = useNotification();

  const fetchTrashItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.trash.getTrashItems();
      setTrashItems(response.data);
    } catch (err) {
      setError("No se pudieron cargar los elementos de la papelera. Inténtalo de nuevo más tarde.");
      console.error("Error al cargar la papelera:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashItems();
  }, []);

  const toggleItem = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRestore = async (id, tipo, nombre) => {
    if (!window.confirm(`¿Desea restaurar el ${tipo} "${nombre}"?`)) {
      return;
    }

    setRestoring(id);
    try {
      await api.trash.restoreTrashItem(id, tipo);
      addNotification(`El ${tipo} "${nombre}" ha sido restaurado.`, "success");
      await fetchTrashItems();
    } catch (err) {
      console.error(`Error al restaurar el ${tipo}:`, err);
      addNotification(`Error al restaurar el ${tipo} "${nombre}".`, "error");
    } finally {
      setRestoring(null);
    }
  };

  const handleDelete = async (id, tipo, nombre) => {
    if (
      !window.confirm(
        `¿Está seguro de que desea eliminar permanentemente el ${tipo} "${nombre}"?\n\nEsta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      await api.trash.deleteTrashItem(tipo, id);
      addNotification(
        `El ${tipo} "${nombre}" ha sido eliminado permanentemente.`,
        "info",
      );
      await fetchTrashItems();
    } catch (err) {
      console.error(`Error al eliminar permanentemente el ${tipo}:`, err);
      addNotification(`Error al eliminar el ${tipo} "${nombre}".`, "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm(
      "¿Está seguro de que desea vaciar toda la papelera?\n\nEsta acción eliminará permanentemente todos los elementos y no se puede deshacer."
    )) {
      return;
    }

    try {
      await api.trash.emptyTrash();
      addNotification("La papelera ha sido vaciada completamente.", "info");
      await fetchTrashItems();
    } catch (err) {
      console.error("Error al vaciar la papelera:", err);
      addNotification("Error al vaciar la papelera.", "error");
    }
  };

  const ItemList = ({ items, tipo, icon, color }) => {
    const tipoNombre = tipo.charAt(0).toUpperCase() + tipo.slice(1) + "s";

    const colorStyles = {
      blue: {
        border: "border-blue-100",
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-800",
        buttonRestore: "bg-blue-50 hover:bg-blue-100 text-blue-600",
        buttonDelete: "bg-red-50 hover:bg-red-100 text-red-600",
      },
      purple: {
        border: "border-purple-100",
        bg: "bg-purple-50",
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        badgeBg: "bg-purple-100",
        badgeText: "text-purple-800",
        buttonRestore: "bg-purple-50 hover:bg-purple-100 text-purple-600",
        buttonDelete: "bg-red-50 hover:bg-red-100 text-red-600",
      },
    };

    const styles = colorStyles[color] || colorStyles.blue;

    return (
      <div
        className={`rounded-2xl shadow-lg overflow-hidden border ${styles.border}`}
      >
        <div
          className={`flex items-center justify-between p-5 ${styles.bg}`}
        >
          <div className="flex items-center">
            <div
              className={`p-3 rounded-xl ${styles.iconBg} ${styles.iconText}`}
            >
              {icon}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800">{tipoNombre}</h2>
              <p className="text-gray-500 text-sm">Elementos eliminados recientemente</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${styles.badgeBg} ${styles.badgeText}`}
          >
            {items.length} {items.length === 1 ? "elemento" : "elementos"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-10 px-4 text-center bg-white">
            <div className="flex justify-center text-gray-300 mb-3">
              <div className="bg-gray-100 p-4 rounded-full">
                <FiPackage className="h-8 w-8" />
              </div>
            </div>
            <p className="text-gray-500 font-medium">No hay {tipo}s en la papelera</p>
            <p className="text-gray-400 text-sm mt-1">
              Los elementos eliminados aparecerán aquí
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <li
                key={item.id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-bold text-gray-800 truncate text-lg">
                        {item.nombre_paquete || item.nombre}
                      </h3>
                    </div>

                    {expandedItems[item.id] && (
                      <div className="mt-3 space-y-2 text-sm text-gray-600 pl-1">
                        <div className="flex items-center">
                          <FiClock className="text-gray-400 mr-2 flex-shrink-0" />
                          <span>
                            Eliminado:{" "}
                            {new Date(item.actualizadoEn).toLocaleString()}
                          </span>
                        </div>
                        
                        {tipo === "paquete" && (
                          <div className="flex items-center">
                            <FiPackage className="text-gray-400 mr-2 flex-shrink-0" />
                            <span>
                              Duración: {item.duracion || "N/A"} días
                            </span>
                          </div>
                        )}
                        
                        {tipo === "vuelo" && (
                          <div className="flex items-center">
                            <FiSend className="text-gray-400 mr-2 flex-shrink-0" />
                            <span>
                              Transporte: {item.transporte || "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`p-2.5 rounded-xl ${
                        expandedItems[item.id]
                          ? "bg-gray-100 text-gray-700"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      title={
                        expandedItems[item.id]
                          ? "Menos detalles"
                          : "Más detalles"
                      }
                    >
                      {expandedItems[item.id] ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleRestore(
                          item.id,
                          tipo,
                          item.nombre_paquete || item.nombre,
                        )
                      }
                      disabled={restoring === item.id}
                      className={`p-2.5 rounded-xl flex items-center ${styles.buttonRestore} ${
                        restoring === item.id ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      title="Restaurar"
                    >
                      {restoring === item.id ? (
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FiCornerUpLeft className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id,
                          tipo,
                          item.nombre_paquete || item.nombre,
                        )
                      }
                      disabled={deleting === item.id}
                      className={`p-2.5 rounded-xl flex items-center ${styles.buttonDelete} ${
                        deleting === item.id ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      title="Eliminar permanentemente"
                    >
                      {deleting === item.id ? (
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FiTrash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <FiTrash className="text-blue-500 w-12 h-12" />
            <div className="absolute -inset-2 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="mt-8">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          </div>
          <p className="text-gray-700 text-xl font-medium mt-6">
            Cargando papelera...
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Recuperando elementos eliminados
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-100">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full mb-5">
                <FiAlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Error al cargar la papelera
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-3">
                <button
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
                  onClick={() => window.history.back()}
                >
                  Regresar
                </button>
                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
                  onClick={fetchTrashItems}
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = trashItems.paquetes.length + trashItems.vuelos.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full shadow-lg mb-5">
            <FiTrash className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent inline-block">
            Papelera de Reciclaje
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Gestione elementos eliminados recientemente. Puede restaurarlos o
            eliminarlos permanentemente.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={fetchTrashItems}
              className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-5 rounded-xl border border-gray-200 shadow-sm"
            >
              <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
            
            {totalItems > 0 && (
              <button
                onClick={handleEmptyTrash}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 px-5 rounded-xl border border-red-100 shadow-sm"
              >
                <FiTrash2 />
                Vaciar papelera
              </button>
            )}
          </div>
        </div>

        <div className="mb-8 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FiPackage className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paquetes eliminados</p>
                  <p className="text-xl font-bold text-gray-800">{trashItems.paquetes.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <FiSend className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vuelos eliminados</p>
                  <p className="text-xl font-bold text-gray-800">{trashItems.vuelos.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 p-3 rounded-xl">
                  <FiTrash className="text-gray-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total en papelera</p>
                  <p className="text-xl font-bold text-gray-800">{totalItems}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ItemList
            items={trashItems.paquetes}
            tipo="paquete"
            icon={<FiPackage className="w-7 h-7" />}
            color="blue"
          />
          <ItemList
            items={trashItems.vuelos}
            tipo="vuelo"
            icon={<FiSend className="w-7 h-7" />}
            color="purple"
          />
        </div>

        {totalItems === 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-5">
              <div className="bg-gray-100 p-5 rounded-full">
                <FiPackage className="text-gray-300 w-12 h-12" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Papelera vacía
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No hay elementos en la papelera. Los elementos que elimines aparecerán aquí antes de ser eliminados permanentemente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrashPage;