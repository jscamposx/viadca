import apiClient from './axiosConfig';


export const getPaquetes = () => {
  return apiClient.get('/paquetes');
};


export const getPaqueteByUrl = (url) => {
  return apiClient.get(`/paquetes/${url}`);
};


export const createPaquete = (paqueteData) => {
  return apiClient.post('/paquetes', paqueteData);
};

