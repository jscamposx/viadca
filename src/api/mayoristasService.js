import apiClient from "./axiosConfig";

export const getMayoristas = () => {
  return apiClient.get("/admin/mayoristas");
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
      method: "POST"
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
