import { FiActivity, FiClock } from "react-icons/fi";
import QueueStatusPanel from "../components/QueueStatusPanel";
import useQueueStatus from "../hooks/useQueueStatus";

const QueueMonitorPage = () => {
  const {
    status,
    loading,
    error,
    refresh,
    isPolling,
    pollInterval,
    lastUpdatedAt,
    isStale,
  } = useQueueStatus({ pollInterval: 8000 });

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <section className="glass-panel glass-border-gradient rounded-2xl shadow-lg p-4 sm:p-6 border border-white/40 space-y-4">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 flex items-center gap-2">
                <FiActivity className="w-6 h-6" /> Monitor de cola de tareas
              </h1>
              <p className="text-sm text-slate-600">
                Supervisa la actividad de la cola de procesamiento en tiempo real y detecta cuellos de botella rápidamente.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/70 border border-white/60 rounded-xl px-3 py-2 shadow-sm">
              <FiClock className="w-4 h-4" />
              <span>{`Actualización automática cada ${Math.round((pollInterval || 1000) / 1000)}s`}</span>
              {isStale && <span className="text-rose-500 font-medium">· Datos desactualizados</span>}
            </div>
          </header>
        </section>

        <QueueStatusPanel
          status={status}
          loading={loading}
          error={error}
          onRefresh={refresh}
          isPolling={isPolling}
          pollInterval={pollInterval}
          lastUpdatedAt={lastUpdatedAt}
          isStale={isStale}
        />
      </div>
    </div>
  );
};

export default QueueMonitorPage;
