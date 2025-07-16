import apiClient from "./axiosConfig";

export const getVuelos = () => {
  return apiClient.get("/vuelos");
};

export const getVueloById = (id) => {
  return apiClient.get(`/vuelos/${id}`);
};

export const createVuelo = (vueloData) => {
  return apiClient.post("/vuelos", vueloData);
};

export const updateVuelo = (id, vueloData) => {
  return apiClient.patch(`/vuelos/${id}`, vueloData);
};

export const deleteVuelo = (id) => {
  return apiClient.delete(`/vuelos/${id}`);
};
