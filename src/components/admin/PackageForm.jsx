const PackageForm = ({ formData, onFormChange }) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Información Básica
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Paquete *
          </label>
          <input
            type="text"
            name="nombre_paquete"
            value={formData.nombre_paquete}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            value={formData.duracion}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID del Vuelo *
          </label>
          <input
            type="text"
            name="id_vuelo"
            value={formData.id_vuelo}
            onChange={onFormChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Base *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              name="precio_base"
              value={formData.precio_base}
              onChange={onFormChange}
              className="w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Origen</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Origen *
          </label>
          <input
            type="text"
            name="origen"
            value={formData.origen}
            onChange={onFormChange}
            placeholder="Ej. Ciudad de México"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitud *
            </label>
            <input
              type="number"
              step="any"
              name="origen_lat"
              value={formData.origen_lat}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud *
            </label>
            <input
              type="number"
              step="any"
              name="origen_lng"
              value={formData.origen_lng}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Destino</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Destino *
          </label>
          <input
            type="text"
            name="destino"
            value={formData.destino}
            onChange={onFormChange}
            placeholder="Ej. Cancún"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitud *
            </label>
            <input
              type="number"
              step="any"
              name="destino_lat"
              value={formData.destino_lat}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitud *
            </label>
            <input
              type="number"
              step="any"
              name="destino_lng"
              value={formData.destino_lng}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
              required
            />
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Requisitos</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requisitos del Paquete *
        </label>
        <textarea
          name="requisitos"
          value={formData.requisitos}
          onChange={onFormChange}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  </div>
);

export default PackageForm;
