import apiClient from "./axiosConfig";

export const getTrashItems = () => {
  return apiClient.get("/papelera");
};

export const restoreTrashItem = (id, tipo) => {
  return apiClient.patch("/papelera/restaurar", { id, tipo });
};

export const deleteTrashItem = (tipo, id) => {
  return apiClient.delete(`/papelera/${tipo}/${id}`);
};
