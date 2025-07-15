import apiClient from "./axiosConfig";

/**
 * Sube una imagen codificada en Base64.
 * @param {string} base64Image - La porción de datos puros de la cadena Base64.
 * @returns {Promise<axios.AxiosResponse<{url: string}>>}
 */
export const uploadBase64Image = (base64Image) => {
  const payload = {
    image: base64Image,
  };
  
  // --- CORRECCIÓN FINAL ---
  // Ajustamos la URL para que coincida con tu nuevo endpoint mapeado.
  return apiClient.post("/imagenes/upload", payload);
};