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

const queueService = {
  getQueueStatus,
  clearQueueStatusCache,
};

export default queueService;
export { getQueueStatus, clearQueueStatusCache };
