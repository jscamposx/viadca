import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import queueService from "../../../api/queueService";

const DEFAULT_POLL_INTERVAL = 10000; // 10s

export const useQueueStatus = ({
  pollInterval = DEFAULT_POLL_INTERVAL,
  enabled = true,
  immediate = true,
} = {}) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && immediate));
  const [error, setError] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const isMountedRef = useRef(false);
  const pollTimerRef = useRef(null);
  const controllerRef = useRef(null);
  const statusRef = useRef(null);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const fetchStatus = useCallback(
    async ({ force = false, skipLoading = false } = {}) => {
      if (!enabled) return null;

      // Cancelar petición anterior si existe
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      if (!skipLoading) {
        setLoading(true);
      }

      try {
        const data = await queueService.getQueueStatus({
          signal: controller.signal,
          force,
        });

        if (!isMountedRef.current) return null;

        statusRef.current = data;
        setStatus(data);
        setError(null);
        setLastUpdatedAt(new Date());
        return data;
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          return null;
        }
        if (!isMountedRef.current) return null;
        setError(err);
        return null;
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
        if (!skipLoading && isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [enabled],
  );

  const schedulePoll = useCallback(() => {
    clearPollTimer();
    if (!enabled) return;

    const tick = async () => {
      await fetchStatus({ skipLoading: statusRef.current != null });
      if (!isMountedRef.current || !enabled) return;
      pollTimerRef.current = setTimeout(tick, pollInterval);
    };

    pollTimerRef.current = setTimeout(tick, immediate ? 0 : pollInterval);
  }, [clearPollTimer, enabled, fetchStatus, immediate, pollInterval]);

  useEffect(() => {
    isMountedRef.current = true;
    if (enabled) {
      schedulePoll();
    }

    return () => {
      isMountedRef.current = false;
      clearPollTimer();
      controllerRef.current?.abort();
    };
  }, [clearPollTimer, enabled, schedulePoll]);

  const refresh = useCallback(() => fetchStatus({ force: true }), [fetchStatus]);

  const isStale = useMemo(() => {
    if (!lastUpdatedAt) return false;
    const age = Date.now() - lastUpdatedAt.getTime();
    return age > pollInterval * 2;
  }, [lastUpdatedAt, pollInterval]);

  return {
    status,
    loading,
    error,
    refresh,
    lastUpdatedAt,
    isStale,
    pollInterval,
    isPolling: enabled,
  };
};

export default useQueueStatus;
