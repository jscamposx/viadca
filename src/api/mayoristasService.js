// src/api/mayoristasService.js

import apiClient from "./axiosConfig";

// Corresponde a: GET /admin/mayoristas
export const getMayoristas = () => {
  return apiClient.get("/admin/mayoristas");
};

// Corresponde a: GET /admin/mayoristas/:id
export const getMayoristaById = (id) => {
  return apiClient.get(`/admin/mayoristas/${id}`);
};

// Corresponde a: GET /mayoristas/:clave (endpoint público si es necesario)
export const getMayoristaByClave = (clave) => {
  return apiClient.get(`/mayoristas/${clave}`);
};

// Corresponde a: POST /admin/mayoristas
export const createMayorista = (mayoristaData) => {
  return apiClient.post("/admin/mayoristas", mayoristaData);
};

// Corresponde a: PATCH /admin/mayoristas/:id
export const updateMayorista = (id, mayoristaData) => {
  return apiClient.patch(`/admin/mayoristas/${id}`, mayoristaData);
};

// Corresponde a: DELETE /admin/mayoristas/:id
export const deleteMayorista = (id) => {
  return apiClient.delete(`/admin/mayoristas/${id}`);
};
