const PackageForm = ({ formData, onFormChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <input
      type="text"
      name="nombre_paquete"
      value={formData.nombre_paquete}
      onChange={onFormChange}
      placeholder="Nombre del Paquete"
      className="p-2 border rounded"
      required
    />
    <input
      type="number"
      name="duracion"
      value={formData.duracion}
      onChange={onFormChange}
      placeholder="Duración (días)"
      className="p-2 border rounded"
      required
    />
    <input
      type="text"
      name="id_vuelo"
      value={formData.id_vuelo}
      onChange={onFormChange}
      placeholder="ID del Vuelo"
      className="p-2 border rounded"
      required
    />
    <input
      type="text"
      name="origen"
      value={formData.origen}
      onChange={onFormChange}
      placeholder="Nombre del Origen (ej. Ciudad de México)"
      className="p-2 border rounded"
      required
    />
    <input
      type="number"
      step="any"
      name="origen_lat"
      value={formData.origen_lat}
      readOnly
      placeholder="Latitud Origen (selecciona en mapa)"
      className="p-2 border rounded bg-gray-100"
      required
    />
    <input
      type="number"
      step="any"
      name="origen_lng"
      value={formData.origen_lng}
      readOnly
      placeholder="Longitud Origen (selecciona en mapa)"
      className="p-2 border rounded bg-gray-100"
      required
    />
    <input
      type="text"
      name="destino"
      value={formData.destino}
      onChange={onFormChange}
      placeholder="Nombre del Destino (ej. Cancún)"
      className="p-2 border rounded"
      required
    />
    <input
      type="number"
      step="any"
      name="destino_lat"
      value={formData.destino_lat}
      readOnly
      placeholder="Latitud Destino (selecciona en mapa)"
      className="p-2 border rounded bg-gray-100"
      required
    />
    <input
      type="number"
      step="any"
      name="destino_lng"
      value={formData.destino_lng}
      readOnly
      placeholder="Longitud Destino (selecciona en mapa)"
      className="p-2 border rounded bg-gray-100"
      required
    />
    <input
      type="number"
      step="any"
      name="precio_base"
      value={formData.precio_base}
      onChange={onFormChange}
      placeholder="Precio Base"
      className="p-2 border rounded"
      required
    />
    <textarea
      name="requisitos"
      value={formData.requisitos}
      onChange={onFormChange}
      placeholder="Requisitos"
      className="w-full p-2 border rounded md:col-span-2"
      required
    />
  </div>
);

export default PackageForm;
