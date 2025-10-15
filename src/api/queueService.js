import apiClient from "./axiosConfig";

const CACHE_TTL_MS = 5000; // reutilizar respuesta por hasta 5s para evitar golpear el endpoint en exceso

let lastResponse = null;
let lastResponseTs = 0;
let inFlightPromise = null;

const getQueueStatus = async ({ signal, force = false } = {}) => {
  const now = Date.now();

  if (!force && lastResponse && now - lastResponseTs < CACHE_TTL_MS) {
    return lastResponse;
  }

  if (!force && inFlightPromise) {
    return inFlightPromise;
  }

  const request = apiClient
    .get("/admin/queue/status", { signal })
    .then((res) => res.data)
    .then((data) => {
      lastResponse = data;
      lastResponseTs = Date.now();
      return data;
    })
    .finally(() => {
      if (inFlightPromise === request) {
        inFlightPromise = null;
      }
    });

  if (!force) {
    inFlightPromise = request;
  }

  return request;
};

const clearQueueStatusCache = () => {
  lastResponse = null;
  lastResponseTs = 0;
};

/**
 * Obtener historial de tareas con filtros opcionales
 * @param {Object} filters - Filtros: status, usuarioId, startDate, endDate, endpoint, method, limit, offset
 */
const getQueueHistory = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.usuarioId) params.append("usuarioId", filters.usuarioId.toString());
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.endpoint) params.append("endpoint", filters.endpoint);
  if (filters.method) params.append("method", filters.method);
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.offset) params.append("offset", filters.offset.toString());

  const response = await apiClient.get(`/admin/queue/history?${params.toString()}`);
  return response.data;
};

/**
 * Obtener estadísticas agregadas de la cola
 * @param {Object} filters - Filtros: startDate, endDate, usuarioId
 */
const getQueueStats = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.usuarioId) params.append("usuarioId", filters.usuarioId.toString());

  const response = await apiClient.get(`/admin/queue/stats?${params.toString()}`);
  return response.data;
};

/**
 * Obtener estadísticas de almacenamiento
 */
const getQueueStorage = async () => {
  const response = await apiClient.get("/admin/queue/storage");
  return response.data;
};

/**
 * Ejecutar limpieza manual de registros antiguos
 * @param {number} daysToKeep - Días de retención (por defecto 30)
 */
const cleanupQueue = async (daysToKeep = 30) => {
  const response = await apiClient.post("/admin/queue/cleanup", { daysToKeep });
  return response.data;
};

const queueService = {
  getQueueStatus,
  clearQueueStatusCache,
  getQueueHistory,
  getQueueStats,
  getQueueStorage,
  cleanupQueue,
};

export default queueService;
export { getQueueStatus, clearQueueStatusCache };
