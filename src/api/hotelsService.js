import apiClient from "./axiosConfig";

export const getHotels = () => {
  return apiClient.get("/hoteles");
};

export const getHotelById = (id) => {
  return apiClient.get(`/hoteles/${id}`);
};

export const createHotel = (hotelData) => {
  return apiClient.post("/hoteles", hotelData);
};

export const updateHotel = (id, hotelData) => {
  return apiClient.patch(`/hoteles/${id}`, hotelData);
};

export const deleteHotel = (id) => {
  return apiClient.delete(`/hoteles/${id}`);
};