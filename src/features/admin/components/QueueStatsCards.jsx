import React from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiLink,
  FiBarChart2,
} from "react-icons/fi";
import useQueueStats from "../hooks/useQueueStats";

const formatDuration = (ms) => {
  if (ms === null || ms === undefined) return "0ms";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  return `${(ms / 60000).toFixed(2)}min`;
};

const StatCard = ({ title, value, subtitle, icon: Icon, color, bgColor, borderColor }) => {
  return (
    <div className={`glass-panel glass-border-gradient rounded-2xl p-5 border ${borderColor} ${bgColor} hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} border ${borderColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

const TopItem = ({ name, count, rank, icon: Icon }) => {
  const getBadgeColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-700 border-gray-300";
    if (rank === 3) return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors gap-2">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <span
          className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold border flex-shrink-0 ${getBadgeColor(rank)}`}
        >
          {rank}
        </span>
        {Icon && <Icon className="w-4 h-4 text-slate-500 flex-shrink-0 hidden sm:block" />}
        <span className="text-xs sm:text-sm text-slate-700 truncate break-all" title={name} style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
          {name}
        </span>
      </div>
      <span className="text-xs sm:text-sm font-semibold text-slate-800 ml-2 flex-shrink-0">{count}</span>
    </div>
  );
};

const QueueStatsCards = () => {
  const { stats, loading, error } = useQueueStats({}, { enabled: true, autoRefresh: true, refreshInterval: 30000 });

  if (loading && !stats) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center">
        <FiActivity className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-red-200 bg-red-50">
        <div className="flex items-center gap-3 text-red-700">
          <FiXCircle className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Error al cargar estadísticas</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Tareas"
          value={stats.total?.toLocaleString() || "0"}
          subtitle="Todas las operaciones"
          icon={FiActivity}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
          borderColor="border-indigo-200"
        />

        <StatCard
          title="Completadas"
          value={stats.byStatus?.completed?.toLocaleString() || "0"}
          subtitle={`${stats.total > 0 ? ((stats.byStatus?.completed / stats.total) * 100).toFixed(1) : 0}% del total`}
          icon={FiCheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />

        <StatCard
          title="Fallidas"
          value={stats.byStatus?.failed?.toLocaleString() || "0"}
          subtitle={`${stats.total > 0 ? ((stats.byStatus?.failed / stats.total) * 100).toFixed(1) : 0}% del total`}
          icon={FiXCircle}
          color="text-red-600"
          bgColor="bg-red-50"
          borderColor="border-red-200"
        />

        <StatCard
          title="Rechazadas"
          value={stats.byStatus?.rejected?.toLocaleString() || "0"}
          subtitle={`${stats.total > 0 ? ((stats.byStatus?.rejected / stats.total) * 100).toFixed(1) : 0}% del total`}
          icon={FiClock}
          color="text-gray-600"
          bgColor="bg-gray-50"
          borderColor="border-gray-200"
        />
      </div>

      {/* Tiempos Promedio */}
      <div className="glass-panel glass-border-gradient rounded-2xl p-6 border border-white/40">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiClock className="w-5 h-5 text-indigo-600" />
          Tiempos Promedio de Ejecución
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Tiempo en Cola</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatDuration(stats.avgWaitTimeMs)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Antes de iniciar</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Tiempo de Ejecución</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatDuration(stats.avgExecutionTimeMs)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Procesamiento activo</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-600 mb-1">Tiempo Total</p>
            <p className="text-2xl font-bold text-green-600">
              {formatDuration(stats.avgTotalTimeMs)}
            </p>
            <p className="text-xs text-slate-500 mt-1">De inicio a fin</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <div className="glass-panel glass-border-gradient rounded-2xl p-6 border border-white/40">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiLink className="w-5 h-5 text-indigo-600" />
            Endpoints Más Utilizados
          </h3>
          <div className="space-y-1">
            {stats.topEndpoints && stats.topEndpoints.length > 0 ? (
              stats.topEndpoints.slice(0, 10).map((endpoint, idx) => (
                <TopItem
                  key={idx}
                  name={endpoint.name}
                  count={endpoint.count}
                  rank={idx + 1}
                  icon={FiTrendingUp}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Top Usuarios */}
        <div className="glass-panel glass-border-gradient rounded-2xl p-6 border border-white/40">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-indigo-600" />
            Usuarios Más Activos
          </h3>
          <div className="space-y-1">
            {stats.topUsers && stats.topUsers.length > 0 ? (
              stats.topUsers.slice(0, 10).map((user, idx) => (
                <TopItem
                  key={idx}
                  name={user.name || "Usuario desconocido"}
                  count={user.count}
                  rank={idx + 1}
                  icon={FiUsers}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No hay datos disponibles</p>
            )}
          </div>
        </div>
      </div>

      {/* Distribución por Método HTTP */}
      <div className="glass-panel glass-border-gradient rounded-2xl p-6 border border-white/40">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiBarChart2 className="w-5 h-5 text-indigo-600" />
          Distribución por Método HTTP
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {stats.byMethod && Object.entries(stats.byMethod).map(([method, count]) => {
            const methodColors = {
              GET: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
              POST: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
              PUT: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
              DELETE: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
              PATCH: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
            };

            const colors = methodColors[method] || {
              bg: "bg-gray-50",
              text: "text-gray-700",
              border: "border-gray-200",
            };

            return (
              <div
                key={method}
                className={`${colors.bg} border ${colors.border} rounded-xl p-4 text-center`}
              >
                <p className="text-xs font-medium text-slate-600 mb-1">{method}</p>
                <p className={`text-2xl font-bold ${colors.text}`}>{count}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estado Detallado */}
      <div className="glass-panel glass-border-gradient rounded-2xl p-6 border border-white/40">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiActivity className="w-5 h-5 text-indigo-600" />
          Resumen por Estado
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {stats.byStatus &&
            Object.entries(stats.byStatus).map(([status, count]) => {
              const statusConfig = {
                completed: { label: "Completadas", icon: FiCheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
                failed: { label: "Fallidas", icon: FiXCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
                started: { label: "En Proceso", icon: FiActivity, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
                enqueued: { label: "En Cola", icon: FiClock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
                rejected: { label: "Rechazadas", icon: FiXCircle, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
              };

              const config = statusConfig[status] || {
                label: status,
                icon: FiActivity,
                color: "text-gray-600",
                bg: "bg-gray-50",
                border: "border-gray-200",
              };

              const Icon = config.icon;

              return (
                <div
                  key={status}
                  className={`${config.bg} border ${config.border} rounded-xl p-4`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <p className="text-xs font-medium text-slate-600 text-center mb-1 capitalize">
                    {config.label}
                  </p>
                  <p className={`text-2xl font-bold ${config.color} text-center`}>{count}</p>
                  <p className="text-xs text-slate-500 text-center mt-1">
                    {stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default QueueStatsCards;
