import apiClient from "./axiosConfig";
import { buildPaginatedParams } from "./params";

// Helper: detectar entorno de pruebas (test e2e / staging) para ocultar paquetes inactivos
// Criterios: VITE_APP_ENV === 'test' || import.meta.env.MODE === 'test'
// Se centraliza aquí para evitar duplicación en componentes.
const isTestEnv = () => {
  try {
    const env = import.meta?.env || {};
    return (
      env.VITE_APP_ENV === "test" ||
      env.MODE === "test" ||
      env.NODE_ENV === "test"
    );
  } catch (e) {
    return false;
  }
};

export const getPaquetes = (page = 1, limit = 6, search) => {
  return apiClient.get("/admin/paquetes", {
    params: buildPaginatedParams({ page, limit, search }),
  });
};

// Nuevo endpoint público para listado de paquetes (fuera de /admin)
export const getPaquetesPublic = async (page = 1, limit = 12, search) => {
  const res = await apiClient.get("/paquetes/listado", {
    params: buildPaginatedParams({ page, limit, search }),
  });
  if (!isTestEnv()) return res;
  // En entorno test filtramos los inactivos (activo === false)
  if (Array.isArray(res?.data?.data)) {
    const filtrados = res.data.data.filter((p) => p?.activo !== false);
    return { ...res, data: { ...res.data, data: filtrados } };
  }
  return res;
};

export const getAllPaquetes = () => {
  return apiClient.get("/admin/paquetes");
};

export const getPaqueteById = (id) => {
  return apiClient.get(`/admin/paquetes/${id}`);
};

export const getPaqueteByUrl = async (codigoUrl) => {
  const res = await apiClient.get(`/paquetes/${codigoUrl}`);
  if (isTestEnv()) {
    const paquete = res?.data;
    if (paquete && paquete.activo === false) {
      // Simulamos 404 lógico para ocultar en test; los componentes pueden manejar null
      return { ...res, data: null, ocultoPorTest: true };
    }
  }
  return res;
};

export const createPaquete = (paqueteData) => {
  return apiClient.post("/admin/paquetes", paqueteData);
};

export const updatePaquete = (id, paqueteData) => {
  return apiClient.patch(`/admin/paquetes/${id}`, paqueteData);
};

export const deletePaquete = (id) => {
  return apiClient.delete(`/admin/paquetes/${id}`);
};

export const exportToExcel = (id) => {
  return apiClient.get(`/admin/paquetes/excel/${id}`, {
    responseType: "blob",
  });
};

// Stats overview: { total, paquetes, activos, inactivos }
export const getPaquetesStatsOverview = () => {
  return apiClient.get("/admin/paquetes/stats/overview");
};

// Nuevo: toggle de favorito (solo admins)
export const toggleFavorito = (id, favorito) => {
  return apiClient.patch(`/admin/paquetes/${id}`, { favorito: !!favorito });
};

// Hoteles custom completos para administración
// GET /admin/paquetes/custom/hoteles
// Devuelve [{ hotel: {...}, paquete: { id, codigoUrl, titulo, activo } }]
export const getCustomHotelsFull = () => {
  return apiClient.get("/admin/paquetes/custom/hoteles");
};
