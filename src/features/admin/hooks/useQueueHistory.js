import { useState, useEffect, useCallback, useRef } from "react";
import queueService from "../../../api/queueService";

/**
 * Hook para obtener historial de tareas con filtros
 * @param {Object} initialFilters - Filtros iniciales
 * @param {Object} options - Opciones del hook
 */
export const useQueueHistory = (initialFilters = {}, options = {}) => {
  const { enabled = true, autoRefresh = false, refreshInterval = 30000 } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    limit: 50,
    offset: 0,
    ...initialFilters,
  });

  const isMountedRef = useRef(false);
  const refreshTimerRef = useRef(null);

  const fetchHistory = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await queueService.getQueueHistory(filters);
      
      if (isMountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || "Error al obtener historial");
        console.error("Error fetching queue history:", err);
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
      fetchHistory();
    }

    return () => {
      isMountedRef.current = false;
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [enabled, fetchHistory]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (autoRefresh && enabled) {
      refreshTimerRef.current = setInterval(fetchHistory, refreshInterval);
      
      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, enabled, fetchHistory, refreshInterval]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, offset: 0 }));
  }, []);

  const goToPage = useCallback((page) => {
    setFilters((prev) => ({
      ...prev,
      offset: page * (prev.limit || 50),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      offset: prev.offset + (prev.limit || 50),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - (prev.limit || 50)),
    }));
  }, []);

  const currentPage = Math.floor(filters.offset / (filters.limit || 50));
  const totalPages = data ? Math.ceil(data.total / (filters.limit || 50)) : 0;
  const hasNextPage = data ? filters.offset + (filters.limit || 50) < data.total : false;
  const hasPrevPage = filters.offset > 0;

  return {
    data,
    tasks: data?.tasks || [],
    total: data?.total || 0,
    loading,
    error,
    filters,
    updateFilters,
    setFilters,
    refetch: fetchHistory,
    // Paginación
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
  };
};

export default useQueueHistory;
