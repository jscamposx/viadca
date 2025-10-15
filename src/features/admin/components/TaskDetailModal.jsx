import React from "react";
import {
  FiX,
  FiUser,
  FiClock,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiGlobe,
  FiMonitor,
  FiHash,
} from "react-icons/fi";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
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

const InfoRow = ({ label, value, icon: Icon, mono = false }) => {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      {Icon && (
        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p
          className={`text-sm text-slate-800 ${mono ? "font-mono" : ""} ${
            value?.length > 50 ? "break-all" : ""
          }`}
        >
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
};

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  const statusConfig = {
    completed: { label: "Completada", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: FiCheckCircle },
    failed: { label: "Fallida", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: FiAlertCircle },
    started: { label: "En Proceso", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: FiActivity },
    enqueued: { label: "En Cola", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: FiClock },
    rejected: { label: "Rechazada", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", icon: FiX },
  };

  const config = statusConfig[task.status] || statusConfig.enqueued;
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl glass-panel glass-border-gradient rounded-2xl shadow-2xl border border-white/40 bg-white/95 backdrop-blur-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center`}>
                  <StatusIcon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Detalles de Tarea #{task.taskId}
                  </h2>
                  <p className={`text-sm font-medium ${config.color} flex items-center gap-1.5 mt-1`}>
                    <span className={`w-2 h-2 rounded-full ${config.bg} border ${config.border}`} />
                    {config.label}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-600 hover:text-slate-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Información del Usuario */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-indigo-600" />
                  Usuario
                </h3>
                <div className="glass-panel rounded-xl p-4 border border-slate-200 space-y-3">
                  <InfoRow
                    label="Nombre"
                    value={task.usuarioNombre}
                    icon={FiUser}
                  />
                  <InfoRow
                    label="Rol"
                    value={task.usuarioRol ? task.usuarioRol.toUpperCase() : null}
                  />
                  <InfoRow
                    label="ID de Usuario"
                    value={task.usuarioId?.toString()}
                    icon={FiHash}
                    mono
                  />
                </div>
              </section>

              {/* Información de la Request */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiActivity className="w-4 h-4 text-indigo-600" />
                  Request
                </h3>
                <div className="glass-panel rounded-xl p-4 border border-slate-200 space-y-3">
                  <InfoRow
                    label="Método HTTP"
                    value={task.method}
                    mono
                  />
                  <InfoRow
                    label="Endpoint"
                    value={task.endpoint}
                    mono
                  />
                  <InfoRow
                    label="Dirección IP"
                    value={task.ip}
                    icon={FiGlobe}
                    mono
                  />
                  <InfoRow
                    label="User Agent"
                    value={task.userAgent}
                    icon={FiMonitor}
                    mono
                  />
                </div>
              </section>

              {/* Tiempos */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-indigo-600" />
                  Métricas de Tiempo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-600 mb-1">Tiempo en Cola</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatDuration(task.waitTimeMs)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Antes de iniciar</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-600 mb-1">Tiempo de Ejecución</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatDuration(task.executionTimeMs)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Procesamiento</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-600 mb-1">Tiempo Total</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatDuration(task.totalTimeMs)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">De inicio a fin</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-600 mb-1">Cola al Encolar</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {task.queueLengthAtEnqueue ?? "N/A"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Tareas esperando</p>
                  </div>
                </div>
              </section>

              {/* Fechas */}
              <section>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-indigo-600" />
                  Timeline
                </h3>
                <div className="glass-panel rounded-xl p-4 border border-slate-200 space-y-3">
                  <InfoRow
                    label="Encolada"
                    value={formatDate(task.enqueuedAt)}
                    icon={FiClock}
                  />
                  {task.startedAt && (
                    <InfoRow
                      label="Iniciada"
                      value={formatDate(task.startedAt)}
                      icon={FiActivity}
                    />
                  )}
                  {task.completedAt && (
                    <InfoRow
                      label="Completada"
                      value={formatDate(task.completedAt)}
                      icon={FiCheckCircle}
                    />
                  )}
                  <InfoRow
                    label="Registrada"
                    value={formatDate(task.creadoEn)}
                  />
                </div>
              </section>

              {/* Error (si existe) */}
              {task.errorMessage && (
                <section>
                  <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4 text-red-600" />
                    Error
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800 font-medium mb-2">
                      {task.errorMessage}
                    </p>
                    {task.errorStack && (
                      <details className="mt-3">
                        <summary className="text-xs text-red-600 font-medium cursor-pointer hover:text-red-700">
                          Ver stack trace completo
                        </summary>
                        <pre className="mt-2 text-xs text-red-700 bg-red-100 p-3 rounded-lg overflow-x-auto">
                          {task.errorStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </section>
              )}

              {/* Metadata (si existe) */}
              {task.metadata && (
                <section>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiHash className="w-4 h-4 text-indigo-600" />
                    Metadata
                  </h3>
                  <div className="glass-panel rounded-xl p-4 border border-slate-200">
                    <pre className="text-xs text-slate-700 overflow-x-auto">
                      {JSON.stringify(task.metadata, null, 2)}
                    </pre>
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-medium text-sm transition-colors shadow-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
