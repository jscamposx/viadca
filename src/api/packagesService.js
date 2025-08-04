import apiClient from "./axiosConfig";

export const getPaquetes = (page = 1, limit = 10) => {
  return apiClient.get("/admin/paquetes", {
    params: { page, limit },
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
  return apiClient.get(`/admin/paquetes/${id}/export`, {
    responseType: "blob",
  });
};
