import { cloudinaryService } from "../services/cloudinaryService.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getImageUrl = (urlOrImage, options = {}) => {
  const {
    width = 600,
    height = 400,
    quality = "auto",
    format = "auto",
  } = options;

  if (!urlOrImage) return "https://via.placeholder.com/600x400?text=Sin+Imagen";

  if (typeof urlOrImage === "object" && urlOrImage !== null) {
    return cloudinaryService.processImageUrl(urlOrImage, options);
  }

  const url = urlOrImage;

  if (typeof url === "string" && url.includes("cloudinary.com")) {
    const publicId = cloudinaryService.extractPublicId(url);
    if (publicId) {
      return cloudinaryService.getOptimizedImageUrl(publicId, options);
    }
    return url;
  }

  if (typeof url === "string" && url.startsWith("http")) {
    if (url.includes("images.pexels.com")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl}?auto=compress&w=${width}&h=${height}&fit=crop&fm=webp&q=${quality === "auto" ? 75 : quality}`;
    }
    return url;
  }

  if (
    typeof url === "string" &&
    (url.startsWith("/uploads") || url.startsWith("uploads/"))
  ) {
    return `${API_URL}/${url.replace(/^\/+/, "")}`;
  }

  // Activos del front (ubicados en /public) — lista blanca de prefijos conocidos
  if (typeof url === "string" && url.startsWith("/")) {
    const publicPrefixes = [
      "/HomePage/",
      "/videos/",
      "/favicon.svg",
      "/robots.txt",
      "/sitemap.xml",
      "/viadca-icon.avif",
      "/viadcalogo.avif",
      "/assets/", // Vite assets
    ];
    const isPublicAsset = publicPrefixes.some((p) => url.startsWith(p));
    // Si no es un asset público conocido, asumir que pertenece al backend
    return isPublicAsset ? url : `${API_URL}/${url.replace(/^\/+/, "")}`;
  }

  if (typeof url === "string") {
    return `${API_URL}/${url}`;
  }

  return "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
};

export const processImageUrls = (images = [], options = {}) => {
  return images.map((img) => {
    if (
      img &&
      typeof img === "object" &&
      (img.tipo || img.cloudinary_public_id || img.contenido)
    ) {
      return getImageUrl(img, options);
    }

    const url = img.url || img.contenido || img;
    return getImageUrl(url, options);
  });
};

export const getResponsiveImageUrls = (urlOrImage) => {
  if (!urlOrImage) {
    const placeholder = "https://via.placeholder.com/";
    return {
      thumbnail: `${placeholder}150x150?text=Sin+Imagen`,
      small: `${placeholder}400x300?text=Sin+Imagen`,
      medium: `${placeholder}800x600?text=Sin+Imagen`,
      large: `${placeholder}1200x900?text=Sin+Imagen`,
      original: `${placeholder}1920x1080?text=Sin+Imagen`,
    };
  }

  if (typeof urlOrImage === "object" && urlOrImage.cloudinary_public_id) {
    return cloudinaryService.getResponsiveImageUrls(
      urlOrImage.cloudinary_public_id,
    );
  }

  if (typeof urlOrImage === "string" && urlOrImage.includes("cloudinary.com")) {
    const publicId = cloudinaryService.extractPublicId(urlOrImage);
    if (publicId) {
      return cloudinaryService.getResponsiveImageUrls(publicId);
    }
  }

  const url =
    typeof urlOrImage === "object"
      ? urlOrImage.url || urlOrImage.contenido
      : urlOrImage;
  const processedUrl = getImageUrl(url);

  return {
    thumbnail: processedUrl,
    small: processedUrl,
    medium: processedUrl,
    large: processedUrl,
    original: processedUrl,
  };
};

export const normalizeImageUrl = (url, isServerContent = false) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  if (url.startsWith("/uploads") || url.startsWith("uploads/")) {
    return `${API_URL}/${url.replace(/^\/+/, "")}`;
  }

  return url;
};

export const isNewImage = (image) => {
  if (!image) return false;

  if (!image.id || image.id.includes("temp-") || image.id.includes("new-")) {
    return true;
  }

  if (image.file) {
    return true;
  }

  if (image.id && image.originalContent) {
    return false;
  }

  const hasValidId =
    image.id &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
      image.id,
    );
  if (hasValidId && !image.file) {
    return false;
  }

  return true;
};

export const isExistingImage = (image) => {
  if (!image) return false;

  console.log("🔍 Verificando si imagen es existente:", {
    id: image.id,
    hasFile: !!image.file,
    isTemp:
      image.id?.toString().includes("temp-") ||
      image.id?.toString().includes("new-") ||
      image.id?.toString().includes("img-"),
    originalContent: !!image.originalContent,
  });

  const hasValidId =
    image.id &&
    (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i.test(
      image.id,
    ) ||
      /^\d+$/.test(image.id.toString()));

  const isExisting =
    hasValidId &&
    !image.id.toString().includes("temp-") &&
    !image.id.toString().includes("new-") &&
    !image.id.toString().includes("img-") &&
    !image.file;

  console.log("🔍 Resultado:", { isExisting, hasValidId });
  return isExisting;
};

export const createOrderOnlyPayload = (images) => {
  return images.filter(isExistingImage).map((img, index) => ({
    id: img.id,
    orden: index + 1,
  }));
};
