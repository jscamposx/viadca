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

// --- NUEVO MÉTODO AÑADIDO ---
export const uploadBase64Image = (imageData) => {
  // Este endpoint debe coincidir con el de tu backend para subir imágenes
  return apiClient.post("/paquetes/upload-base64", imageData);
};

// Si tienes una función para actualizar, también la puedes tener aquí
export const updatePaquete = (url, paqueteData) => {
    // El endpoint PATCH debería ser por ID, no por URL. 
    // Si es por URL, asegúrate que tu backend lo soporte.
    // Usualmente sería algo como `/paquetes/${paqueteData.id}`
    return apiClient.patch(`/paquetes/url/${url}`, paqueteData);
}