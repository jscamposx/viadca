import {
  FiActivity,
  FiAlertTriangle,
  FiClock,
  FiDatabase,
  FiList,
  FiPlay,
  FiRefreshCw,
  FiTrendingUp,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useMemo } from "react";

const formatMs = (ms) => {
  if (ms === null || ms === undefined) return "—";
  if (ms < 1000) return `${ms} ms`;
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds >= 10 ? seconds.toFixed(0) : seconds.toFixed(1)} s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

const formatDateTime = (date) => {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  } catch (e) {
    return date.toISOString?.() ?? String(date);
  }
};

const getBadgeClasses = (type) => {
  switch (type) {
    case "completed":
      return "bg-emerald-100 text-emerald-600 border border-emerald-200";
    case "started":
      return "bg-blue-100 text-blue-600 border border-blue-200";
    case "rejected":
      return "bg-rose-100 text-rose-600 border border-rose-200";
    case "failed":
      return "bg-rose-100 text-rose-600 border border-rose-200";
    default:
      return "bg-slate-200 text-slate-700 border border-slate-300";
  }
};

const getBadgeLabel = (type) => {
  switch (type) {
    case "completed":
      return "Completado";
    case "started":
      return "Iniciado";
    case "rejected":
      return "Rechazado";
    case "failed":
      return "Falló";
    case "enqueued":
      return "En cola";
    default:
      return type ?? "Evento";
  }
};

const getEstimatedWaitTone = (value) => {
  if (value === null || value === undefined) return "bg-slate-100 text-slate-800 border border-slate-200";
  if (value > 15000) return "bg-rose-100 text-rose-700 border border-rose-200";
  if (value > 5000) return "bg-amber-100 text-amber-700 border border-amber-200";
  return "bg-emerald-100 text-emerald-700 border border-emerald-200";
};

const IndicatorCard = ({ icon: Icon, label, value, tone = "bg-white/80 border border-white/70" }) => (
  <div className={`rounded-xl p-4 flex items-center gap-3 shadow-sm backdrop-blur-sm ${tone}`}>
    <div className="w-10 h-10 rounded-lg bg-white/70 flex items-center justify-center shadow-inner">
      <Icon className="w-5 h-5 text-slate-600" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold line-clamp-1">{label}</p>
      <p className="text-xl font-semibold text-slate-900 tabular-nums">
        {value ?? "—"}
      </p>
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
    {message}
  </div>
);

const QueueStatusPanel = ({
  status,
  loading,
  error,
  onRefresh,
  isPolling,
  pollInterval,
  lastUpdatedAt,
  isStale,
}) => {
  const estimatedWaitTone = useMemo(
    () => getEstimatedWaitTone(status?.estimatedWaitMs ?? null),
    [status?.estimatedWaitMs],
  );

  const oldestWaiting = status?.oldestWaitingMs ?? null;
  const pendingSample = status?.pendingSample ?? [];
  const recentEvents = status?.recentEvents ?? [];
  const dailyTotals = status?.dailyTotals ?? [];

  const maxDaily = useMemo(() => {
    return dailyTotals.reduce((max, item) => {
      const total = (item?.processed ?? 0) + (item?.rejected ?? 0);
      return Math.max(max, total);
    }, 0);
  }, [dailyTotals]);

  const isLoadingInitial = loading && !status;

  return (
    <section className="glass-panel glass-border-gradient rounded-2xl shadow-lg p-4 sm:p-6 space-y-6 border border-white/40">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
            <FiActivity className="w-5 h-5 text-indigo-500" /> Estado de la cola de tareas
          </h2>
          <p className="text-sm text-slate-500">
            Actualización cada {Math.round((pollInterval || 1000) / 1000)}s · Última lectura: {formatDateTime(lastUpdatedAt)}{isStale ? " · Datos desactualizados" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1 text-xs">
              <FiAlertTriangle className="w-4 h-4" />
              Error (reintentando)
            </span>
          )}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-indigo-700 bg-white/70 border border-white/60 shadow-sm hover:bg-white/90 transition disabled:opacity-60"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refrescar
          </button>
        </div>
      </header>

      {isLoadingInitial ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white/60 p-4 animate-pulse space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-200" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-300 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <IndicatorCard icon={FiList} label="En cola" value={status?.queueLength ?? "—"} />
          <IndicatorCard icon={FiPlay} label="Procesando" value={status?.processing ?? "—"} />
          <IndicatorCard icon={FiDatabase} label="Concurrencia" value={status?.maxConcurrency ?? "—"} />
          <IndicatorCard
            icon={FiClock}
            label="Espera estimada"
            value={formatMs(status?.estimatedWaitMs)}
            tone={`${estimatedWaitTone} backdrop-blur-sm`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Cola actual
            </h3>
            {oldestWaiting !== null && (
              <span className="text-xs text-slate-500">Mayor espera: {formatMs(oldestWaiting)}</span>
            )}
          </div>

          {pendingSample.length === 0 ? (
            <EmptyState message="No hay tareas en espera actualmente." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/70">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50/80">
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Tiempo en cola</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {pendingSample.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 font-medium tabular-nums">{item.id}</td>
                      <td className="px-4 py-2 text-slate-600">{formatMs(item.waitingMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Eventos recientes
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <FiTrendingUp className="w-3.5 h-3.5" />
              Actividad en tiempo real
            </span>
          </div>

          {recentEvents.length === 0 ? (
            <EmptyState message="Sin eventos registrados en los últimos segundos." />
          ) : (
            <ol className="relative border-l border-slate-200 pl-4 space-y-4">
              {recentEvents.map((event, idx) => (
                <li key={`${event.taskId}-${event.timestamp}-${idx}`} className="ml-2">
                  <div className="absolute -left-[7px] top-1.5 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-indigo-200 border border-indigo-300" aria-hidden="true" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeClasses(event.type)}`}>
                      {getBadgeLabel(event.type)}
                    </span>
                    <span className="text-sm font-medium text-slate-700 tabular-nums">Tarea #{event.taskId ?? "—"}</span>
                    {event.waitMs !== undefined && (
                      <span className="text-xs text-slate-500">
                        Esperó {formatMs(event.waitMs)}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {formatDateTime(event.timestamp ? new Date(event.timestamp) : null)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Historial diario
          </h3>
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <FiCheckCircle className="w-3.5 h-3.5" />
            Procesadas vs rechazadas
          </span>
        </div>

        {dailyTotals.length === 0 ? (
          <EmptyState message="Aún no hay métricas acumuladas." />
        ) : (
          <div className="space-y-2">
            {dailyTotals.map((item) => {
              const processed = item?.processed ?? 0;
              const rejected = item?.rejected ?? 0;
              const total = processed + rejected;
              const width = maxDaily > 0 ? Math.max(6, Math.round((total / maxDaily) * 100)) : 0;
              const processedWidth = total > 0 ? Math.round((processed / total) * 100) : 0;
              return (
                <div key={item.date} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{item.date}</span>
                    <span className="tabular-nums">{processed} ✔ · {rejected} ✖</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-indigo-400"
                      style={{ width: `${width}%`, minWidth: processed > 0 || rejected > 0 ? "6%" : "0" }}
                    >
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${processedWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
          <FiXCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">No se pudo actualizar la cola</p>
            <p className="text-xs text-rose-600/80">
              {error.message || "Ocurrió un error inesperado al leer el estado. Intentaremos nuevamente automáticamente."}
            </p>
          </div>
        </div>
      )}

      <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400">
        <div className="inline-flex items-center gap-1">
          <FiActivity className="w-3.5 h-3.5" />
          {isPolling ? "Polling activo" : "Polling deshabilitado"}
        </div>
        <div className="inline-flex items-center gap-1">
          <FiClock className="w-3.5 h-3.5" />
          Última actualización: {formatDateTime(lastUpdatedAt)}
        </div>
      </footer>
    </section>
  );
};

export default QueueStatusPanel;
