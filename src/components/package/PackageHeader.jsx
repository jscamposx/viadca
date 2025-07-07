const PackageHeader = ({ nombre_paquete, origen, destino }) => (
  <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white p-5 w-full">
    <h1 className="text-4xl font-bold">{nombre_paquete}</h1>
    <p className="text-lg mt-1">
      {origen} → {destino}
    </p>
  </div>
);

export default PackageHeader;
