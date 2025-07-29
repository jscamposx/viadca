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

// Corresponde a: GET /admin/paquetes/url/:codigoUrl
export const getPaqueteByUrl = (url) => {
  // Esta ya estaba bien, la dejamos como está para la vista pública.
  return apiClient.get(`/admin/paquetes/url/${url}`);
};

// Corresponde a: POST /admin/paquetes
export const createPaquete = (paqueteData) => {
  return apiClient.post("/admin/paquetes", paqueteData);
};

// Corresponde a: PATCH /admin/paquetes/:id
export const updatePaquete = (id, paqueteData) => {
  // Asegúrate de pasar el ID y no la URL aquí
  return apiClient.patch(`/admin/paquetes/${id}`, paqueteData);
};

// Corresponde a: DELETE /admin/paquetes/:id
export const deletePaquete = (id) => {
  return apiClient.delete(`/admin/paquetes/${id}`);
};

// ... (otras funciones como exportToExcel pueden quedar igual)
