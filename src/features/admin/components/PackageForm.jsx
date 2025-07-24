const PackageForm = ({ formData, onFormChange }) => {
  const formatNumber = (value) => {
    if (!value) return "";

    const numberValue = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(numberValue)) return "";

    return numberValue.toLocaleString("es-MX");
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/,/g, "");

    if (!isNaN(rawValue) || rawValue === "") {
      onFormChange({ target: { name, value: rawValue } });
    }
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name="origen" value={formData.origen || ""} />
      <input
        type="hidden"
        name="origen_lat"
        value={formData.origen_lat || ""}
      />
      <input
        type="hidden"
        name="origen_lng"
        value={formData.origen_lng || ""}
      />
      <input type="hidden" name="destino" value={formData.destino || ""} />
      <input
        type="hidden"
        name="destino_lat"
        value={formData.destino_lat || ""}
      />
      <input
        type="hidden"
        name="destino_lng"
        value={formData.destino_lng || ""}
      />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Paquete *
            </label>
            <input
              type="text"
              name="nombre_paquete"
              value={formData.nombre_paquete || ""}
              onChange={onFormChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. Aventura en las Pirámides"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración (días) *
            </label>
            <input
              type="number"
              name="duracion"
              min="1"
              value={formData.duracion || ""}
              onChange={onFormChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej. 7"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio Base *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <input
                type="text"
                name="precio_base"
                value={formatNumber(formData.precio_base)}
                onChange={handlePriceChange}
                className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej. 1,500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Requisitos</h3>
        <div>
          <textarea
            name="requisitos"
            value={formData.requisitos || ""}
            onChange={onFormChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej. Pasaporte vigente, visa (si aplica), etc."
            required
          />
        </div>
      </div>
    </div>
  );
};
export default PackageForm;
