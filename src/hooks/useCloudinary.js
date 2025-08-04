import { useState, useCallback, useRef } from "react";
import { cloudinaryService } from "../services/cloudinaryService.js";

/**
 * Hook personalizado para manejar operaciones de Cloudinary
 * Proporciona funciones y estado para subir, gestionar y optimizar imágenes
 */
export const useCloudinary = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const abortControllerRef = useRef(null);

  // Función para subir una imagen individual
  const uploadImage = useCallback(
    async (file, folder = "viajes_app", options = {}) => {
      try {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        // Validar archivo
        if (!cloudinaryService.validateImageFile(file)) {
          throw new Error(
            "Archivo no válido. Solo se permiten imágenes JPG, PNG, WebP y GIF menores a 10MB.",
          );
        }

        // Redimensionar si es necesario
        const {
          autoResize = true,
          maxWidth = 1920,
          maxHeight = 1080,
          quality = 0.9,
        } = options;

        let fileToUpload = file;
        if (autoResize) {
          setUploadProgress(10);
          fileToUpload = await cloudinaryService.resizeImage(file, {
            maxWidth,
            maxHeight,
            quality,
          });
        }

        setUploadProgress(30);

        // Subir a Cloudinary
        const result = await cloudinaryService.uploadImage(
          fileToUpload,
          folder,
        );

        setUploadProgress(100);

        // Agregar a la lista de imágenes subidas
        const uploadedImage = {
          ...result.data,
          originalFile: file,
          uploadedAt: new Date().toISOString(),
        };

        setUploadedImages((prev) => [...prev, uploadedImage]);

        return uploadedImage;
      } catch (err) {
        console.error("Error subiendo imagen:", err);
        setError(err.message || "Error desconocido al subir imagen");
        throw err;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [],
  );

  // Función para subir múltiples imágenes
  const uploadMultipleImages = useCallback(
    async (files, folder = "viajes_app", options = {}) => {
      try {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        const filesArray = Array.from(files);
        const {
          autoResize = true,
          maxWidth = 1920,
          maxHeight = 1080,
          quality = 0.9,
          onProgress,
        } = options;

        // Validar todos los archivos
        const invalidFiles = filesArray.filter(
          (file) => !cloudinaryService.validateImageFile(file),
        );
        if (invalidFiles.length > 0) {
          throw new Error(
            `Archivos no válidos: ${invalidFiles.map((f) => f.name).join(", ")}`,
          );
        }

        const results = [];
        const totalFiles = filesArray.length;

        for (let i = 0; i < filesArray.length; i++) {
          const file = filesArray[i];

          try {
            // Redimensionar si es necesario
            let fileToUpload = file;
            if (autoResize) {
              fileToUpload = await cloudinaryService.resizeImage(file, {
                maxWidth,
                maxHeight,
                quality,
              });
            }

            // Subir archivo
            const result = await cloudinaryService.uploadImage(
              fileToUpload,
              folder,
            );

            const uploadedImage = {
              ...result.data,
              originalFile: file,
              uploadedAt: new Date().toISOString(),
            };

            results.push(uploadedImage);

            // Actualizar progreso
            const progress = Math.round(((i + 1) / totalFiles) * 100);
            setUploadProgress(progress);
            onProgress?.(progress, i + 1, totalFiles);
          } catch (fileError) {
            console.error(`Error subiendo ${file.name}:`, fileError);
            results.push({
              error: fileError.message,
              file,
              success: false,
            });
          }
        }

        // Separar éxitos de errores
        const successful = results.filter((r) => !r.error);
        const failed = results.filter((r) => r.error);

        // Agregar exitosos a la lista
        if (successful.length > 0) {
          setUploadedImages((prev) => [...prev, ...successful]);
        }

        // Si hay errores, mostrarlos
        if (failed.length > 0) {
          const errorMessages = failed
            .map((f) => `${f.file.name}: ${f.error}`)
            .join("\n");
          setError(`Algunos archivos fallaron:\n${errorMessages}`);
        }

        return {
          successful,
          failed,
          total: totalFiles,
        };
      } catch (err) {
        console.error("Error subiendo múltiples imágenes:", err);
        setError(err.message || "Error desconocido al subir imágenes");
        throw err;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [],
  );

  // Función para eliminar una imagen
  const deleteImage = useCallback(async (publicId) => {
    try {
      setError(null);

      await cloudinaryService.deleteImage(publicId);

      // Remover de la lista local
      setUploadedImages((prev) =>
        prev.filter((img) => img.public_id !== publicId),
      );

      return true;
    } catch (err) {
      console.error("Error eliminando imagen:", err);
      setError(err.message || "Error desconocido al eliminar imagen");
      throw err;
    }
  }, []);

  // Función para obtener URL optimizada
  const getOptimizedUrl = useCallback((publicIdOrImage, options = {}) => {
    if (!publicIdOrImage) return null;

    // Si es un objeto imagen completo
    if (typeof publicIdOrImage === "object") {
      return cloudinaryService.processImageUrl(publicIdOrImage, options);
    }

    // Si es un public_id o URL
    return cloudinaryService.getOptimizedImageUrl(publicIdOrImage, options);
  }, []);

  // Función para obtener URLs responsivas
  const getResponsiveUrls = useCallback((publicIdOrImage) => {
    if (!publicIdOrImage) return null;

    // Si es un objeto imagen con public_id
    if (
      typeof publicIdOrImage === "object" &&
      publicIdOrImage.cloudinary_public_id
    ) {
      return cloudinaryService.getResponsiveImageUrls(
        publicIdOrImage.cloudinary_public_id,
      );
    }

    // Si es un public_id
    return cloudinaryService.getResponsiveImageUrls(publicIdOrImage);
  }, []);

  // Función para generar srcSet
  const generateSrcSet = useCallback((publicId) => {
    if (!publicId) return "";
    return cloudinaryService.generateSrcSet(publicId);
  }, []);

  // Función para limpiar el estado
  const clearState = useCallback(() => {
    setUploadedImages([]);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
  }, []);

  // Función para cancelar upload (si implementamos AbortController en el futuro)
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

  // Función para validar archivo
  const validateFile = useCallback((file) => {
    return cloudinaryService.validateImageFile(file);
  }, []);

  // Función para redimensionar imagen localmente
  const resizeImage = useCallback(async (file, options = {}) => {
    return cloudinaryService.resizeImage(file, options);
  }, []);

  return {
    // Estado
    isUploading,
    uploadProgress,
    error,
    uploadedImages,

    // Funciones principales
    uploadImage,
    uploadMultipleImages,
    deleteImage,

    // Funciones de optimización
    getOptimizedUrl,
    getResponsiveUrls,
    generateSrcSet,

    // Funciones utilitarias
    validateFile,
    resizeImage,
    clearState,
    cancelUpload,

    // Getters
    hasUploads: uploadedImages.length > 0,
    totalUploads: uploadedImages.length,
    lastUpload: uploadedImages[uploadedImages.length - 1] || null,

    // Servicios directos (para casos avanzados)
    cloudinaryService,
  };
};

export default useCloudinary;
