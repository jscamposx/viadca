import apiClient from "./axiosConfig";

export const uploadImageToPaquete = (paqueteId, formData) => {
  return apiClient.post(`/admin/paquetes/${paqueteId}/imagenes`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteImageFromPaquete = (imagenId) => {
  return apiClient.delete(`/admin/paquetes/imagenes/${imagenId}`);
};

export const upload = (data) => {
  return apiClient.post("/imagenes/upload", data);
};

export const uploadBase64Image = (base64Image) => {
  const payload = {
    image: base64Image,
  };
  return upload(payload);
};
