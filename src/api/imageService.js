import apiClient from "./axiosConfig";

export const upload = (data) => {
  return apiClient.post("/imagenes/upload", data);
};

export const uploadBase64Image = (base64Image) => {
  const payload = {
    image: base64Image,
  };
  return upload(payload);
};
