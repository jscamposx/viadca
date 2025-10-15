import React, { useState } from "react";
import {
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiXCircle,
  FiPause,
  FiEye,
} from "react-icons/fi";
import useQueueHistory from "../hooks/useQueueHistory";

const STATUS_CONFIG = {
  completed: {
    label: "Completada",
    icon: FiCheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  failed: {
    label: "Fallida",
    icon: FiXCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  started: {
    label: "En Proceso",
    icon: FiLoader,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  enqueued: {
    label: "En Cola",
    icon: FiClock,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  rejected: {
    label: "Rechazada",
    icon: FiPause,
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
};

const METHOD_COLORS = {
  GET: "bg-blue-100 text-blue-800 border-blue-200",
  POST: "bg-green-100 text-green-800 border-green-200",
  PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DELETE: "bg-red-100 text-red-800 border-red-200",
  PATCH: "bg-purple-100 text-purple-800 border-purple-200",
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const formatDuration = (ms) => {
  if (ms === null || ms === undefined) return "-";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const QueueHistoryTable = ({ onViewDetails }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});

  const {
    tasks,
    total,
    loading,
    error,
    filters,
    updateFilters,
    refetch,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  } = useQueueHistory(
    {
      limit: 50,
      offset: 0,
    },
    {
      enabled: true,
      autoRefresh: false,
    }
  );

  const handleApplyFilters = () => {
    updateFilters(tempFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    updateFilters({ status: undefined, method: undefined, usuarioId: undefined });
    setShowFilters(false);
  };

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.enqueued;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const MethodBadge = ({ method }) => {
    const colorClass = METHOD_COLORS[method] || "bg-gray-100 text-gray-800 border-gray-200";
    return (
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-mono font-semibold border ${colorClass}`}
      >
        {method}
      </span>
    );
  };

  if (error) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-red-200 bg-red-50">
        <div className="flex items-center gap-3 text-red-700">
          <FiAlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error al cargar historial</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <div className="glass-panel glass-border-gradient rounded-2xl p-4 border border-white/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Historial de Tareas
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Total de {total} registro{total !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                showFilters
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <FiFilter className="w-4 h-4" />
              Filtros
            </button>

            <button
              onClick={refetch}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  value={tempFilters.status || ""}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, status: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos</option>
                  <option value="completed">Completadas</option>
                  <option value="failed">Fallidas</option>
                  <option value="started">En Proceso</option>
                  <option value="enqueued">En Cola</option>
                  <option value="rejected">Rechazadas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Método HTTP
                </label>
                <select
                  value={tempFilters.method || ""}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, method: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Registros por página
                </label>
                <select
                  value={filters.limit || 50}
                  onChange={(e) =>
                    updateFilters({ limit: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="glass-panel glass-border-gradient rounded-2xl border border-white/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Endpoint
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Tiempos
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FiLoader className="w-8 h-8 text-indigo-600 animate-spin" />
                      <span className="text-slate-600">Cargando historial...</span>
                    </div>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    No se encontraron registros
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">
                      #{task.taskId}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                          <FiUser className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {task.usuarioNombre || "Sistema"}
                          </div>
                          {task.usuarioRol && (
                            <div className="text-xs text-slate-500 capitalize">
                              {task.usuarioRol}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <MethodBadge method={task.method} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs truncate text-sm font-mono text-slate-700" title={task.endpoint}>
                        {task.endpoint}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1 text-slate-600">
                          <FiClock className="w-3 h-3" />
                          <span>Espera: {formatDuration(task.waitTimeMs)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <FiLoader className="w-3 h-3" />
                          <span>Ejec: {formatDuration(task.executionTimeMs)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-800 font-medium">
                          Total: {formatDuration(task.totalTimeMs)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {formatDate(task.creadoEn)}
                    </td>
                    <td className="px-4 py-3">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(task)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          Ver
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {!loading && tasks.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Mostrando {filters.offset + 1} - {Math.min(filters.offset + filters.limit, total)} de{" "}
                {total} registros
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={!hasPrevPage}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Anterior
                </button>

                <div className="text-sm text-slate-600">
                  Página {currentPage + 1} de {totalPages}
                </div>

                <button
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueHistoryTable;
