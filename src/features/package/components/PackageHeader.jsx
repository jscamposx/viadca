const PackageHeader = ({ nombre_paquete, origen, destino }) => (
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6">
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-2">{nombre_paquete}</h1>
      <div className="flex items-center">
        <span className="bg-blue-500 text-xs px-2 py-1 rounded mr-3">
          DESTACADO
        </span>
        <p className="text-lg">
          {origen} <span className="mx-2">→</span> {destino}
        </p>
      </div>
    </div>
  </div>
);

export default PackageHeader;
