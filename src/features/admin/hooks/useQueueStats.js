import { useState, useEffect, useCallback, useRef } from "react";
import queueService from "../../../api/queueService";

/**
 * Hook para obtener estadísticas de la cola
 * @param {Object} initialFilters - Filtros iniciales (startDate, endDate, usuarioId)
 * @param {Object} options - Opciones del hook
 */
export const useQueueStats = (initialFilters = {}, options = {}) => {
  const { enabled = true, autoRefresh = false, refreshInterval = 60000 } = options;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const isMountedRef = useRef(false);
  const refreshTimerRef = useRef(null);

  const fetchStats = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await queueService.getQueueStats(filters);
      
      if (isMountedRef.current) {
        setStats(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || "Error al obtener estadísticas");
        console.error("Error fetching queue stats:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled, filters]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (enabled) {
      fetchStats();
    }

    return () => {
      isMountedRef.current = false;
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [enabled, fetchStats]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (autoRefresh && enabled) {
      refreshTimerRef.current = setInterval(fetchStats, refreshInterval);
      
      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, enabled, fetchStats, refreshInterval]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  return {
    stats,
    loading,
    error,
    filters,
    updateFilters,
    setFilters,
    refetch: fetchStats,
  };
};

/**
 * Hook para obtener estadísticas de almacenamiento
 */
export const useQueueStorage = (options = {}) => {
  const { enabled = true, autoRefresh = false, refreshInterval = 120000 } = options;

  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(false);
  const refreshTimerRef = useRef(null);

  const fetchStorage = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await queueService.getQueueStorage();
      
      if (isMountedRef.current) {
        setStorage(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || "Error al obtener estadísticas de almacenamiento");
        console.error("Error fetching storage stats:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (enabled) {
      fetchStorage();
    }

    return () => {
      isMountedRef.current = false;
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [enabled, fetchStorage]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (autoRefresh && enabled) {
      refreshTimerRef.current = setInterval(fetchStorage, refreshInterval);
      
      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, enabled, fetchStorage, refreshInterval]);

  return {
    storage,
    loading,
    error,
    refetch: fetchStorage,
  };
};

export default useQueueStats;
