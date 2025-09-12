import React, { useState, useCallback, useMemo } from "react";
import { getImageUrl, getResponsiveImageUrls } from "../../utils/imageUtils.js";
import { cloudinaryService } from "../../services/cloudinaryService.js";

/**
 * Componente optimizado para mostrar imágenes con soporte completo para Cloudinary
 * Incluye lazy loading, imágenes responsivas, placeholder y manejo de errores
 */
const OptimizedImage = ({
  src,
  alt = "",
  className = "",
  width,
  height,
  quality = "auto",
  format = "auto",
  crop = "fill",
  gravity = "auto",
  lazy = true,
  responsive = false,
  placeholder = true,
  sizes,
  onLoad,
  onError,
  priority = false, // NUEVO
  placeholderFallback,
  fadeIn = true, // NUEVO: permite desactivar la transición (evitar retrasar LCP)
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);

  // Opciones de optimización
  const optimizationOptions = useMemo(
    () => ({
      width,
      height,
      quality,
      format,
      crop,
      gravity,
    }),
    [width, height, quality, format, crop, gravity],
  );

  // URL procesada
  const processedUrl = useMemo(() => {
    if (!src || hasError) return null;
    return getImageUrl(src, optimizationOptions);
  }, [src, optimizationOptions, hasError]);

  // URLs responsivas si se solicitan
  const responsiveUrls = useMemo(() => {
    if (!responsive || !src || hasError) return null;
    return getResponsiveImageUrls(src);
  }, [responsive, src, hasError]);

  // SrcSet para imágenes responsivas
  const srcSet = useMemo(() => {
    if (!responsive || !src || hasError) return undefined;

    const baseOptions = {
      width,
      height,
      quality,
      format,
      crop,
      gravity,
    };

    // Si es Cloudinary, generar srcSet optimizado
    if (typeof src === "object" && src.cloudinary_public_id) {
      return cloudinaryService.generateSrcSet(src.cloudinary_public_id, baseOptions);
    }

    // Si es URL de Cloudinary, extraer public_id y generar srcSet
    if (typeof src === "string" && src.includes("cloudinary.com")) {
      const publicId = cloudinaryService.extractPublicId(src);
      if (publicId) {
        return cloudinaryService.generateSrcSet(publicId, baseOptions);
      }
    }

    // Para otras imágenes, usar responsiveUrls básico
    if (responsiveUrls) {
      return Object.entries(responsiveUrls)
        .map(([size, url]) => {
          const sizeMap = {
            thumbnail: "150w",
            small: "400w",
            medium: "800w",
            large: "1200w",
            original: "1600w",
          };
          return `${url} ${sizeMap[size] || "800w"}`;
        })
        .join(", ");
    }

    return undefined;
  }, [responsive, src, hasError, responsiveUrls, width, height, quality, format, crop, gravity]);

  // Manejadores de eventos
  const handleLoad = useCallback(
    (e) => {
      setIsLoaded(true);
      setHasError(false);
      onLoad?.(e);
    },
    [onLoad],
  );

  const handleError = useCallback(
    (e) => {
      setHasError(true);
      setIsLoaded(false);
      onError?.(e);
    },
    [onError],
  );

  // Intersection Observer para lazy loading
  const imgRef = useCallback(
    (node) => {
      if (!lazy || isInView) return;

      if (node && typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          },
          { threshold: 0.1 },
        );

        observer.observe(node);

        return () => observer.disconnect();
      } else {
        // Fallback si no hay IntersectionObserver
        setIsInView(true);
      }
    },
    [lazy, isInView],
  );

  // URL del placeholder
  const placeholderUrl = useMemo(() => {
    if (!placeholder) return null;
    if (placeholderFallback) return placeholderFallback;
    const w = width || 600;
    const h = height || 400;
    return `https://via.placeholder.com/${w}x${h}?text=Cargando...`;
  }, [placeholder, placeholderFallback, width, height]);

  // URL de error
  const errorUrl = useMemo(() => {
    const w = width || 600;
    const h = height || 400;
    return `https://via.placeholder.com/${w}x${h}?text=Error+al+cargar`;
  }, [width, height]);

  // Helper para clases de fade únicamente cuando se desea
  const buildImgClass = (loaded) => {
    if (!fadeIn) return className; // sin transición
    return `${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`;
  };

  // Mostrar placeholder si no está en vista (lazy loading)
  if (lazy && !isInView) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 skeleton-shimmer rounded ${className}`}
        style={{
          // Evitar romper el layout con tamaños fijos; sólo sugerimos aspect-ratio si existe
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
        aria-busy={placeholder ? "true" : undefined}
        aria-live="polite"
        {...props}
      >
        {/* Skeleton puro, sin texto visible */}
        {placeholder && (
          <div className="w-full h-full bg-gray-200" aria-hidden="true" />
        )}
      </div>
    );
  }

  // Mostrar imagen de error
  if (hasError) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${className}`}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
        {...props}
      >
        <div className="text-center text-gray-500">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Error al cargar imagen</span>
        </div>
      </div>
    );
  }

  // Mostrar placeholder mientras carga
  if (!isLoaded && placeholder && placeholderUrl) {
    return (
      <div
        className={`relative ${className}`}
        style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
      >
        {/* Capa skeleton con shimmer mientras la imagen carga */}
        <div
          className="absolute inset-0 bg-gray-200 skeleton-shimmer rounded"
          aria-hidden="true"
        />
        <img
          src={processedUrl}
          alt={alt}
          className={buildImgClass(isLoaded)}
          width={width}
          height={height}
          srcSet={srcSet}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : lazy ? "lazy" : "eager"}
          fetchPriority={priority ? "high" : undefined}
          decoding={priority ? "sync" : "async"}
          aria-busy="true"
          {...props}
        />
      </div>
    );
  }

  // Imagen principal
  return (
    <img
      src={processedUrl}
      alt={alt}
      className={buildImgClass(isLoaded)}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      loading={priority ? "eager" : lazy ? "lazy" : "eager"}
      fetchPriority={priority ? "high" : undefined}
      decoding={priority ? "sync" : "async"}
      {...props}
    />
  );
};

// Componente específico para imágenes de perfil/avatar
export const AvatarImage = ({ src, size = 40, alt = "Avatar", ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    crop="thumb"
    gravity="face"
    quality="auto"
    format="auto"
    className={`rounded-full object-cover ${props.className || ""}`}
    {...props}
  />
);

// Componente específico para thumbnails
export const ThumbnailImage = ({ src, alt = "Thumbnail", ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={150}
    height={150}
    crop="thumb"
    quality={80}
    format="auto"
    className={`rounded-lg object-cover ${props.className || ""}`}
    {...props}
  />
);

// Componente específico para imágenes de hero/banner
export const HeroImage = ({
  src,
  alt = "Hero image",
  fadeIn = false,
  ...props
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    responsive
    lazy={false}
    quality="auto"
    format="auto"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
    className={`w-full h-64 md:h-96 object-cover ${props.className || ""}`}
    priority
    placeholder={false}
    fadeIn={fadeIn}
    {...props}
  />
);

// Componente específico para galerías
export const GalleryImage = ({ src, alt = "Gallery image", ...props }) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={400}
    height={300}
    crop="fill"
    quality={85}
    format="auto"
    responsive
    className={`rounded-lg object-cover hover:scale-105 transition-transform duration-300 ${props.className || ""}`}
    {...props}
  />
);

export default OptimizedImage;
