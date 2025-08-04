import apiClient from "./axiosConfig";
import { cloudinaryService } from "../services/cloudinaryService.js";

// Funciones existentes para paquetes
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

// Nuevas funciones para Cloudinary
export const uploadToCloudinary = async (file, folder = "viajes_app") => {
  return cloudinaryService.uploadImage(file, folder);
};

export const uploadMultipleToCloudinary = async (
  files,
  folder = "viajes_app",
) => {
  return cloudinaryService.uploadMultipleImages(files, folder);
};

export const deleteFromCloudinary = async (publicId) => {
  return cloudinaryService.deleteImage(publicId);
};

export const validateImageFile = (file) => {
  return cloudinaryService.validateImageFile(file);
};

export const resizeImage = async (file, options = {}) => {
  return cloudinaryService.resizeImage(file, options);
};

// Exportar el servicio para uso directo
export { cloudinaryService };

// Función combinada para subir imagen a paquete usando Cloudinary
export const uploadImageToPaqueteWithCloudinary = async (
  paqueteId,
  file,
  folder = "paquetes",
) => {
  try {
    // Validar archivo
    if (!cloudinaryService.validateImageFile(file)) {
      throw new Error(
        "Archivo no válido. Solo se permiten imágenes JPG, PNG, WebP y GIF menores a 10MB.",
      );
    }

    // Redimensionar si es necesario
    const optimizedFile = await cloudinaryService.resizeImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.9,
    });

    // Subir a Cloudinary
    const cloudinaryResult = await cloudinaryService.uploadImage(
      optimizedFile,
      folder,
    );

    // Crear FormData para enviar al backend
    const formData = new FormData();
    formData.append("tipo", "cloudinary");
    formData.append("contenido", cloudinaryResult.data.url);
    formData.append("cloudinary_public_id", cloudinaryResult.data.public_id);
    formData.append("cloudinary_url", cloudinaryResult.data.url);

    // Enviar al backend
    const response = await uploadImageToPaquete(paqueteId, formData);

    return {
      ...response.data,
      cloudinary: cloudinaryResult.data,
    };
  } catch (error) {
    console.error("Error subiendo imagen con Cloudinary:", error);
    throw error;
  }
};
