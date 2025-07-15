import apiClient from "./axiosConfig";

export const getVuelos = () => {
  return apiClient.get("/vuelos");
};

export const getVueloById = (id) => {
  return apiClient.get(`/vuelos/${id}`);
};

/**
 * Crea o actualiza un vuelo enviando datos JSON.
 * Tu backend ya maneja la creación/actualización de imágenes
 * si se incluye el array 'imagenes' en el payload.
 */
export const createVuelo = (vueloData) => {
  return apiClient.post("/vuelos", vueloData);
};

export const updateVuelo = (id, vueloData) => {
  return apiClient.patch(`/vuelos/${id}`, vueloData);
};

export const deleteVuelo = (id) => {
  return apiClient.delete(`/vuelos/${id}`);
};