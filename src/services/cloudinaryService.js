import apiClient from "../api/axiosConfig";

// Nota: No exponer API_SECRET en frontend. Usamos unsigned preset.

class CloudinaryService {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsh8njsiu"; // Usar variable de entorno
    this.baseUrl = `https://res.cloudinary.com/${this.cloudName}`;

    console.log("🔧 CloudinaryService initialized:", {
      cloudName: this.cloudName,
      baseUrl: this.baseUrl,
    });
  }

  async uploadImage(file, folder = "viajes_app") {
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (preset) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);
        formData.append("folder", folder);

        const cloudUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
        const res = await fetch(cloudUrl, { method: "POST", body: formData });
        if (!res.ok) {
          const text = await res.text();
            console.warn("⚠️ Falla upload directo Cloudinary, fallback backend", {
            status: res.status,
            body: text?.slice(0, 300),
          });
          throw new Error(`Cloudinary direct upload failed ${res.status}`);
        }
        const data = await res.json();
        return {
          url: data.secure_url || data.url,
          secure_url: data.secure_url || data.url,
          public_id: data.public_id,
          format: data.format,
          bytes: data.bytes,
          width: data.width,
          height: data.height,
          direct: true,
        };
      } catch (e) {
        // fallback al backend si existe endpoint (retrocompatibilidad)
        console.log("↩️ Fallback a endpoint backend /admin/upload/image");
      }
    }
    // Fallback legacy (requiere que backend suba a Cloudinary)
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const response = await apiClient.post("/admin/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error subiendo imagen (fallback backend):", error);
      throw error;
    }
  }

  async uploadMultipleImages(files, folder = "viajes_app") {
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (preset) {
      const results = [];
      for (let i = 0; i < files.length; i++) {
        try {
          const r = await this.uploadImage(files[i], folder);
          results.push({ status: "fulfilled", value: r });
        } catch (e) {
          results.push({ status: "rejected", reason: e });
        }
      }
      return results;
    }
    // Fallback endpoint backend multi
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      formData.append("folder", folder);
      const response = await apiClient.post("/admin/upload/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error subiendo múltiples imágenes (fallback):", error);
      throw error;
    }
  }

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

    // Manejo individual de width/height para evitar transformaciones inválidas
    const hasWidth = width !== undefined && width !== null && width !== "auto";
    const hasHeight = height !== undefined && height !== null && height !== "auto";

    if (hasWidth) transformations.push(`w_${width}`);
    if (hasHeight) transformations.push(`h_${height}`);

    // Evitar usar c_fill cuando falta alguna dimensión (Cloudinary requiere ambas para un recorte determinístico)
    const effectiveCrop =
      crop === "fill" && (!hasWidth || !hasHeight) ? "scale" : crop;
    if (effectiveCrop) transformations.push(`c_${effectiveCrop}`);
    if (gravity && gravity !== "auto") transformations.push(`g_${gravity}`);

    if (quality) transformations.push(`q_${quality}`);
    if (format && format !== "auto") transformations.push(`f_${format}`);

    if (radius) transformations.push(`r_${radius}`);
    if (effect) transformations.push(`e_${effect}`);
    if (overlay) transformations.push(`l_${overlay}`);

    const transformationString =
      transformations.length > 0 ? `/${transformations.join(",")}` : "";

    return `${this.baseUrl}/image/upload${transformationString}/${publicId}`;
  }

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

  processImageUrl(image, options = {}) {
    if (!image) return "https://via.placeholder.com/600x400?text=Sin+Imagen";

    const { tipo, contenido, cloudinary_public_id, cloudinary_url } = image;

    if (tipo === "cloudinary" && cloudinary_public_id) {
      return this.getOptimizedImageUrl(cloudinary_public_id, options);
    }

    if (cloudinary_url) {
      return cloudinary_url;
    }

    if (tipo === "url" || tipo === "google_places_url") {
      if (contenido?.startsWith("http")) {
        return contenido;
      }
    }

    return "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
  }

  processImageUrls(images = [], options = {}) {
    return images.map((img) => this.processImageUrl(img, options));
  }

  validateImageFile(file) {
    if (!file) return false;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const maxSize = 10 * 1024 * 1024;

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  async resizeImage(file, options = {}) {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
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

        ctx.drawImage(img, 0, 0, width, height);

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

  extractPublicId(url) {
    if (!url || !url.includes("cloudinary.com")) return null;

    try {
      // Ejemplos válidos:
      // https://res.cloudinary.com/<cloud>/image/upload/v1699999999/folder/asset_name.jpg
      // https://res.cloudinary.com/<cloud>/image/upload/w_400,h_300,c_fill,q_auto/folder/asset_name.jpg
      // 1) Tomar la parte después de /image/upload/
      const [, afterUpload] = url.split(/\/image\/upload\//);
      if (!afterUpload) return null;

      // 2) Quitar versión v1234567890/ si existe
      const afterVersion = afterUpload.replace(/^v\d+\//, "");

      // 3) El primer segmento antes del primer '/' puede ser transformaciones si contiene 'w_' 'h_' 'c_' etc.
      const segments = afterVersion.split("/");
      if (segments.length === 0) return null;

      const transformationIndicators = ["w_", "h_", "c_", "q_", "g_", "f_", "e_", "r_", "dpr_"]; // comunes
      const first = segments[0];
      const looksLikeTransformation = transformationIndicators.some((t) => first.includes(t) || first.startsWith(t));
      if (looksLikeTransformation) {
        segments.shift(); // quitar bloque de transformaciones
      }

      // 4) Reconstruir public_id (puede incluir subcarpetas) y remover extensión final
      const publicIdWithExt = segments.join("/");
      const publicId = publicIdWithExt.replace(/\.[^.]+$/, "");
      return publicId || null;
    } catch (error) {
      console.error("Error extrayendo public_id:", error);
      return null;
    }
  }

  generateSrcSet(publicId, baseOptions = {}) {
    if (!publicId) return "";

    const sizes = [400, 800, 1200, 1600];

    // Si se proporciona width y height base, mantener la relación de aspecto en las variantes
    const baseWidth =
      baseOptions.width !== undefined && baseOptions.width !== "auto"
        ? Number(baseOptions.width)
        : null;
    const baseHeight =
      baseOptions.height !== undefined && baseOptions.height !== "auto"
        ? Number(baseOptions.height)
        : null;
    const aspect = baseWidth && baseHeight ? baseHeight / baseWidth : null;

    return sizes
      .map((size) => {
        const opts = { ...baseOptions, width: size };
        if (aspect) {
          opts.height = Math.max(1, Math.round(size * aspect));
        } else {
          // sin altura, getOptimizedImageUrl forzará c_scale
          delete opts.height;
        }

        const url = this.getOptimizedImageUrl(publicId, opts);
        return `${url} ${size}w`;
      })
      .join(", ");
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
