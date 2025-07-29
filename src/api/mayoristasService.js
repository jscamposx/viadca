// src/api/mayoristasService.js

import apiClient from "./axiosConfig";

// Corresponde a: GET /admin/mayoristas
export const getMayoristas = () => {
  return apiClient.get("/admin/mayoristas");
};

// Corresponde a: POST /admin/mayoristas
export const createMayorista = (mayoristaData) => {
  return apiClient.post("/admin/mayoristas", mayoristaData);
};
