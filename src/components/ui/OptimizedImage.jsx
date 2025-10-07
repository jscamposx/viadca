import React, { useState, useCallback, useMemo, useRef } from "react";
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
  const [triedOriginal, setTriedOriginal] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const originalSrcRef = useRef(src);

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
    if (!src) return null;
    if (hasError && triedOriginal) return null; // ya falló original también
    try {
      // Si ya hubo error con versión optimizada, intentar usar src original literal (sin transformaciones)
      if (hasError && !triedOriginal && originalSrcRef.current) {
        return typeof originalSrcRef.current === "string"
          ? originalSrcRef.current
          : originalSrcRef.current.cloudinary_url || null;
      }
      // Si es blob: o data: (previsualización local) devolver tal cual
      if (typeof src === "string" && (src.startsWith("blob:") || src.startsWith("data:"))) {
        return src; // no optimizar
      }

      if (
        typeof src === "string" &&
        !src.includes("http") &&
        !src.includes("cloudinary.com") &&
        !src.startsWith("/")
      ) {
        // Interpretar como public_id de Cloudinary (puede incluir carpetas). No asumimos extensión.
        const optimized = cloudinaryService.getOptimizedImageUrl(
          src,
          optimizationOptions,
        );
        return optimized;
      }
      return getImageUrl(src, optimizationOptions);
    } catch (err) {
      console.error("Error generando processedUrl para OptimizedImage:", {
        src,
        err,
      });
      return null;
    }
  }, [src, optimizationOptions, hasError, triedOriginal]);

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
      return cloudinaryService.generateSrcSet(
        src.cloudinary_public_id,
        baseOptions,
      );
    }

    // Si es URL de Cloudinary, extraer public_id y generar srcSet
    if (typeof src === "string" && src.includes("cloudinary.com")) {
      const publicId = cloudinaryService.extractPublicId(src);
      if (publicId) {
        // Extraer versión y extensión para evitar 404 cuando el derivado necesita esos datos
        let version = null;
        let originalExtension = null;
        try {
          const versionMatch = src.match(/\/image\/upload\/[^]*?(v\d+)\//);
            version = versionMatch ? versionMatch[1] : null;
          const extMatch = src.match(/\.([a-zA-Z0-9]{3,4})(?:$|[?#])/);
            originalExtension = extMatch ? `.${extMatch[1]}` : null;
        } catch (e) {
          // Silencioso; fallback sin versión
        }
        const enrichedBase = { ...baseOptions, version, originalExtension };
        return cloudinaryService.generateSrcSet(publicId, enrichedBase);
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
  }, [
    responsive,
    src,
    hasError,
    responsiveUrls,
    width,
    height,
    quality,
    format,
    crop,
    gravity,
  ]);

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
      // Detectar 404 en Cloudinary con patrón de fallback para prevenir loops silenciosos
      if (e?.target?.src) {
        const url = e.target.src;
        if (url.includes("/image/upload") && !triedOriginal) {
          console.warn("⚠️ Falla de carga Cloudinary (primera fase). Intentando original:", url);
        } else if (url.includes("/image/upload") && triedOriginal) {
          console.error("❌ Falla de carga Cloudinary incluso con original:", url);
        }
      }
      if (!hasError) {
        // Primer fallo: marcar error y forzar re-render para usar original
        setHasError(true);
        setIsLoaded(false);
      } else if (hasError && !triedOriginal) {
        // Segundo fallo: marcar que ya intentamos original
        setTriedOriginal(true);
      } else if (hasError && triedOriginal) {
        // Tercer intento: si la URL parece un publicId sin extensión y no contiene un punto final, probar con .jpg
        if (typeof src === "string" && !src.includes(".") && !src.startsWith("http") && !src.startsWith("/")) {
          const fallbackPublicId = `${src}.jpg`;
          console.warn("🔁 Intentando fallback agregando extensión .jpg:", fallbackPublicId);
          originalSrcRef.current = fallbackPublicId;
          setHasError(false);
          setTriedOriginal(false);
          setIsLoaded(false);
        }
      }
      onError?.(e);
    },
    [onError, hasError, triedOriginal],
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
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%23f1f5f9' offset='0%'/><stop stop-color='%23e2e8f0' offset='50%'/><stop stop-color='%23f1f5f9' offset='100%'/></linearGradient></defs><rect fill='url(%23g)' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%2394a3b8'>Cargando…</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }, [placeholder, placeholderFallback, width, height]);

  // URL de error
  const errorUrl = useMemo(() => {
    const w = width || 600;
    const h = height || 400;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><rect fill='%23fee2e2' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23b91c1c'>Error</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
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
  if (hasError && triedOriginal) {
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
          {process.env.NODE_ENV === "development" && (
            <span className="block mt-1 text-[10px] text-gray-400 break-all max-w-[180px]">{typeof src === "string" ? src : JSON.stringify(src)}</span>
          )}
        </div>
      </div>
    );
  }

  // Mostrar placeholder mientras carga
  if (!isLoaded && placeholder && placeholderUrl) {
    return (
      <div
        className={`relative ${className}`}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
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
