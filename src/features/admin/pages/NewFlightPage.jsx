import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { FiArrowLeft, FiUpload, FiSave } from "react-icons/fi";

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

  const [nombre, setNombre] = useState("");
  const [transporte, setTransporte] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        .catch(() => setError("No se pudo cargar la información del vuelo."))
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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
        alert("Vuelo actualizado con éxito.");
      } else {
        await api.flights.createVuelo(vueloPayload);
        alert("Vuelo creado con éxito.");
      }
      navigate("/admin/vuelos");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message?.toString() || err.message;
      setError(`Error al guardar el vuelo: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-3 sm:px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-5 px-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {isEditing ? "Editar Vuelo" : "Crear Nuevo Vuelo"}
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">
              Complete la información del vuelo
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm sm:text-base font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-5 sm:p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Nombre del Vuelo
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Ej: Vuelo 123 - Ciudad de México a Cancún"
                required
              />
            </div>
            
            <div>
              <label htmlFor="transporte" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Transporte
              </label>
              <input
                type="text"
                id="transporte"
                value={transporte}
                onChange={(e) => setTransporte(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Ej: Boeing 737, Airbus A320, etc."
                required
              />
            </div>
            
            <div>
              <label htmlFor="imagen" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                Imagen del Vuelo
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="imagen"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG 
                        </p>
                      </div>
                      <input 
                        id="imagen" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                
                {preview && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/vuelos")}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Regresar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-70"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              {loading
                ? "Guardando..."
                : isEditing
                  ? "Actualizar Vuelo"
                  : "Crear Vuelo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFlightPage;