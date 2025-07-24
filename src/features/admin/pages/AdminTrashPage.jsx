import { useState, useEffect } from "react";
import api from "../../../api";
import {
  FiRefreshCw,
  FiTrash2,
  FiPackage,
  FiSend,
  FiClock,
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
      setError("No se pudieron cargar los elementos de la papelera.");
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
      await fetchTrashItems(); // Refrescar la lista
    } catch (err) {
      console.error(`Error al eliminar permanentemente el ${tipo}:`, err);
      addNotification(`Error al eliminar el ${tipo} "${nombre}".`, "error");
    } finally {
      setDeleting(null);
    }
  };

  const ItemList = ({ items, tipo, icon, color }) => {
    const tipoNombre = tipo.charAt(0).toUpperCase() + tipo.slice(1) + "s";

    const colorStyles = {
      blue: {
        border: "border-blue-100",
        gradient: "from-blue-50",
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-800",
      },
      purple: {
        border: "border-purple-100",
        gradient: "from-purple-50",
        iconBg: "bg-purple-100",
        iconText: "text-purple-600",
        badgeBg: "bg-purple-100",
        badgeText: "text-purple-800",
      },
    };

    const styles = colorStyles[color] || colorStyles.blue;

    return (
      <div
        className={`bg-white rounded-xl shadow-md border overflow-hidden ${styles.border}`}
      >
        <div
          className={`flex items-center justify-between p-4 bg-gradient-to-r to-white ${styles.gradient}`}
        >
          <div className="flex items-center">
            <div
              className={`p-2 rounded-lg ${styles.iconBg} ${styles.iconText}`}
            >
              {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 ml-3">
              {tipoNombre}
            </h2>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles.badgeBg} ${styles.badgeText}`}
          >
            {items.length} {items.length === 1 ? "elemento" : "elementos"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-8 px-4 text-center">
            <div className="flex justify-center text-gray-300 mb-3">
              <FiPackage className="h-12 w-12" />
            </div>
            <p className="text-gray-500">No hay {tipo}s en la papelera</p>
            <p className="text-gray-400 text-sm mt-1">
              Los elementos eliminados aparecerán aquí
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li
                key={item.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-800 truncate">
                        {item.nombre_paquete || item.nombre}
                      </h3>
                    </div>

                    {expandedItems[item.id] && (
                      <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FiClock className="text-gray-400 mr-2" />
                          <span>
                            Eliminado:{" "}
                            {new Date(item.actualizadoEn).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`p-2 rounded-lg ${
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
                      className={`p-2 rounded-lg ${
                        restoring === item.id
                          ? "bg-green-100 text-green-600 cursor-not-allowed"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                      title="Restaurar"
                    >
                      {restoring === item.id ? (
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      ) : (
                        <FiRefreshCw className="w-5 h-5" />
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
                      className={`p-2 rounded-lg ${
                        deleting === item.id
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                      title="Eliminar permanentemente"
                    >
                      {deleting === item.id ? (
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Cargando papelera...
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Recuperando elementos eliminados
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 p-8 rounded-xl max-w-md text-center border border-red-100">
          <div className="text-red-500 text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error al cargar la papelera
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all duration-300"
            onClick={fetchTrashItems}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text  inline-block">
            Papelera de Reciclaje
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Gestione elementos eliminados recientemente. Puede restaurarlos o
            eliminarlos permanentemente.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Elementos Eliminados
            </h2>
            <p className="text-gray-500 text-sm">
              {trashItems.paquetes.length + trashItems.vuelos.length} elementos
              en total
            </p>
          </div>
          <button
            onClick={fetchTrashItems}
            className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <FiRefreshCw className={`${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ItemList
            items={trashItems.paquetes}
            tipo="paquete"
            icon={<FiPackage className="w-6 h-6" />}
            color="blue"
          />
          <ItemList
            items={trashItems.vuelos}
            tipo="vuelo"
            icon={<FiSend className="w-6 h-6" />}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTrashPage;
