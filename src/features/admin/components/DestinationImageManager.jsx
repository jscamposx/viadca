import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
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
    className={`relative group bg-gray-100 rounded-lg overflow-hidden shadow-sm cursor-move transition-all duration-200 ${
      isDragOver && draggedIndex !== index
        ? "ring-2 ring-blue-400 border-l-4 border-blue-500"
        : ""
    } ${isDragging && draggedIndex === index ? "opacity-50 rotate-2 scale-95" : ""} hover:shadow-lg`}
  >
    <div
      className={`absolute top-2 left-2 z-20 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md transition-all duration-200 ${
        index === 0
          ? "bg-gradient-to-r from-yellow-500 to-orange-600"
          : "bg-blue-600"
      }`}
    >
      #{index + 1}
    </div>

    {index === 0 && (
      <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md animate-pulse">
        ⭐ Principal
      </div>
    )}

    {isDragOver && draggedIndex !== index && (
      <div className="absolute inset-0 bg-blue-100 bg-opacity-75 flex items-center justify-center z-10">
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Soltar aquí para posición #{index + 1}
        </div>
      </div>
    )}

    <div className="h-48">
      <img
        src={image.url}
        alt={`Imagen del destino - Posición ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
      />
    </div>

    <div className="absolute top-2 left-16 z-10">
      <button
        onClick={() => onRemove(image.id)}
        className="p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 hover:scale-110"
        aria-label="Eliminar imagen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="bg-gray-800 bg-opacity-75 text-white p-1 rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-black to-transparent text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
      <p className="font-medium">🔄 Arrastra para reordenar</p>
    </div>
  </div>
);

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const DestinationImageManager = ({ destination, onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [allAvailableImages, setAllAvailableImages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Efecto para manejar imágenes iniciales al editar un paquete
  useEffect(() => {
    if (initialImages && initialImages.length > 0 && !isInitialized) {
      setImages(initialImages);
      setAllAvailableImages(initialImages);
      setStatus("success");
      setIsInitialized(true);
    }
  }, [initialImages, isInitialized]);

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
          url: photo.src.large,
          isUploaded: false,
        }));

        // Si ya hay imágenes (modo edición), agregar las nuevas al final
        if (isInitialized && images.length > 0) {
          // Filtrar imágenes que ya existen para evitar duplicados
          const newUniquePhotos = photoData.filter(newPhoto => 
            !images.some(existingImg => existingImg.url === newPhoto.url)
          );
          
          setAllAvailableImages(prev => [...prev, ...newUniquePhotos]);
          setImages(prev => [...prev, ...newUniquePhotos.slice(0, 5)]); // Agregar solo las primeras 5
        } else {
          // Modo creación normal
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
    // Solo buscar imágenes de Pexels si NO hay imágenes iniciales Y hay un destino
    if (destination?.name && (!initialImages || initialImages.length === 0) && !isInitialized) {
      fetchImagesFromPexels(destination.name);
    } else if (!destination?.name && (!initialImages || initialImages.length === 0)) {
      setImages([]);
      setAllAvailableImages([]);
      setStatus("idle");
      setShowAllImages(false);
    }
  }, [destination, fetchImagesFromPexels, initialImages, isInitialized]);

  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    setStatus("loading");
    const newImages = await Promise.all(
      fileArray.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          id: `uploaded-${file.name}-${Date.now()}`,
          url: base64,
          isUploaded: true,
        };
      }),
    );

    setImages((prevImages) => [...prevImages, ...newImages]);
    setAllAvailableImages((prevImages) => [...prevImages, ...newImages]);
    setStatus("success");
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
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

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
    e.preventDefault();
    setIsDragging(true);
  };

  const handleContainerDragLeave = () => {
    setIsDragging(false);
  };

  const handleContainerDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
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
      className={`${
        isDragging ? "border-blue-500 border-dashed border-2" : ""
      }`}
      onDragEnter={handleContainerDragOver}
      onDragLeave={handleContainerDragLeave}
      onDragOver={handleContainerDragOver}
      onDrop={handleContainerDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-pointer">
            <span>+ Subir Imágenes</span>
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
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Buscando..." : "🔍 Buscar en Pexels"}
            </button>
          )}
        </div>
      </div>

      {status === "loading" && (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      )}
      {status === "error" && (
        <div className="text-red-500 text-center p-4">{error}</div>
      )}

      {status === "idle" && (
        <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
          <p className="font-semibold">Selecciona un destino en el mapa.</p>
          <p className="text-sm mt-1">
            Arrastra y suelta imágenes aquí o haz clic en el botón para
            subirlas.
          </p>
        </div>
      )}

      {status === "no_photos" && (
        <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
          <p className="font-semibold">
            No se encontraron imágenes para este destino en Pexels.
          </p>
          <p className="text-sm mt-1">
            ¡No te preocupes! Puedes subir las tuyas.
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                #1
              </div>
              <span className="text-sm text-blue-800 font-medium">
                La primera imagen será la <strong>imagen principal</strong> del
                paquete
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1 ml-8">
              Arrastra las imágenes para cambiar su orden
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {images.length > 1 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Orden actual de las imágenes:
              </h4>
              <div className="flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`text-xs px-2 py-1 rounded-full ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800 font-bold"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    #{index + 1} {index === 0 ? "(Principal)" : ""}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showAllImages && allAvailableImages.length > 10 && (
            <div className="flex justify-center">
              <button
                onClick={handleShowMoreImages}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
              >
                Ver más imágenes ({allAvailableImages.length - 10} restantes)
              </button>
            </div>
          )}

          {showAllImages && (
            <div className="flex justify-center">
              <button
                onClick={handleShowLessImages}
                className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-all duration-200"
              >
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
