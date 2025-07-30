import { FiUsers, FiPackage, FiTag } from "react-icons/fi";

const MayoristaCard = ({ mayorista }) => {
  const getTipoIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "circuito":
        return <FiPackage className="w-5 h-5" />;
      case "crucero":
        return <FiUsers className="w-5 h-5" />;
      default:
        return <FiTag className="w-5 h-5" />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "circuito":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "crucero":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-all duration-300 hover:border-slate-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
            <FiUsers className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">
              {mayorista.nombre}
            </h3>
            <p className="text-slate-500 text-sm">Clave: {mayorista.clave}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getTipoColor(mayorista.tipo_producto)}`}
        >
          {getTipoIcon(mayorista.tipo_producto)}
          <span>{mayorista.tipo_producto}</span>
        </div>
      </div>
    </div>
  );
};

const MayoristasInfo = ({ mayoristas = [] }) => {
  if (!mayoristas || mayoristas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900">
          Operadores turísticos
        </h3>
        <p className="text-slate-600">
          Mayoristas certificados que operan este paquete
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mayoristas.map((mayorista) => (
          <MayoristaCard key={mayorista.id} mayorista={mayorista} />
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              ✓ Operadores certificados
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Todos nuestros mayoristas están certificados y cuentan con los
              permisos necesarios para operar viajes turísticos de forma segura
              y legal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MayoristasInfo;
