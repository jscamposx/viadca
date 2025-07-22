import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
);

const ImageTile = ({ image, onRemove, onDragStart, onDrop }) => (
  <div
    draggable
    onDragStart={onDragStart}
    onDrop={onDrop}
    className="relative group bg-gray-100 rounded-lg overflow-hidden shadow-sm cursor-move"
  >
    <div className="h-48">
      <img
        src={image.url}
        alt="Imagen del destino"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="absolute top-2 right-2 z-10">
      <button
        onClick={() => onRemove(image.id)}
        className="p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity">
      <p>Arrastra para reordenar</p>
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

const DestinationImageManager = ({ destination, onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchImagesFromPexels = useCallback(async (destinationName) => {
    if (!destinationName) {
      setImages([]);
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
      const response = await axios.get(`https://api.pexels.com/v1/search`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        params: {
          query: "lugares turísticos en " + destinationName,
          per_page: 4,
        },
      });

      if (response.data.photos && response.data.photos.length > 0) {
        const photoData = response.data.photos.map((photo) => ({
          id: `pexels-${photo.id}`,
          url: photo.src.large,
          isUploaded: false,
        }));
        setImages(photoData);
        setStatus("success");
      } else {
        setImages([]);
        setStatus("no_photos");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las imágenes desde Pexels.");
      setImages([]);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (destination?.name) {
      fetchImagesFromPexels(destination.name);
    } else {
      setImages([]);
      setStatus("idle");
    }
  }, [destination, fetchImagesFromPexels]);

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
          url: base64, // <-- AHORA ES BASE64
          isUploaded: true,
        };
      }),
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
    setStatus("success");
  };

  const handleFileUpload = (event) => {
    handleFiles(event.target.files);
  };

  const handleRemoveImage = (id) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("imageIndex", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const dragIndex = e.dataTransfer.getData("imageIndex");
    if (dragIndex) {
      const newImages = [...images];
      const [draggedImage] = newImages.splice(dragIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);
      setImages(newImages);
    }
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

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4 ${
        isDragging ? "border-blue-500 border-dashed border-2" : ""
      }`}
      onDragEnter={handleContainerDragOver}
      onDragLeave={handleContainerDragLeave}
      onDragOver={handleContainerDragOver}
      onDrop={handleContainerDrop}
    >
      <div className="flex justify-end mb-4">
        <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-pointer ">
          <span>+ Subir Imágenes</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
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
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          onDragOver={handleDragOver}
        >
          {images.map((image, index) => (
            <ImageTile
              key={image.id}
              image={image}
              onRemove={handleRemoveImage}
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationImageManager;
