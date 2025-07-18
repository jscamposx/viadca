import apiClient from "./axiosConfig";

export const getPaquetes = () => {
  return apiClient.get("/paquetes");
};

export const getPaqueteByUrl = (url) => {
  return apiClient.get(`/paquetes/${url}`);
};

export const createPaquete = (paqueteData) => {
  return apiClient.post("/paquetes", paqueteData);
};

export const uploadBase64Image = (imageData) => {
  return apiClient.post("/paquetes/upload-base64", imageData);
};

export const updatePaquete = (url, paqueteData) => {
  return apiClient.patch(`/paquetes/url/${url}`, paqueteData);
};

export const exportToExcel = (id) => {
  return apiClient.get(`/paquetes/export/excel/${id}`, {
    responseType: "blob",
  });
};


export const deletePaquete = (id) => {
  return apiClient.delete(`/paquetes/${id}`);
};