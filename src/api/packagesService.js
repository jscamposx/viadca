import apiClient from "./axiosConfig";
import { buildPaginatedParams } from "./params";

export const getPaquetes = (page = 1, limit = 6, search) => {
  return apiClient.get("/admin/paquetes", {
    params: buildPaginatedParams({ page, limit, search }),
  });
};

export const getAllPaquetes = () => {
  return apiClient.get("/admin/paquetes");
};

export const getPaqueteById = (id) => {
  return apiClient.get(`/admin/paquetes/${id}`);
};

export const getPaqueteByUrl = (codigoUrl) => {
  return apiClient.get(`/paquetes/${codigoUrl}`);
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
