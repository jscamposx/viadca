import React, { useState, useCallback, useRef } from "react";
import {
  FiUpload,
  FiX,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { cloudinaryService } from "../../services/cloudinaryService.js";
import OptimizedImage from "./OptimizedImage.jsx";

/**
 * Componente para subir imágenes a Cloudinary con preview y validación
 */
const CloudinaryImageUploader = ({
  onImagesUploaded,
  onUploadStart,
  onUploadProgress,
  onUploadError,
  multiple = false,
  folder = "viajes_app",
  maxFiles = 10,
  className = "",
  accept = "image/*",
  children,
  showPreviews = true,
  autoResize = true,
  resizeOptions = { maxWidth: 1920, maxHeight: 1080, quality: 0.9 },
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Validar archivos
  const validateFiles = useCallback(
    (files) => {
      const validFiles = [];
      const newErrors = [];

      Array.from(files).forEach((file, index) => {
        if (!cloudinaryService.validateImageFile(file)) {
          newErrors.push(
            `${file.name}: Archivo no válido. Solo se permiten imágenes JPG, PNG, WebP y GIF menores a 10MB.`,
          );
          return;
        }

        if (!multiple && validFiles.length >= 1) {
          newErrors.push(`Solo se permite subir una imagen a la vez.`);
          return;
        }

        if (validFiles.length >= maxFiles) {
          newErrors.push(`Máximo ${maxFiles} archivos permitidos.`);
          return;
        }

        validFiles.push(file);
      });

      setErrors(newErrors);
      return validFiles;
    },
    [multiple, maxFiles],
  );

  // Subir archivos
  const uploadFiles = useCallback(
    async (files) => {
      const validFiles = validateFiles(files);
      if (validFiles.length === 0) return;

      setIsUploading(true);
      setUploadProgress(0);
      onUploadStart?.(validFiles);

      try {
        const uploadPromises = validFiles.map(async (file, index) => {
          try {
            // Redimensionar si está habilitado
            const fileToUpload = autoResize
              ? await cloudinaryService.resizeImage(file, resizeOptions)
              : file;

            // Simular progreso
            const progressInterval = setInterval(() => {
              setUploadProgress((prev) => Math.min(prev + 5, 90));
            }, 100);

            // Subir archivo
            const result = await cloudinaryService.uploadImage(
              fileToUpload,
              folder,
            );

            clearInterval(progressInterval);
            setUploadProgress(100);

            return {
              file: fileToUpload,
              result: result.data,
              success: true,
            };
          } catch (error) {
            console.error(`Error subiendo ${file.name}:`, error);
            return {
              file,
              error: error.message || "Error desconocido",
              success: false,
            };
          }
        });

        const results = await Promise.all(uploadPromises);

        // Separar éxitos y errores
        const successful = results.filter((r) => r.success);
        const failed = results.filter((r) => !r.success);

        // Actualizar estados
        setUploadedFiles((prev) => [...prev, ...successful]);

        if (failed.length > 0) {
          const failedErrors = failed.map((f) => `${f.file.name}: ${f.error}`);
          setErrors((prev) => [...prev, ...failedErrors]);
          onUploadError?.(failed);
        }

        if (successful.length > 0) {
          onImagesUploaded?.(successful.map((s) => s.result));
        }
      } catch (error) {
        console.error("Error en upload batch:", error);
        setErrors((prev) => [...prev, `Error general: ${error.message}`]);
        onUploadError?.(error);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [
      validateFiles,
      autoResize,
      resizeOptions,
      folder,
      onUploadStart,
      onImagesUploaded,
      onUploadError,
    ],
  );

  // Manejadores de eventos
  const handleFileSelect = useCallback(
    (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadFiles(files);
      }
    },
    [uploadFiles],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        uploadFiles(files);
      }
    },
    [uploadFiles],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeUploadedFile = useCallback((index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearAll = useCallback(() => {
    setUploadedFiles([]);
    setErrors([]);
    setUploadProgress(0);
  }, []);

  return (
    <div className={`cloudinary-uploader ${className}`}>
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Área de drop */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 sm:p-8 cursor-pointer
          transition-all duration-300 text-center
          ${
            isDragging
              ? "border-blue-400 bg-blue-50 scale-105"
              : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
          }
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        {/* Contenido del área de drop */}
        {children || (
          <div className="space-y-4">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <FiLoader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-lg font-medium text-blue-600">
                  Subiendo {multiple ? "imágenes" : "imagen"}...
                </p>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Arrastra {multiple ? "las imágenes" : "la imagen"} aquí
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    o haz clic para seleccionar{" "}
                    {multiple ? "archivos" : "un archivo"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    JPG, PNG, WebP, GIF • Máximo 10MB{" "}
                    {multiple && `• Máximo ${maxFiles} archivos`}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Errores */}
      {errors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start justify-between">
            <div className="flex">
              <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Errores durante la subida:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="list-disc list-inside">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={clearErrors}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preview de archivos subidos */}
      {showPreviews && uploadedFiles.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-800">
              Imágenes subidas ({uploadedFiles.length})
            </h4>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Limpiar todo
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedFiles.map((upload, index) => (
              <div key={index} className="relative group">
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  <OptimizedImage
                    src={upload.result.url}
                    alt={`Imagen subida ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover"
                  />

                  {/* Overlay con acciones */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-x-2">
                      <button
                        onClick={() => removeUploadedFile(index)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Indicador de éxito */}
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <FiCheckCircle className="w-3 h-3" />
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600 truncate">
                  {upload.result.public_id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>
          Las imágenes se subirán automáticamente a Cloudinary y se optimizarán
          para web.
        </p>
        {autoResize && (
          <p className="mt-1">
            Redimensionado automático: {resizeOptions.maxWidth}x
            {resizeOptions.maxHeight}px, calidad{" "}
            {Math.round(resizeOptions.quality * 100)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default CloudinaryImageUploader;
