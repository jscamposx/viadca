import { useState, useEffect } from "react";
import { FiTag, FiX, FiPercent, FiDollarSign, FiUsers } from "react-icons/fi";
import { useMayoristas } from "../hooks/useMayoristas";
import { sanitizeMoneda } from "../../../utils/priceUtils";

const PackageForm = ({ formData, onFormChange }) => {
  const [showDiscount, setShowDiscount] = useState(!!formData.descuento);
  const { mayoristas, loading: mayoristasLoading } = useMayoristas();

  // Debug: Verificar que los mayoristas se cargan y el estado actual
  useEffect(() => {
    console.log("🏢 PackageForm - Estado de mayoristas:", {
      mayoristasCount: mayoristas?.length || 0,
      mayoristasLoading,
      currentMayoristasIds: formData.mayoristasIds || [],
      formData: formData,
    });
  }, [mayoristas, mayoristasLoading, formData.mayoristasIds]);

  // Moneda
  const MONEDAS = ["MXN", "USD"];
  const moneda = sanitizeMoneda(formData?.moneda || "MXN");

  const formatNumber = (value) => {
    if (!value) return "";
    const numberValue = parseFloat(String(value).replace(/,/g, ""));
    return isNaN(numberValue) ? "" : numberValue.toLocaleString("es-MX");
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, "");
    if (!isNaN(rawValue) || rawValue === "") {
      onFormChange({ target: { name, value: rawValue } });
    }
  };

  const handleMayoristaChange = (mayoristaId) => {
    const currentIds = formData.mayoristasIds || [];
    let newIds;

    if (currentIds.includes(mayoristaId)) {
      newIds = currentIds.filter((id) => id !== mayoristaId);
    } else {
      newIds = [...currentIds, mayoristaId];
    }

    console.log("🏢 Cambio en mayorista:", {
      mayoristaId,
      currentIds,
      newIds,
      action: currentIds.includes(mayoristaId) ? "remove" : "add",
    });

    onFormChange({ target: { name: "mayoristasIds", value: newIds } });
  };

  const handleMonedaChange = (e) => {
    const value = sanitizeMoneda(e.target.value);
    onFormChange({ target: { name: "moneda", value } });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del Paquete *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo || ""}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Maravillas de Kioto, Japón"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio *
          </label>
          <input
            type="date"
            name="fecha_inicio"
            value={formData.fecha_inicio || ""}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin *
          </label>
          <input
            type="date"
            name="fecha_fin"
            value={formData.fecha_fin || ""}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Selector de moneda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moneda
          </label>
          <select
            name="moneda"
            value={moneda}
            onChange={handleMonedaChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {MONEDAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Total *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiDollarSign />
            </span>
            <input
              type="text"
              name="precio_total"
              value={formatNumber(formData.precio_total)}
              onChange={handleNumericChange}
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 4,800"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anticipo
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FiDollarSign />
            </span>
            <input
              type="text"
              name="anticipo"
              value={formatNumber(formData.anticipo)}
              onChange={handleNumericChange}
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. 1,000"
            />
          </div>
        </div>
        <div>
          {!showDiscount ? (
            <div className="flex flex-col justify-end h-full">
              <button
                type="button"
                onClick={() => setShowDiscount(true)}
                className="flex items-center justify-center w-full py-3 px-4 border border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50"
              >
                <FiTag className="mr-2" /> Agregar descuento
              </button>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio con Descuento
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FiDollarSign />
                </span>
                <input
                  type="text"
                  name="descuento"
                  value={formatNumber(formData.descuento)}
                  onChange={handleNumericChange}
                  className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. 300"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowDiscount(false)}
                className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Incluye
          </label>
          <textarea
            name="incluye"
            value={formData.incluye || ""}
            onChange={onFormChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Detalla qué incluye el paquete..."
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No Incluye
          </label>
          <textarea
            name="no_incluye"
            value={formData.no_incluye || ""}
            onChange={onFormChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Detalla qué NO incluye el paquete..."
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requisitos
          </label>
          <textarea
            name="requisitos"
            value={formData.requisitos || ""}
            onChange={onFormChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Pasaporte, visas, etc."
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FiUsers className="inline w-4 h-4 mr-2" />
            Mayoristas Asociados
          </label>
          {mayoristasLoading ? (
            <div className="text-gray-500">Cargando mayoristas...</div>
          ) : mayoristas && mayoristas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mayoristas.map((mayorista) => (
                <label
                  key={mayorista.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(formData.mayoristasIds || []).includes(
                      mayorista.id,
                    )}
                    onChange={(e) => {
                      console.log("✅ Checkbox mayorista clicked:", {
                        mayoristaId: mayorista.id,
                        mayoristaNombre: mayorista.nombre,
                        checked: e.target.checked,
                        currentIds: formData.mayoristasIds,
                      });
                      handleMayoristaChange(mayorista.id);
                    }}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {mayorista.nombre}
                    </div>
                    {mayorista.email && (
                      <div className="text-sm text-gray-500">
                        {mayorista.email}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 p-4 border border-gray-200 rounded-lg">
              No hay mayoristas disponibles.
              <br />
              <small>Verifica que existan mayoristas en el sistema.</small>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo || false}
              onChange={(e) =>
                onFormChange({
                  target: { name: "activo", value: e.target.checked },
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Paquete activo (visible para los usuarios)
            </span>
          </label>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas Adicionales
          </label>
          <textarea
            name="notas"
            value={formData.notas || ""}
            onChange={onFormChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Notas importantes para el viajero..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default PackageForm;
