// src/api/packagesService.js

import apiClient from "./axiosConfig";

// Corresponde a: GET /admin/paquetes
export const getPaquetes = () => {
  return apiClient.get("/admin/paquetes");
};

// Corresponde a: GET /admin/paquetes/:id
export const getPaqueteById = (id) => {
  return apiClient.get(`/admin/paquetes/${id}`);
};

// Corresponde a: GET /paquetes/:codigoUrl (endpoint público)
export const getPaqueteByUrl = (codigoUrl) => {
  return apiClient.get(`/paquetes/${codigoUrl}`);
};

// Corresponde a: POST /admin/paquetes
export const createPaquete = (paqueteData) => {
  return apiClient.post("/admin/paquetes", paqueteData);
};

// Corresponde a: PATCH /admin/paquetes/:id
export const updatePaquete = (id, paqueteData) => {
  return apiClient.patch(`/admin/paquetes/${id}`, paqueteData);
};

// Corresponde a: DELETE /admin/paquetes/:id
export const deletePaquete = (id) => {
  return apiClient.delete(`/admin/paquetes/${id}`);
};

// Función para exportar paquete a Excel (usando ID)
export const exportToExcel = (id) => {
  return apiClient.get(`/admin/paquetes/${id}/export`, {
    responseType: 'blob',
  });
};
