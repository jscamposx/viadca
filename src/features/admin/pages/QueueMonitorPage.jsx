import { useState } from "react";
import { FiActivity, FiClock, FiList, FiBarChart2 } from "react-icons/fi";
import QueueStatusPanel from "../components/QueueStatusPanel";
import QueueHistoryTable from "../components/QueueHistoryTable";
import QueueStatsCards from "../components/QueueStatsCards";
import TaskDetailModal from "../components/TaskDetailModal";
import useQueueStatus from "../hooks/useQueueStatus";

const TABS = {
  STATUS: "status",
  HISTORY: "history",
  STATS: "stats",
};

const QueueMonitorPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.STATUS);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const TabButton = ({ tab, icon: Icon, label, count }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`
          flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all
          ${
            isActive
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-indigo-200"
          }
        `}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
        {count !== undefined && (
          <span
            className={`
            px-2 py-0.5 rounded-full text-xs font-bold
            ${isActive ? "bg-white/20" : "bg-indigo-100 text-indigo-700"}
          `}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <section className="glass-panel glass-border-gradient rounded-2xl shadow-lg p-4 sm:p-6 border border-white/40 space-y-4">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 flex items-center gap-2">
                <FiActivity className="w-6 h-6" /> Monitor de Tareas
              </h1>
              <p className="text-sm text-slate-600">
                Supervisa la actividad de la cola de procesamiento en tiempo real y detecta cuellos de botella rápidamente.
              </p>
            </div>
            {activeTab === TABS.STATUS && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/70 border border-white/60 rounded-xl px-3 py-2 shadow-sm">
                <FiClock className="w-4 h-4" />
                <span>{`Actualización automática cada ${Math.round((pollInterval || 1000) / 1000)}s`}</span>
                {isStale && <span className="text-rose-500 font-medium">· Datos desactualizados</span>}
              </div>
            )}
          </header>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            <TabButton
              tab={TABS.STATUS}
              icon={FiActivity}
              label="Estado en Tiempo Real"
              count={status?.queueLength}
            />
            <TabButton
              tab={TABS.HISTORY}
              icon={FiList}
              label="Historial"
            />
            <TabButton
              tab={TABS.STATS}
              icon={FiBarChart2}
              label="Estadísticas"
            />
          </div>
        </section>

        {/* Content */}
        {activeTab === TABS.STATUS && (
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
        )}

        {activeTab === TABS.HISTORY && (
          <QueueHistoryTable onViewDetails={handleViewDetails} />
        )}

        {activeTab === TABS.STATS && <QueueStatsCards />}
      </div>

      {/* Modal de Detalles */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default QueueMonitorPage;
