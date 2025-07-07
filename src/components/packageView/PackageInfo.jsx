const PackageInfo = ({ duracion, id_vuelo, precio_base }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
    <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
      <p className="text-sm text-blue-800 font-semibold">Duración</p>
      <p className="text-2xl font-bold">{duracion} días</p>
    </div>
    <div className="p-4 bg-green-50 rounded-lg shadow-sm">
      <p className="text-sm text-green-800 font-semibold">Vuelo</p>
      <p className="text-2xl font-bold">{id_vuelo}</p>
    </div>
    <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
      <p className="text-sm text-yellow-800 font-semibold">Precio Base</p>
      <p className="text-2xl font-bold text-yellow-900">
        ${parseFloat(precio_base).toFixed(2)}
      </p>
    </div>
  </div>
);

export default PackageInfo;
