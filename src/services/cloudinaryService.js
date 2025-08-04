/**
 * Servicio para manejo de imágenes con Cloudinary
 * Proporciona funciones para subir, optimizar y gestionar imágenes
 */

import apiClient from "../api/axiosConfig";

class CloudinaryService {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsh8njsiu"; // Usar variable de entorno
    this.baseUrl = `https://res.cloudinary.com/${this.cloudName}`;

    // Debug log para verificar la configuración
    console.log("🔧 CloudinaryService initialized:", {
      cloudName: this.cloudName,
      baseUrl: this.baseUrl,
    });
  }

  /**
   * Sube una imagen individual a Cloudinary a través del backend
   * @param {File} file - Archivo de imagen
   * @param {string} folder - Carpeta de destino (opcional)
   * @returns {Promise<Object>} Respuesta con URL y public_id
   */
  async uploadImage(file, folder = "viajes_app") {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await apiClient.post("/admin/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error subiendo imagen a Cloudinary:", error);
      throw error;
    }
  }

  /**
   * Sube múltiples imágenes a Cloudinary
   * @param {FileList|Array} files - Lista de archivos
   * @param {string} folder - Carpeta de destino (opcional)
   * @returns {Promise<Array>} Array con respuestas de cada imagen
   */
  async uploadMultipleImages(files, folder = "viajes_app") {
    try {
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      formData.append("folder", folder);

      const response = await apiClient.post("/admin/upload/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error subiendo múltiples imágenes:", error);
      throw error;
    }
  }

  /**
   * Elimina una imagen de Cloudinary
   * @param {string} publicId - ID público de la imagen en Cloudinary
   * @returns {Promise<Object>} Respuesta de eliminación
   */
  async deleteImage(publicId) {
    try {
      const encodedPublicId = encodeURIComponent(publicId);
      const response = await apiClient.delete(
        `/admin/upload/image/${encodedPublicId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error eliminando imagen de Cloudinary:", error);
      throw error;
    }
  }

  /**
   * Obtiene una URL optimizada de Cloudinary con transformaciones
   * @param {string} publicId - ID público de la imagen
   * @param {Object} options - Opciones de transformación
   * @returns {string} URL optimizada
   */
  getOptimizedImageUrl(publicId, options = {}) {
    if (!publicId) return "https://via.placeholder.com/600x400?text=Sin+Imagen";

    const {
      width = "auto",
      height = "auto",
      quality = "auto",
      format = "auto",
      crop = "fill",
      gravity = "auto",
      radius = null,
      effect = null,
      overlay = null,
    } = options;

    let transformations = [];

    // Dimensiones
    if (width !== "auto" || height !== "auto") {
      transformations.push(`w_${width},h_${height}`);
    }

    // Recorte y gravedad
    if (crop) transformations.push(`c_${crop}`);
    if (gravity && gravity !== "auto") transformations.push(`g_${gravity}`);

    // Calidad y formato
    if (quality) transformations.push(`q_${quality}`);
    if (format && format !== "auto") transformations.push(`f_${format}`);

    // Efectos adicionales
    if (radius) transformations.push(`r_${radius}`);
    if (effect) transformations.push(`e_${effect}`);
    if (overlay) transformations.push(`l_${overlay}`);

    const transformationString =
      transformations.length > 0 ? `/${transformations.join(",")}` : "";

    return `${this.baseUrl}/image/upload${transformationString}/${publicId}`;
  }

  /**
   * Obtiene múltiples URLs optimizadas para diferentes tamaños
   * @param {string} publicId - ID público de la imagen
   * @returns {Object} Objeto con URLs para diferentes tamaños
   */
  getResponsiveImageUrls(publicId) {
    if (!publicId) {
      const placeholder = "https://via.placeholder.com/";
      return {
        thumbnail: `${placeholder}150x150?text=Sin+Imagen`,
        small: `${placeholder}400x300?text=Sin+Imagen`,
        medium: `${placeholder}800x600?text=Sin+Imagen`,
        large: `${placeholder}1200x900?text=Sin+Imagen`,
        original: `${placeholder}1920x1080?text=Sin+Imagen`,
      };
    }

    return {
      thumbnail: this.getOptimizedImageUrl(publicId, {
        width: 150,
        height: 150,
        crop: "thumb",
        quality: 80,
      }),
      small: this.getOptimizedImageUrl(publicId, {
        width: 400,
        height: 300,
        quality: 85,
      }),
      medium: this.getOptimizedImageUrl(publicId, {
        width: 800,
        height: 600,
        quality: 90,
      }),
      large: this.getOptimizedImageUrl(publicId, {
        width: 1200,
        height: 900,
        quality: 90,
      }),
      original: this.getOptimizedImageUrl(publicId, {
        quality: "auto",
        format: "auto",
      }),
    };
  }

  /**
   * Procesa una imagen del backend para mostrarla correctamente
   * Detecta si es Cloudinary, URL externa o base64 y devuelve la URL apropiada
   * @param {Object} image - Objeto imagen del backend
   * @param {Object} options - Opciones de optimización
   * @returns {string} URL procesada
   */
  processImageUrl(image, options = {}) {
    if (!image) return "https://via.placeholder.com/600x400?text=Sin+Imagen";

    const { tipo, contenido, cloudinary_public_id, cloudinary_url } = image;

    // Si es una imagen de Cloudinary
    if (tipo === "cloudinary" && cloudinary_public_id) {
      return this.getOptimizedImageUrl(cloudinary_public_id, options);
    }

    // Si tiene URL de Cloudinary pero no public_id (para compatibilidad)
    if (cloudinary_url) {
      return cloudinary_url;
    }

    // Para URLs externas (Google Places, etc.)
    if (tipo === "url" || tipo === "google_places_url") {
      if (contenido?.startsWith("http")) {
        return contenido;
      }
    }

    // Para contenido base64 (legacy)
    if (tipo === "base64" && contenido) {
      if (contenido.startsWith("data:")) {
        return contenido;
      }
      return `data:image/jpeg;base64,${contenido}`;
    }

    // Fallback
    return "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
  }

  /**
   * Procesa una lista de imágenes del backend
   * @param {Array} images - Array de objetos imagen
   * @param {Object} options - Opciones de optimización
   * @returns {Array} Array de URLs procesadas
   */
  processImageUrls(images = [], options = {}) {
    return images.map((img) => this.processImageUrl(img, options));
  }

  /**
   * Valida si un archivo es una imagen válida
   * @param {File} file - Archivo a validar
   * @returns {boolean} True si es válido
   */
  validateImageFile(file) {
    if (!file) return false;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Redimensiona una imagen en el cliente antes de subirla
   * @param {File} file - Archivo original
   * @param {Object} options - Opciones de redimensionado
   * @returns {Promise<File>} Archivo redimensionado
   */
  async resizeImage(file, options = {}) {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          quality,
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Extrae el public_id de una URL de Cloudinary
   * @param {string} url - URL de Cloudinary
   * @returns {string|null} Public ID extraído
   */
  extractPublicId(url) {
    if (!url || !url.includes("cloudinary.com")) return null;

    try {
      // Patrón para URLs de Cloudinary: .../image/upload/v123456/folder/image.ext
      const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Error extrayendo public_id:", error);
      return null;
    }
  }

  /**
   * Genera un srcSet para imágenes responsivas
   * @param {string} publicId - ID público de la imagen
   * @returns {string} String srcSet para uso en <img>
   */
  generateSrcSet(publicId) {
    if (!publicId) return "";

    const sizes = [400, 800, 1200, 1600];

    return sizes
      .map((size) => {
        const url = this.getOptimizedImageUrl(publicId, {
          width: size,
          quality: "auto",
          format: "auto",
        });
        return `${url} ${size}w`;
      })
      .join(", ");
  }
}

// Instancia singleton
export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
