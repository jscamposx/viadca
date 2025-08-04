import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMayoristas } from "../hooks/useMayoristas";
import { useNotification } from "./AdminLayout";
import api from "../../../api";
import {
  FiSave,
  FiArrowLeft,
  FiUsers,
  FiType,
  FiTag,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

const NewMayoristaPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { createMayorista, updateMayorista, getMayoristaById } =
    useMayoristas();
  const { addNotification } = useNotification();

  const [formData, setFormData] = useState({
    nombre: "",
    tipo_producto: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);

  const tiposProducto = [
    "Circuito",
    "Paquete",
    "Hotel",
    "Vuelo",
    "Traslado",
    "Excursión",
    "Combinado",
    "Crucero",
  ];

  useEffect(() => {
    if (isEditing && id) {
      const loadMayorista = async () => {
        try {
          setIsLoadingData(true);
          const mayorista = await getMayoristaById(id);
          setFormData({
            nombre: mayorista.nombre || "",
            tipo_producto: mayorista.tipo_producto || "",
          });
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error("Error al cargar mayorista:", error);
          }
          addNotification("Error al cargar los datos del mayorista", "error");
          navigate("/admin/mayoristas");
        } finally {
          setIsLoadingData(false);
        }
      };
      loadMayorista();
    }
  }, [isEditing, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.tipo_producto) {
      newErrors.tipo_producto = "El tipo de producto es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const mayoristData = {
        nombre: formData.nombre.trim(),
        tipo_producto: formData.tipo_producto,
      };

      if (import.meta.env.DEV) {
        console.log(
          "🚀 Iniciando proceso de creación/actualización de mayorista:",
          {
            isEditing,
            mayoristData,
            id,
            environment: import.meta.env.MODE,
            apiUrl: import.meta.env.VITE_API_BASE_URL,
          }
        );
      }

      if (isEditing) {
        if (import.meta.env.DEV) {
          console.log("📝 Actualizando mayorista existente...");
        }
        await updateMayorista(id, mayoristData);
        addNotification("Mayorista actualizado correctamente", "success");
      } else {
        if (import.meta.env.DEV) {
          console.log("✨ Creando nuevo mayorista...");
        }
        const result = await createMayorista(mayoristData);
        if (import.meta.env.DEV) {
          console.log("✅ Mayorista creado exitosamente:", result);
        }
        addNotification("Mayorista creado correctamente", "success");
      }

      navigate("/admin/mayoristas");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("❌ Error completo al guardar mayorista:", {
          error,
          message: error.message,
          response: error.response,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config,
          isAxiosError: error.isAxiosError,
          code: error.code,
        });
      }

      if (error.response?.data?.message) {
        addNotification(error.response.data.message, "error");
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        addNotification("Error de conexión. Verifica tu conexión a internet.", "error");
      } else if (error.code === "TIMEOUT" || error.message.includes("timeout")) {
        addNotification("La solicitud tardó demasiado. Intenta de nuevo.", "error");
      } else {
        addNotification(
          `Error al ${isEditing ? "actualizar" : "crear"} el mayorista: ${error.message}`,
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/mayoristas");
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          Cargando datos del mayorista...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleCancel}
                className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all duration-200 font-medium bg-gray-100 hover:bg-purple-50 px-3 py-2 rounded-lg sm:rounded-xl border border-gray-200 hover:border-purple-200 shadow-sm hover:shadow-md"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-200" />
                <span className="hidden sm:inline">Volver a Mayoristas</span>
                <span className="sm:hidden">Volver</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg border border-white/20">
                  <FiUsers className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {isEditing ? "Editar Mayorista" : "Nuevo Mayorista"}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base mt-1">
                    {isEditing
                      ? "Modifica los datos del mayorista"
                      : "Completa la información para crear un nuevo mayorista"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y divide-gray-100">
            {/* Header del formulario */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 p-4 sm:p-5 lg:p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-white/50">
                  <FiType className="text-purple-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Información Básica
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Datos principales del mayorista
                  </p>
                </div>
              </div>
            </div>

            {/* Campos del formulario */}
            <div className="p-4 sm:p-5 lg:p-8 space-y-6 sm:space-y-8">
              {/* Nombre del Mayorista */}
              <div className="space-y-2">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-purple-500" />
                    Nombre del Mayorista *
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base font-medium placeholder-gray-400 ${
                      errors.nombre
                        ? "border-red-300 bg-red-50"
                        : formData.nombre.trim()
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                    }`}
                    placeholder="Ej: Agencia de Viajes Central"
                  />
                  {formData.nombre.trim() && !errors.nombre && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  {errors.nombre && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FiX className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.nombre && (
                  <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 mt-2">
                    <p className="text-sm text-red-700 flex items-center gap-2 font-medium">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.nombre}
                    </p>
                  </div>
                )}
              </div>

              {/* Tipo de Producto */}
              <div className="space-y-2">
                <label
                  htmlFor="tipo_producto"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-orange-500" />
                    Tipo de Producto *
                  </div>
                </label>
                <div className="relative">
                  <select
                    id="tipo_producto"
                    name="tipo_producto"
                    value={formData.tipo_producto}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base font-medium appearance-none cursor-pointer ${
                      errors.tipo_producto
                        ? "border-red-300 bg-red-50"
                        : formData.tipo_producto
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300"
                    }`}
                  >
                    <option value="">Selecciona un tipo de producto</option>
                    {tiposProducto.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {formData.tipo_producto && !errors.tipo_producto && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.tipo_producto && (
                  <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 mt-2">
                    <p className="text-sm text-red-700 flex items-center gap-2 font-medium">
                      <FiAlertCircle className="w-4 h-4" />
                      {errors.tipo_producto}
                    </p>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="bg-blue-500 p-2 rounded-lg shadow-sm">
                    <FiAlertCircle className="text-white w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">
                      📝 Información importante
                    </h4>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      La{" "}
                      <span className="font-semibold">clave del mayorista</span>{" "}
                      se generará automáticamente una vez guardado el registro.
                      Esta clave será única y se utilizará para identificar al
                      mayorista en el sistema.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Botones de acción */}
            <div className="bg-gray-50 p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  disabled={isLoading}
                >
                  <FiX className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl sm:rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {isEditing ? "Actualizando..." : "Guardando..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                      <span>
                        {isEditing ? "Actualizar Mayorista" : "Crear Mayorista"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMayoristaPage;
