import { useState, useEffect, useCallback, useRef } from "react";
import {
  FiImage,
  FiUpload,
  FiSearch,
  FiTrash2,
  FiMove,
  FiStar,
  FiEye,
  FiEyeOff,
  FiInfo,
  FiPlus,
} from "react-icons/fi";
import axios from "axios";
import { cloudinaryService } from "../../../services/cloudinaryService";
import { safeCreateGeocoder } from "../../../utils/mapsUtils";
import CloudinaryImageUploader from "../../../components/ui/CloudinaryImageUploader";
import OptimizedImage from "../../../components/ui/OptimizedImage";

// Helper para extraer componentes de dirección de Google y construir jerarquía
const extractLocationComponents = (addressComponents = []) => {
  const get = (type) => {
    const comp = addressComponents.find((c) => c.types?.includes(type));
    return comp?.long_name || comp?.short_name || null;
  };
  // En MX a veces municipio puede venir como administrative_area_level_3 o level_2
  const locality = get("locality") || get("sublocality") || null; // ciudad
  const municipality =
    get("administrative_area_level_2") ||
    get("administrative_area_level_3") ||
    null; // municipio
  const state = get("administrative_area_level_1") || null; // estado
  const country = get("country") || null; // país

  return { city: locality, municipality, state, country };
};

const buildPreciseQueries = ({ city, municipality, state, country }) => {
  const queries = new Set();
  const norm = (s) => (s || "").trim();
  const isMX = /mexico|méxico/i.test(country || "");

  const add = (q) => {
    if (q && q.length > 0) queries.add(q);
  };

  // Variantes base más específicas primero
  if (city && state && country) add(`${city}, ${state}, ${country}`);
  if (city && municipality && state && country)
    add(`${city}, ${municipality}, ${state}, ${country}`);
  if (municipality && state && country)
    add(`${municipality}, ${state}, ${country}`);
  if (city && state) add(`${city}, ${state}`);
  if (city && country) add(`${city}, ${country}`);
  if (state && country) add(`${state}, ${country}`);

  // En México, agregar variantes explícitas con acento/sin acento
  if (isMX) {
    const mx = "México";
    if (city && state) add(`${city}, ${state}, ${mx}`);
    if (municipality && state) add(`${municipality}, ${state}, ${mx}`);
    if (state) add(`${state}, ${mx}`);
  }

  // Palabras clave temáticas para turismo
  const topics = [
    "turismo",
    "atracciones",
    "lugares turísticos",
    "paisajes",
    "monumentos",
    "arquitectura",
    "centro histórico",
    "vista panorámica",
  ];

  // Expandir combinando con tópicos
  const expanded = new Set();
  for (const base of queries) {
    expanded.add(base); // incluir sin tópico
    for (const t of topics) {
      expanded.add(`${base} ${t}`);
    }
  }

  // Filtrar nulos y normalizar
  return Array.from(expanded)
    .map((q) => norm(q))
    .filter((q) => q.length > 0);
};

// Cache simple para resultados de geocodificación por lat,lng
const geocodeCache = new Map();

const geocodeLatLngToComponents = async (lat, lng) => {
  const key = `${lat},${lng}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key);

  const geocoder = safeCreateGeocoder();
  if (!geocoder) return null;
  const result = await new Promise((resolve) => {
    geocoder.geocode(
      { location: { lat: Number(lat), lng: Number(lng) }, language: "es" },
      (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          resolve(results[0]);
        } else {
          resolve(null);
        }
      },
    );
  });

  if (result) {
    geocodeCache.set(key, result);
  }
  return result;
};

const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-ping"></div>
    </div>
    <p className="mt-4 text-slate-600 font-medium">Generando imágenes...</p>
    <p className="text-sm text-slate-400">Esto puede tomar unos segundos</p>
  </div>
);

const ImageTile = ({
  image,
  index,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isDragOver,
  draggedIndex,
}) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, index)}
    onDragEnd={onDragEnd}
    onDragOver={(e) => onDragOver(e, index)}
    onDrop={(e) => onDrop(e, index)}
    className={`relative group bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 aspect-square border-2 border-gray-100 ${
      isDragOver && draggedIndex !== index
        ? "drop-target-active ring-4 ring-blue-400"
        : ""
    } ${isDragging && draggedIndex === index ? "image-tile-dragging opacity-70" : "cursor-grab hover:cursor-grab"} hover:shadow-xl hover:border-gray-200 active:cursor-grabbing hover:scale-105`}
    style={{
      transformStyle: "preserve-3d",
      zIndex: isDragging && draggedIndex === index ? 1000 : "auto",
    }}
  >
    <div
      className={`absolute ${index === 0 ? "bottom-3 left-3" : "top-3 left-3"} z-20 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg transition-all duration-200 flex items-center gap-1 ${
        index === 0
          ? "bg-gradient-to-r from-amber-500 to-orange-600 glow-effect"
          : "bg-slate-600"
      }`}
    >
      {index === 0 && <FiStar className="w-3 h-3" />}#{index + 1}
    </div>

    {isDragOver && draggedIndex !== index && (
      <div className="absolute inset-0 bg-blue-50 border-4 border-dashed border-blue-400 flex items-center justify-center z-30 backdrop-blur-sm rounded-xl">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2 animate-bounce">
          <FiMove className="w-4 h-4" />
          Soltar en posición #{index + 1}
        </div>
      </div>
    )}

    <div className="h-full w-full overflow-hidden relative">
      {image.status === "uploading" && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2 text-slate-500 text-[11px] font-medium">
            <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span>Subiendo...</span>
            {image.uploadProgress != null && (
              <span className="text-[10px] text-slate-400">{Math.round(image.uploadProgress)}%</span>
            )}
          </div>
        </div>
      )}
      {image.status === "error" && (
        <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center gap-2 text-red-600 z-10 px-2 text-center">
          <FiInfo className="w-6 h-6" />
          <span className="text-[11px] font-semibold">Fallo</span>
          <span className="text-[10px] line-clamp-2">
            {image.errorReason || "Error"}
          </span>
        </div>
      )}
      {(image.status === "success" ||
        (image.tipo === "url" && image.url) ||
        (!image.status && image.isUploaded && image.url) ||
        (image.status === "uploading" && image.url && image.url.startsWith("blob:"))
        ) && (
        <OptimizedImage
          src={image.url || image}
          alt={`Imagen del destino - Posición ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          width={400}
          height={400}
          quality="auto"
          crop="fill"
          lazy={false}
        />
      )}
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
      <button
        type="button" // Evita submit accidental del formulario
        onClick={(e) => {
          e.stopPropagation();
          onRemove(image.id);
        }}
        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all duration-200 shadow-lg nav-hover-lift"
        aria-label="Eliminar imagen"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>

    <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
      <div className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2">
          <FiMove className="w-3 h-3" />
          Arrastra para reordenar
        </div>
        <div className="flex items-center gap-1">
          {image.status === "uploading" && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 animate-pulse">Cargando</span>
          )}
          {image.status === "success" && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Subida</span>
          )}
          {image.status === "error" && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">Error</span>
          )}
          {!image.status && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${image.isUploaded ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{image.isUploaded ? "Subida" : "URL"}</span>
          )}
        </div>
      </div>
    </div>

    <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
      <div
        className={`text-white p-1.5 rounded-full ${
          image.isUploaded ? "bg-green-600/80" : "bg-blue-600/80"
        }`}
      >
        {image.status === "uploading" && (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {image.status === "success" && <FiUpload className="w-3 h-3" />}
        {image.status === "error" && <FiInfo className="w-3 h-3" />}
        {!image.status && (image.isUploaded ? <FiUpload className="w-3 h-3" /> : <FiSearch className="w-3 h-3" />)}
      </div>
    </div>
  </div>
);

// Tarjeta especial para agregar más imágenes (+10) con mismo estilo visual que ImageTile
const AddMoreTile = ({ batchCount, remainingCount, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cargar ${batchCount} imágenes adicionales. ${remainingCount} restantes.`}
      className="relative group bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 aspect-square border-2 border-gray-100 cursor-pointer hover:shadow-xl hover:border-gray-200 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/50"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Badge superior izquierdo similar a numeración */}
      <div className="absolute top-3 left-3 z-20 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 bg-blue-600 group-hover:bg-blue-700 transition-colors">
        <FiPlus className="w-3 h-3" />
        +{batchCount}
      </div>
      {/* Contenido central */}
      <div className="h-full w-full flex flex-col items-center justify-center select-none">
        <div className="relative flex items-center justify-center mb-1">
          <div className="absolute inset-0 bg-blue-200 blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="text-6xl sm:text-7xl font-black text-slate-300 group-hover:text-slate-200 transition-colors tracking-tight">
            +{batchCount}
          </div>
        </div>
        <div className="text-[10px] sm:text-xs font-semibold text-slate-500 group-hover:text-slate-600 uppercase tracking-wide">
          Agregar imágenes
        </div>
        {remainingCount > batchCount && (
          <div className="mt-1 text-[10px] text-slate-400 group-hover:text-slate-500 font-medium">
            {remainingCount - batchCount} más luego
          </div>
        )}
      </div>
      {/* Overlay mejorado: capas múltiples (gradientes, brillo, líneas y shimmer) */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {/* Capa base oscurecedora con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/30 to-transparent mix-blend-multiply" />
        {/* Gradiente superior para profundidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Brillo radial central suave */}
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.15),transparent_70%)] blur-2xl" />
        {/* Líneas diagonales muy sutiles */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(115deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_35%)]" />
        {/* Shimmer animado */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute -inset-[40%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(255,255,255,0.18)_90deg,transparent_180deg)] animate-[spin_9s_linear_infinite]" />
        </div>
        {/* Borde glow al hacer hover */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 group-hover:ring-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_30px_-4px_rgba(0,0,0,0.6)]" />
      </div>
    </button>
  );
};

const DestinationImageManager = ({
  destination,
  onImagesChange,
  initialImages = [],
  isEdit = false, // Nuevo prop para indicar modo edición
}) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [globalUploading, setGlobalUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [allAvailableImages, setAllAvailableImages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Recalcular bandera global de subida cuando cambia la lista
  useEffect(() => {
    const anyUploading = images.some(img => img.status === 'uploading');
    setGlobalUploading(anyUploading);
  }, [images]);

  useEffect(() => {
    if (initialImages && initialImages.length > 0 && !isInitialized) {
      setImages(initialImages);
      setAllAvailableImages(initialImages);
      setStatus("success");
      setIsInitialized(true);
    }
  }, [initialImages, isInitialized]);

  // Función para optimizar URLs de imágenes de Pexels
  const optimizePexelsUrl = (url) => {
    if (url.includes("images.pexels.com")) {
      // Remover parámetros existentes si los hay
      const baseUrl = url.split("?")[0];
      // Aplicar optimización: auto=compress, formato WebP, calidad 75, ajuste crop
      // Dimensiones optimizadas para el gestor de imágenes: 600x400 para buena calidad visual
      return `${baseUrl}?auto=compress&w=600&h=400&fit=crop&fm=webp&q=75`;
    }
    return url;
  };

  const pexelsFetchInFlightRef = useRef(false);
  const lastDestinationKeyRef = useRef(null);

  const fetchImagesFromPexels = useCallback(
    async (destinationInput) => {
      if (pexelsFetchInFlightRef.current) {
        console.log("⏳ Ignorando fetch Pexels duplicado (en progreso)");
        return;
      }
      const destKey = destinationInput?.name || JSON.stringify({ lat: destinationInput?.lat, lng: destinationInput?.lng });
      if (lastDestinationKeyRef.current && lastDestinationKeyRef.current === destKey && isInitialized) {
        // Evitar regenerar para mismo destino ya inicializado
        console.log("♻️ Evitando refetch Pexels mismo destino ya inicializado");
        return;
      }
      pexelsFetchInFlightRef.current = true;
      const hasCoords =
        destinationInput && destinationInput.lat && destinationInput.lng;
      const destinationName =
        typeof destinationInput === "string"
          ? destinationInput
          : destinationInput?.name;

      if (!destinationName && !hasCoords) {
        setImages([]);
        setAllAvailableImages([]);
        setStatus("idle");
        return;
      }

      setStatus("loading");
      setError(null);

      const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
      if (!PEXELS_API_KEY) {
        setError("La clave de API de Pexels no está configurada.");
        setStatus("error");
        return;
      }

      try {
        // 1) Obtener componentes de ubicación con mayor precisión
        let components = null;
        if (hasCoords) {
          const geoResult = await geocodeLatLngToComponents(
            destinationInput.lat,
            destinationInput.lng,
          );
          if (geoResult?.address_components) {
            components = extractLocationComponents(
              geoResult.address_components,
            );
          }
        }

        // 2) Fallback: intentar parsear del nombre "Ciudad, Estado"
        if (!components) {
          const parts = (destinationName || "")
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean);
          const city = parts[0] || null;
          const state = parts[1] || null;
          components = { city, state, municipality: null, country: null };
        }

        // 3) Construir solo 2 queries simples para obtener 10 imágenes totales
        // SIMPLIFICADO: Solo hacer 2 requests en lugar de 50-70
        const simpleQueries = [];
        
        if (destinationName) {
          simpleQueries.push(`${destinationName} turismo`);
          // Solo agregar segunda query si realmente necesitamos más variedad
          if (components?.city && components?.state) {
            simpleQueries.push(`${components.city} ${components.state} paisajes`);
          }
        }

        const allQueries = simpleQueries.length > 0 
          ? simpleQueries 
          : [`${components?.city || destinationName} lugares turísticos`];

        // 4) Ejecutar solo 1-2 llamadas a Pexels con 15 imágenes por request
        const axiosCalls = allQueries.map((query) =>
          axios.get(`https://api.pexels.com/v1/search`, {
            headers: { Authorization: PEXELS_API_KEY },
            params: {
              query,
              per_page: 15, // Aumentado de 6 a 15 para obtener suficientes imágenes en pocas requests
              orientation: "landscape",
              locale: "es-ES",
            },
          }),
        );

        console.log(`🔍 Haciendo ${axiosCalls.length} request${axiosCalls.length !== 1 ? 's' : ''} a Pexels API:`, allQueries);

        const responses = await Promise.allSettled(axiosCalls);

        const allPhotos = [];
        responses.forEach((res) => {
          if (res.status === "fulfilled" && res.value?.data?.photos) {
            allPhotos.push(...res.value.data.photos);
          }
        });

        const uniquePhotos = allPhotos.filter(
          (photo, index, self) =>
            index === self.findIndex((p) => p.id === photo.id),
        );

        if (uniquePhotos.length > 0) {
          const photoData = uniquePhotos.map((photo) => ({
            id: `pexels-${photo.id}`,
            url: optimizePexelsUrl(photo.src.large),
            isUploaded: false,
            tipo: "url",
            source: "pexels",
          }));

          if (isInitialized && images.length > 0) {
            const newUniquePhotos = photoData.filter(
              (newPhoto) =>
                !images.some((existingImg) => existingImg.url === newPhoto.url),
            );

            console.log(`📸 Agregando ${newUniquePhotos.length} imágenes de Pexels a galería existente`);
            setAllAvailableImages((prev) => [...prev, ...newUniquePhotos]);
            setImages((prev) => [...prev, ...newUniquePhotos.slice(0, 5)]);
          } else {
            console.log(`📸 Generando ${photoData.length} imágenes de Pexels (${photoData.slice(0, 10).length} visibles inicialmente)`);
            setAllAvailableImages(photoData);
            setImages(photoData.slice(0, 10));
            lastDestinationKeyRef.current = destKey;
          }

          setStatus("success");
        } else {
          if (!isInitialized) {
            setImages([]);
            setAllAvailableImages([]);
          }
          setStatus("no_photos");
        }
      } catch (error) {
        console.error("Error al buscar imágenes:", error);
        setError("Error al buscar imágenes en Pexels.");
        setStatus("error");
      } finally {
        pexelsFetchInFlightRef.current = false;
      }
    },
    [images.length, isInitialized],
  );

  // Solo inicializar una vez cuando cambia el destino, evitando requests múltiples
  useEffect(() => {
    if (
      destination?.name &&
      (!initialImages || initialImages.length === 0) &&
      !isInitialized
    ) {
      fetchImagesFromPexels(destination);
    } else if (
      !destination?.name &&
      (!initialImages || initialImages.length === 0)
    ) {
      setImages([]);
      setAllAvailableImages([]);
      setStatus("idle");
    }
  }, [
    destination?.name,
    initialImages?.length,
    isInitialized,
    fetchImagesFromPexels,
    // Removido destination.lat y destination.lng para evitar requests múltiples
  ]);

  const prevImagesRef = useRef();
  useEffect(() => {
    if (prevImagesRef.current !== images) {
      onImagesChange(images);
      prevImagesRef.current = images;
    }
  }, [images]);

  const handleFiles = async (files) => {
    // Esta función solo debe manejar archivos subidos por el usuario
    // NO debe procesar imágenes de Pexels o Google Places
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setStatus("loading");

    const successes = [];
    const failures = [];

    // Crear placeholders inmediatos para UX responsiva
    const placeholderEntries = fileArray.map((file, i) => ({
      id: `temp-${Date.now()}-${i}`,
      url: URL.createObjectURL(file), // previsualización inmediata
      file,
      tipo: "cloudinary",
      source: "user_upload",
      isUploaded: false,
      status: "uploading",
      uploadProgress: 0,
      nombre: file.name,
    }));
    // globalUploading se calcula automáticamente en useEffect
    setImages((prev) => [...prev, ...placeholderEntries]);
    setAllAvailableImages((prev) => [...prev, ...placeholderEntries]);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const index = i;

      // Validar tipo y tamaño
      const isValid = cloudinaryService.validateImageFile(file);
      if (!isValid) {
        console.warn("⚠️ Archivo inválido (tipo o tamaño)", {
          name: file.name,
          size: file.size,
          type: file.type,
        });
        failures.push({ file, reason: "Archivo inválido (tipo/tamaño)", retriable: false });
        continue;
      }

      try {
        let workingFile = file;
        if (file.size > 4 * 1024 * 1024) {
          console.log(
            `�️ Redimensionando (>${(4).toFixed(1)}MB) ${file.name} tamaño ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          );
          try {
            workingFile = await cloudinaryService.resizeImage(file, {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 0.82,
            });
            console.log(
              `✅ Redimensionado a ${(workingFile.size / 1024 / 1024).toFixed(2)}MB`,
            );
          } catch (re) {
            console.warn("⚠️ Falló resize, uso original", re);
          }
        }
        console.log(
          `�📤 (${index + 1}/${fileArray.length}) Subiendo a Cloudinary directo: ${workingFile.name}`,
        );
        const cloudinaryResult = await cloudinaryService.uploadImage(workingFile, "paquetes");
        // El servicio retorna response.data directamente => usar propiedades raíz
        const { url, secure_url, public_id } = cloudinaryResult || {};
        if (!url && !secure_url) {
          throw new Error("Respuesta de Cloudinary sin URL");
        }
        const finalEntry = {
          id: `cloudinary-${Date.now()}-${index}`,
          url: url || secure_url,
          cloudinary_public_id: public_id,
            cloudinary_url: url || secure_url,
          isUploaded: true,
          file: file,
          tipo: "cloudinary",
          source: "user_upload",
          status: "success",
          uploadProgress: 100,
        };
        // Liberar objectURL temporal
        try {
          const ph = placeholderEntries[index];
          if (ph?.url?.startsWith('blob:')) URL.revokeObjectURL(ph.url);
        } catch(_) {}
        successes.push(finalEntry);
        console.log("🧩 Reemplazando placeholder por imagen final", {
          tempId: placeholderEntries[index]?.id,
          finalId: finalEntry.id,
          public_id,
          secure_url: finalEntry.cloudinary_url,
        });
        // Reemplazar placeholder correspondiente
        setImages((prev) =>
          prev.map((img) =>
            img.file === file && img.status === "uploading"
              ? finalEntry
              : img,
          ),
        );
        setAllAvailableImages((prev) =>
          prev.map((img) =>
            img.file === file && img.status === "uploading"
              ? finalEntry
              : img,
          ),
        );
      } catch (err) {
        console.error("❌ Falla subida individual:", {
          name: file.name,
          error: err?.message,
          response: err?.response?.data,
          status: err?.response?.status,
        });
        const status = err?.response?.status;
        let reason = err?.message || "Error desconocido";
        if (status === 413) reason = "Archivo demasiado grande (413)";
        if (status === 415) reason = "Tipo de archivo no soportado";
        if (status === 500) reason = "Error interno backend al subir";
        failures.push({ file, reason, status, retriable: status !== 413 });
        setImages((prev) =>
          prev.map((img) =>
            img.file === file && img.status === "uploading"
              ? { ...img, status: "error", errorReason: reason }
              : img,
          ),
        );
        setAllAvailableImages((prev) =>
          prev.map((img) =>
            img.file === file && img.status === "uploading"
              ? { ...img, status: "error", errorReason: reason }
              : img,
          ),
        );
      }
    }

    // Usar setTimeout 0 para asegurar que React haya aplicado los últimos setImages antes de loguear
    setTimeout(() => {
      setImages(prev => {
        const logData = {
          total: prev.length,
          uploading: prev.filter(i => i.status === 'uploading').length,
            success: prev.filter(i => i.status === 'success').length,
          error: prev.filter(i => i.status === 'error').length,
        };
        console.log("🖼️ Estado imágenes tras loop subida:", logData);
        return prev;
      });
    }, 0);
    // (Los placeholders ya fueron reemplazados inline)

    if (failures.length && successes.length === 0) {
      setStatus("error");
      const hasConfig = failures.some(f => /upload direct.*400|Invalid extension/i.test(f.reason));
      if (hasConfig) {
        setError("Configuración Cloudinary inválida (preset). Revisa consola para pasos de corrección.");
      } else {
        setError(`Error al procesar las imágenes (0 subidas, ${failures.length} fallidas)`);
      }
    } else if (failures.length && successes.length > 0) {
      setStatus("partial");
      setError(
        `Subida parcial: ${successes.length} OK / ${failures.length} fallidas`,
      );
    } else {
      setStatus("success");
      setError(null);
    }

    if (failures.length) {
      console.groupCollapsed(
        `📋 Resumen fallos subida (${failures.length}):`,
      );
      failures.forEach((f) => console.log(f.file.name, f.reason, f.status));
      console.groupEnd();
      setFailedUploads(failures);
    } else {
      setFailedUploads([]);
    }
    // Flag global se recalcula automáticamente en useEffect(images)
  };

  // Estado para fallos reintentar
  const [failedUploads, setFailedUploads] = useState([]);

  const retryFailedUploads = async () => {
    if (!failedUploads.length) return;
    const retriable = failedUploads.filter((f) => f.retriable !== false);
    if (!retriable.length) return;
    setStatus("loading");
    setError(null);
    const newFailures = [];
    const newSuccesses = [];
    for (let i = 0; i < retriable.length; i++) {
      const { file } = retriable[i];
      // Marcar en UI como re-subiendo
      setImages((prev) =>
        prev.map((img) =>
          img.file === file
            ? { ...img, status: "uploading", errorReason: undefined }
            : img,
        ),
      );
      try {
        let workingFile = file;
        if (file.size > 4 * 1024 * 1024) {
          console.log(
            `�️(retry) Redimensionando ${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          );
          try {
            workingFile = await cloudinaryService.resizeImage(file, {
              maxWidth: 1920,
              maxHeight: 1080,
              quality: 0.8,
            });
          } catch (re) {
            console.warn("⚠️ Retry resize falló", re);
          }
        }
        console.log(
          `�🔁 Reintentando (${i + 1}/${retriable.length}) ${workingFile.name}`,
        );
        const cloudinaryResult = await cloudinaryService.uploadImage(
          workingFile,
          "paquetes",
        );
        const { url, secure_url, public_id } = cloudinaryResult || {};
        if (!url && !secure_url) throw new Error("Respuesta sin URL en retry");
        const entry = {
          id: `cloudinary-${Date.now()}-retry-${i}`,
          url: url || secure_url,
          cloudinary_public_id: public_id,
          cloudinary_url: url || secure_url,
          isUploaded: true,
          file,
          tipo: "cloudinary",
          source: "user_upload",
          status: "success",
          uploadProgress: 100,
        };
        newSuccesses.push(entry);
        setImages((prev) =>
          prev.map((img) => (img.file === file ? entry : img)),
        );
      } catch (err) {
        const status = err?.response?.status;
        let reason = err?.message || "Error desconocido";
        if (status === 413) reason = "Archivo demasiado grande (413)";
        newFailures.push({ file, reason, status, retriable: status !== 413 });
        setImages((prev) =>
          prev.map((img) =>
            img.file === file ? { ...img, status: "error", errorReason: reason } : img,
          ),
        );
      }
    }
    if (newSuccesses.length) {
      setImages((prev) => [...prev, ...newSuccesses]);
      setAllAvailableImages((prev) => [...prev, ...newSuccesses]);
    }
    const mergedFailures = [
      ...failedUploads.filter((f) => f.retriable === false),
      ...newFailures,
    ];
    if (mergedFailures.length) {
      setStatus(newSuccesses.length ? "partial" : "error");
      setError(
        newSuccesses.length
          ? `Retry parcial: ${newSuccesses.length} OK / ${mergedFailures.length} siguen fallando`
          : `Retry fallido: 0 OK / ${mergedFailures.length} fallos`,
      );
      setFailedUploads(mergedFailures);
    } else {
      setStatus("success");
      setError(null);
      setFailedUploads([]);
    }
  };

  const handleFileUpload = (event) => {
    handleFiles(event.target.files);
  };

  const handleRemoveImage = (id) => {
    const newImages = images.filter((img) => img.id !== id);
    // No eliminamos de allAvailableImages para que no reaparezca al agregar más
    // Solo quitamos de la vista actual. Si queremos también removerlo de la lista total:
    // Mantendremos la decisión de removerlo también del catálogo para que no vuelva a aparecer.
    const newAll = allAvailableImages.filter((img) => img.id !== id);
    setImages(newImages);
    setAllAvailableImages(newAll);

    if (newImages.length === 0) {
      console.log('🧹 Galería vacía tras eliminar última imagen.');
      // No regenerar automáticamente, dejar que el usuario decida
      setStatus('idle');
    }
  };

  // Función para vaciar todas las imágenes de Pexels
  const handleClearPexelsImages = () => {
    const pexelsCount = images.filter((img) => img.source === 'pexels' || (img.tipo === 'url' && !img.isUploaded)).length;
    console.log(`🗑️ Vaciando ${pexelsCount} imágenes de Pexels...`);
    
    const userUploadedImages = images.filter((img) => img.source === 'user_upload' && img.isUploaded);
    const userUploadedAll = allAvailableImages.filter((img) => img.source === 'user_upload' && img.isUploaded);
    
    setImages(userUploadedImages);
    setAllAvailableImages(userUploadedAll);
    
    if (userUploadedImages.length === 0) {
      setStatus('idle');
      console.log('✅ Todas las imágenes eliminadas. Galería vacía.');
    } else {
      console.log(`✅ ${pexelsCount} imágenes de Pexels eliminadas. ${userUploadedImages.length} imágenes de usuario permanecen.`);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    setIsDragging(false); // Desactivar el estado de drag del contenedor
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString()); // Datos específicos para reordenamiento
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];

      newImages.splice(draggedIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);

      setImages(newImages);

      // También actualizar en allAvailableImages si la imagen existe allí
      const newAllImages = [...allAvailableImages];
      const draggedImageInAll = newAllImages.find(
        (img) => img.id === draggedImage.id,
      );
      if (draggedImageInAll) {
        const oldIndexInAll = newAllImages.findIndex(
          (img) => img.id === draggedImage.id,
        );
        newAllImages.splice(oldIndexInAll, 1);
        newAllImages.splice(dropIndex, 0, draggedImageInAll);
        setAllAvailableImages(newAllImages);
      }
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleContainerDragOver = (e) => {
    // Solo manejar el drag para archivos externos, no para reordenamiento interno
    if (draggedIndex === null && e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  const handleContainerDragLeave = (e) => {
    // Solo salir del estado de dragging si realmente salimos del contenedor
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleContainerDrop = (e) => {
    // Solo manejar archivos externos, no elementos reordenados internamente
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    } else if (draggedIndex === null) {
      e.preventDefault();
      setIsDragging(false);
    }
  };

  // Reemplazo de lógica de "ver más" por carga incremental
  const handleAddMoreImages = () => {
    const remaining = allAvailableImages.filter(
      (candidate) => !images.some((shown) => shown.id === candidate.id),
    );
    if (remaining.length === 0) return;
    const batch = remaining.slice(0, 10);
    setImages((prev) => [...prev, ...batch]);
  };

  return (
    <div
      className={`transition-all duration-300 rounded-xl ${
        isDragging
          ? "border-4 border-dashed border-blue-500 bg-blue-50/50 backdrop-blur-sm"
          : "border-2 border-transparent"
      }`}
      onDragEnter={handleContainerDragOver}
      onDragLeave={handleContainerDragLeave}
      onDragOver={handleContainerDragOver}
      onDrop={handleContainerDrop}
    >
      {globalUploading && (
        <div className="mb-4 flex items-center gap-3 text-sm text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <span>Subiendo imágenes a Cloudinary…</span>
        </div>
      )}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-50/80 backdrop-blur-sm rounded-xl">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
            <FiUpload className="w-6 h-6" />
            <div>
              <p className="font-semibold">Suelta las imágenes aquí</p>
              <p className="text-sm opacity-90">
                Se agregarán al final de la galería
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <label className="group relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
            <FiUpload className="w-4 h-4" />
            <span>Subir Imágenes</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Botón que alterna entre Generar y Vaciar imágenes de Pexels */}
          {destination?.name && (() => {
            const hasPexelsImages = images.some(img => img.source === 'pexels' || (img.tipo === 'url' && !img.isUploaded));
            
            if (hasPexelsImages) {
              // Mostrar botón "Vaciar imágenes" si hay imágenes de Pexels
              return (
                <button
                  type="button"
                  onClick={handleClearPexelsImages}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                  disabled={status === "loading"}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Vaciar imágenes
                </button>
              );
            } else {
              // Mostrar botón "Generar imágenes" si no hay imágenes de Pexels
              return (
                <button
                  type="button"
                  onClick={() => fetchImagesFromPexels(destination)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                  disabled={status === "loading"}
                >
                  <FiSearch className="w-4 h-4" />
                  {status === "loading" ? "Generando..." : "Generar imágenes"}
                </button>
              );
            }
          })()}
        </div>

        {/* Estadísticas - Solo visible en desktop */}
        {images.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FiImage className="w-4 h-4" />
              <span className="font-medium">
                {images.length} imagen{images.length !== 1 ? "es" : ""}
              </span>
            </div>
            {/* Indicadores de tipos de imagen */}
            <div className="flex items-center gap-3 flex-wrap">
              {images.filter((img) => img.isUploaded).length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                  <FiUpload className="w-3 h-3" />
                  <span className="whitespace-nowrap">
                    {images.filter((img) => img.isUploaded).length} Subida
                    {images.filter((img) => img.isUploaded).length !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>
              )}
              {images.filter((img) => !img.isUploaded).length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                  <FiSearch className="w-3 h-3" />
                  <span className="whitespace-nowrap">
                    {images.filter((img) => !img.isUploaded).length} URL
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

  {status === "loading" && images.length === 0 && <Spinner />}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-red-100 p-3 rounded-full">
              <FiImage className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-red-800 font-semibold mb-2">
            Error al cargar imágenes
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
          {failedUploads.length > 0 && (
            <button
              type="button"
              onClick={retryFailedUploads}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition"
            >
              Reintentar fallidas ({failedUploads.length})
            </button>
          )}
        </div>
      )}

      {status === "partial" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-amber-100 p-3 rounded-full">
              <FiImage className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-amber-800 font-semibold mb-2">
            Subida parcial de imágenes
          </h3>
          <p className="text-amber-700 text-sm">
            {error || "Algunas imágenes no pudieron subirse"}
          </p>
          <p className="text-amber-600 text-xs mt-2">
            Revisa la consola para detalles y vuelve a intentar las fallidas.
          </p>
          {failedUploads.length > 0 && (
            <button
              type="button"
              onClick={retryFailedUploads}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 transition"
            >
              Reintentar fallidas ({failedUploads.length})
            </button>
          )}
        </div>
      )}

      {status === "idle" && (
        <div
          className={`text-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-slate-400"
          }`}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 p-4 rounded-full">
              <FiImage className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <h3 className="text-slate-700 font-semibold mb-2">
            Selecciona un destino en el mapa
          </h3>
          <p className="text-slate-500 text-sm">
            Arrastra y suelta imágenes aquí o haz clic en el botón para subirlas
          </p>
        </div>
      )}

      {status === "no_photos" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-amber-100 p-3 rounded-full">
              <FiSearch className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <h3 className="text-amber-800 font-semibold mb-2">
            No se encontraron imágenes
          </h3>
          <p className="text-amber-600 text-sm mb-3">
            No se encontraron imágenes para este destino en Pexels
          </p>
          <p className="text-amber-500 text-xs">
            ¡No te preocupes! Puedes subir las tuyas usando el botón de arriba
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          {(() => {
            const remainingCount = allAvailableImages.filter(
              (candidate) => !images.some((shown) => shown.id === candidate.id),
            ).length;
            const hasMore = remainingCount > 0;
            const batchCount = remainingCount >= 10 ? 10 : remainingCount;
            const hasVisiblePexels = images.some(img => img.source === 'pexels' || (img.tipo === 'url' && !img.isUploaded));
            return (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {images.map((image, index) => (
                  <ImageTile
                    key={image.id}
                    image={image}
                    index={index}
                    onRemove={handleRemoveImage}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={draggedIndex !== null}
                    isDragOver={dragOverIndex === index}
                    draggedIndex={draggedIndex}
                  />
                ))}
                {hasMore && hasVisiblePexels && (
                  <AddMoreTile
                    key="add-more-tile"
                    batchCount={batchCount}
                    remainingCount={remainingCount}
                    onClick={handleAddMoreImages}
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Mensaje informativo en modo edición */}
      {isEdit && (
        <div className="mb-4 -mt-1 text-xs sm:text-sm flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg">
          <FiInfo className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            Puedes generar o subir más imágenes. Los cambios solo se guardarán
            al pulsar <strong>Actualizar Paquete</strong>.
          </span>
        </div>
      )}
    </div>
  );
};

export default DestinationImageManager;
