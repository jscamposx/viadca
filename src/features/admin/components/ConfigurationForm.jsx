import React from "react";
import { 
  FiSettings, 
  FiCheck, 
  FiX,
  FiPackage
} from "react-icons/fi";
import ImagesSummary from "./ImagesSummary";

const ConfigurationForm = ({ formData, onFormChange, isEdit = false }) => {
  const handleToggleChange = (name, value) => {
    onFormChange({
      target: { name, value },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header con icono animado */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-lg mb-4 group">
          <FiSettings className="w-8 h-8 text-white transition-transform duration-300 group-hover:rotate-180" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Configuración Final
        </h3>
        <p className="text-slate-600">
          Ajustes finales y notas adicionales del paquete
        </p>
      </div>

      {/* Toggle moderno para estado del paquete */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <FiPackage className="w-5 h-5 text-emerald-600" />
          </div>
          Estado del Paquete
        </h4>
        
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full transition-all duration-300 ${
              formData.activo 
                ? 'bg-green-100 text-green-600' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {formData.activo ? <FiCheck className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-base font-medium text-slate-700">
                Paquete {formData.activo ? 'activo' : 'inactivo'}
              </span>
              <p className="text-sm text-slate-500 mt-1">
                {formData.activo
                  ? "El paquete será visible para los usuarios"
                  : "El paquete estará oculto para los usuarios"}
              </p>
            </div>
          </div>
          
          {/* Toggle switch personalizado */}
          <button
            type="button"
            onClick={() => handleToggleChange('activo', !formData.activo)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              formData.activo ? 'bg-green-500' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={formData.activo}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                formData.activo ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notas adicionales */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiSettings className="w-5 h-5 text-blue-600" />
          </div>
          Notas Adicionales
        </h4>
        <textarea
          name="notas"
          value={formData.notas || ""}
          onChange={onFormChange}
          rows="5"
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white hover:border-slate-400"
          placeholder="Notas importantes para el viajero, condiciones especiales, recomendaciones, restricciones, etc..."
        />
      </div>

      {/* Resumen de imágenes */}
      <ImagesSummary images={formData.imagenes} />

      {/* Resumen del paquete - versión original */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-md font-medium text-blue-900 mb-3">
          Resumen del Paquete
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Título:</span>
            <p className="text-blue-600">{formData.titulo || "Sin título"}</p>
          </div>
          <div>
            <span className="font-medium text-blue-700">Precio:</span>
            <p className="text-blue-600">
              $
              {formData.precio_total
                ? parseFloat(formData.precio_total).toLocaleString("es-MX")
                : "0"}
              {formData.descuento && (
                <span className="text-green-600 ml-2">
                  (Descuento: $
                  {parseFloat(formData.descuento).toLocaleString("es-MX")})
                </span>
              )}
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-700">Fechas:</span>
            <p className="text-blue-600">
              {formData.fecha_inicio && formData.fecha_fin
                ? `${formData.fecha_inicio} al ${formData.fecha_fin}`
                : "Sin fechas definidas"}
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-700">Estado:</span>
            <p className={formData.activo ? "text-green-600" : "text-red-600"}>
              {formData.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm;
