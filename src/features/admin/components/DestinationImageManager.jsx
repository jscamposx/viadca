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
} from "react-icons/fi";
import axios from "axios";
import { fileToBase64 } from "../../../utils/imageUtils";
import { cloudinaryService } from "../../../services/cloudinaryService";
import CloudinaryImageUploader from "../../../components/ui/CloudinaryImageUploader";
import OptimizedImage from "../../../components/ui/OptimizedImage";

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

    <div className="h-full w-full overflow-hidden">
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
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
      <button
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
        <div
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            image.isUploaded || image.tipo === "base64"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {image.isUploaded || image.tipo === "base64" ? "Subida" : "URL"}
        </div>
      </div>
    </div>

    <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
      <div
        className={`text-white p-1.5 rounded-full ${
          image.isUploaded || image.tipo === "base64"
            ? "bg-green-600/80"
            : "bg-blue-600/80"
        }`}
      >
        {image.isUploaded || image.tipo === "base64" ? (
          <FiUpload className="w-3 h-3" />
        ) : (
          <FiSearch className="w-3 h-3" />
        )}
      </div>
    </div>
  </div>
);

const DestinationImageManager = ({
  destination,
  onImagesChange,
  initialImages = [],
}) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [allAvailableImages, setAllAvailableImages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

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

  const fetchImagesFromPexels = useCallback(async (destinationName) => {
    if (!destinationName) {
      setImages([]);
      setAllAvailableImages([]);
      setStatus("idle");
      setShowAllImages(false);
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
      const searchQueries = [
        `${destinationName} turismo lugares`,
        `${destinationName} monumentos`,
        `${destinationName} arquitectura`,
        `${destinationName} paisajes`,
        `${destinationName} atracciones turisticas`,
      ];

      const searchPromises = searchQueries.map((query) =>
        axios.get(`https://api.pexels.com/v1/search`, {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
          params: {
            query: query,
            per_page: 6,
            orientation: "landscape",
          },
        }),
      );

      const responses = await Promise.all(searchPromises);

      const allPhotos = [];
      responses.forEach((response) => {
        if (response.data.photos) {
          allPhotos.push(...response.data.photos);
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
          tipo: "url", // Marcar explícitamente como URL externa
          source: "pexels", // Identificar la fuente para evitar subir a Cloudinary
        }));

        if (isInitialized && images.length > 0) {
          const newUniquePhotos = photoData.filter(
            (newPhoto) =>
              !images.some((existingImg) => existingImg.url === newPhoto.url),
          );

          setAllAvailableImages((prev) => [...prev, ...newUniquePhotos]);
          setImages((prev) => [...prev, ...newUniquePhotos.slice(0, 5)]);
        } else {
          setAllAvailableImages(photoData);
          setImages(photoData.slice(0, 10));
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
    }
  }, []);

  useEffect(() => {
    if (
      destination?.name &&
      (!initialImages || initialImages.length === 0) &&
      !isInitialized
    ) {
      fetchImagesFromPexels(destination.name);
    } else if (
      !destination?.name &&
      (!initialImages || initialImages.length === 0)
    ) {
      setImages([]);
      setAllAvailableImages([]);
      setStatus("idle");
      setShowAllImages(false);
    }
  }, [destination?.name, initialImages?.length, isInitialized]);

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

    try {
      // Subir archivos del usuario a Cloudinary
      const uploadedImages = await Promise.all(
        fileArray.map(async (file, index) => {
          try {
            console.log(
              `📤 Subiendo archivo del usuario a Cloudinary: ${file.name}`,
            );
            // Intentar subir a Cloudinary primero
            const cloudinaryResult = await cloudinaryService.uploadImage(
              file,
              "paquetes",
            );

            return {
              id: `cloudinary-${Date.now()}-${index}`,
              url: cloudinaryResult.data.url,
              cloudinary_public_id: cloudinaryResult.data.public_id,
              cloudinary_url: cloudinaryResult.data.url,
              isUploaded: true,
              file: file,
              tipo: "cloudinary",
              source: "user_upload", // Identificar como subida del usuario
            };
          } catch (cloudinaryError) {
            console.warn(
              "⚠️ Error subiendo a Cloudinary, usando base64 como fallback:",
              cloudinaryError,
            );

            // Fallback a base64 si Cloudinary falla
            const base64 = await fileToBase64(file);
            return {
              id: `base64-${Date.now()}-${index}`,
              url: base64,
              isUploaded: true,
              file: file,
              tipo: "base64",
              source: "user_upload", // Identificar como subida del usuario
            };
          }
        }),
      );

      setImages((prevImages) => [...prevImages, ...uploadedImages]);
      setAllAvailableImages((prevImages) => [...prevImages, ...uploadedImages]);
      setStatus("success");
    } catch (error) {
      console.error("❌ Error procesando archivos del usuario:", error);
      setStatus("error");
      setError("Error al procesar las imágenes");
    }
  };

  const handleFileUpload = (event) => {
    handleFiles(event.target.files);
  };

  const handleRemoveImage = (id) => {
    const newImages = images.filter((img) => img.id !== id);
    const newAllImages = allAvailableImages.filter((img) => img.id !== id);

    setImages(newImages);
    setAllAvailableImages(newAllImages);

    if (showAllImages && newAllImages.length <= 10) {
      setShowAllImages(false);
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

      if (showAllImages) {
        setAllAvailableImages(newImages);
      } else {
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

  const handleShowMoreImages = () => {
    if (allAvailableImages.length > images.length) {
      setImages(allAvailableImages);
      setShowAllImages(true);
    }
  };

  const handleShowLessImages = () => {
    setImages(allAvailableImages.slice(0, 10));
    setShowAllImages(false);
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
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

          {/* Botón para buscar imágenes de Pexels cuando hay imágenes iniciales */}
          {isInitialized && destination?.name && (
            <button
              onClick={() => fetchImagesFromPexels(destination.name)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
              disabled={status === "loading"}
            >
              <FiSearch className="w-4 h-4" />
              {status === "loading" ? "Generando..." : "Generar imágenes"}
            </button>
          )}
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
              {images.filter((img) => img.isUploaded || img.tipo === "base64")
                .length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                  <FiUpload className="w-3 h-3" />
                  <span className="whitespace-nowrap">
                    {
                      images.filter(
                        (img) => img.isUploaded || img.tipo === "base64",
                      ).length
                    }{" "}
                    subida
                    {images.filter(
                      (img) => img.isUploaded || img.tipo === "base64",
                    ).length !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>
              )}
              {images.filter((img) => !img.isUploaded && img.tipo !== "base64")
                .length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                  <FiSearch className="w-3 h-3" />
                  <span className="whitespace-nowrap">
                    {
                      images.filter(
                        (img) => !img.isUploaded && img.tipo !== "base64",
                      ).length
                    }{" "}
                    URL
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {status === "loading" && <Spinner />}

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
          </div>

          {!showAllImages &&
            allAvailableImages.length > images.length &&
            images.length >= 10 && (
              <div className="flex justify-center">
                <button
                  onClick={handleShowMoreImages}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl shadow-lg font-medium transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  <FiEye className="w-4 h-4" />
                  Ver más imágenes ({allAvailableImages.length - 10} restantes)
                </button>
              </div>
            )}

          {showAllImages && (
            <div className="flex justify-center">
              <button
                onClick={handleShowLessImages}
                className="px-6 py-3 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded-xl shadow-lg font-medium transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <FiEyeOff className="w-4 h-4" />
                Mostrar menos imágenes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationImageManager;
