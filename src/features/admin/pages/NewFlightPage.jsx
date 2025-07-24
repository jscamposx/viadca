import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { FiArrowLeft, FiUpload, FiSave, FiTrash2, FiAirplay } from "react-icons/fi";
import { useNotification } from "./AdminLayout";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const NewFlightPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [nombre, setNombre] = useState("");
  const [transporte, setTransporte] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api.flights
        .getVueloById(id)
        .then((response) => {
          const { nombre, transporte, imagenes } = response.data;
          setNombre(nombre || "");
          setTransporte(transporte || "");
          if (imagenes && imagenes.length > 0) {
            const API_URL = import.meta.env.VITE_API_URL;
            setPreview(
              imagenes[0].url.startsWith("http")
                ? imagenes[0].url
                : `${API_URL}${imagenes[0].url}`,
            );
          }
        })
        .catch((err) => {
          console.error("Error al cargar el vuelo:", err);
          addNotification(
            "No se pudo cargar la información del vuelo.",
            "error",
          );
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, addNotification]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagen(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vueloPayload = {
        nombre,
        transporte,
      };
      if (imagen) {
        const base64String = await fileToBase64(imagen);
        const uploadResponse = await api.images.uploadBase64Image(base64String);
        const imageId = uploadResponse.data.id;

        if (imageId) {
          vueloPayload.imageIds = [imageId];
        }
      }
      if (isEditing) {
        await api.flights.updateVuelo(id, vueloPayload);
        addNotification("Vuelo actualizado con éxito.", "success");
      } else {
        await api.flights.createVuelo(vueloPayload);
        addNotification("Vuelo creado con éxito.", "success");
      }
      navigate("/admin/vuelos");
    } catch (err) {
      console.error("Error al guardar el vuelo:", err.response || err);
      const errorMessage =
        err.response?.data?.message?.toString() ||
        "Ocurrió un error inesperado";
      addNotification(`Error: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabecera mejorada */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <FiAirplay className="w-8 h-8 sm:w-9 sm:h-9" />
                {isEditing ? "Editar Vuelo" : "Crear Nuevo Vuelo"}
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-2xl">
                {isEditing
                  ? "Actualiza la información de este vuelo"
                  : "Completa los detalles para registrar un nuevo vuelo"}
              </p>
            </div>
            
            <button
              onClick={() => navigate("/admin/vuelos")}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 px-5 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Volver</span>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información del vuelo */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  Detalles del Vuelo
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre del Vuelo
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Ej: Vuelo Volaris 123"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="transporte"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Tipo de Transporte
                    </label>
                    <input
                      type="text"
                      id="transporte"
                      value={transporte}
                      onChange={(e) => setTransporte(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Ej: Avión Boeing 737"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen del vuelo */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Imagen del Vuelo
              </h2>
              
              <div className="space-y-5">
                {preview ? (
                  <div 
                    className="relative rounded-xl overflow-hidden border border-gray-200 h-64"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <img
                      src={preview}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    
                    {isHovered && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-opacity">
                        <label className="cursor-pointer bg-white text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-100">
                          <FiUpload className="w-4 h-4" />
                          Cambiar
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="bg-red-500 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-6 flex flex-col items-center justify-center text-center h-64 transition-colors hover:bg-gray-100">
                    <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Subir imagen del vuelo
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-colors">
                      Seleccionar imagen
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-3">
                      Formatos soportados: PNG, JPG, JPEG (Max 5MB)
                    </p>
                  </div>
                )}
                
            
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
           

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    {isEditing ? "Actualizar Vuelo" : "Crear Vuelo"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFlightPage;