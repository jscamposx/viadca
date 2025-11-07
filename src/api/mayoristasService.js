import apiClient from "./axiosConfig";
import { buildPaginatedParams } from "./params";

export const getMayoristas = (page = 1, limit = 6, search) => {
  return apiClient.get("/admin/mayoristas", {
    params: buildPaginatedParams({ page, limit, search }),
  });
};

// Obtener TODOS los mayoristas sin paginación (para filtros rápidos)
export const getAllMayoristas = () => {
  return apiClient.get("/admin/mayoristas", {
    params: { noPagination: 'true' },
  });
};

export const getMayoristaById = (id) => {
  return apiClient.get(`/admin/mayoristas/${id}`);
};

export const getMayoristaByClave = (clave) => {
  return apiClient.get(`/mayoristas/${clave}`);
};

export const createMayorista = (mayoristaData) => {
  if (import.meta.env.DEV) {
    console.log("📤 Enviando request de creación de mayorista:", {
      data: mayoristaData,
      endpoint: "/admin/mayoristas",
      method: "POST",
    });
  }
  return apiClient.post("/admin/mayoristas", mayoristaData);
};

export const updateMayorista = (id, mayoristaData) => {
  return apiClient.patch(`/admin/mayoristas/${id}`, mayoristaData);
};

export const deleteMayorista = (id) => {
  return apiClient.delete(`/admin/mayoristas/${id}`);
};

// Stats overview: { total, mayoristas, tipos }
export const getMayoristasStatsOverview = () => {
  return apiClient.get("/admin/mayoristas/stats/overview");
};
