import { FiClock, FiSend, FiDollarSign, FiCalendar, FiAirplay, FiTrendingUp } from "react-icons/fi";

// Componente individual para cada pieza de información
const InfoCard = ({ icon, title, value, subtitle, colorClass, gradientClass, index }) => (
  <div
    className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm ${colorClass}`}
    style={{
      animationDelay: `${index * 150}ms`,
    }}
  >
    {/* Gradiente de fondo sutil */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradientClass}`}></div>

    {/* Contenido */}
    <div className="relative p-6">
      {/* Icono con animación */}
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${gradientClass} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white">
          {icon}
        </div>
      </div>

      {/* Información */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xl font-bold text-slate-800 leading-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-slate-600 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Decoración */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    {/* Borde inferior decorativo */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradientClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
  </div>
);

// Componente de estadística adicional
const StatBadge = ({ icon, value, label }) => (
  <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 rounded-full border border-slate-200/50 backdrop-blur-sm">
    <div className="text-slate-600">
      {icon}
    </div>
    <div className="text-sm">
      <span className="font-bold text-slate-800">{value}</span>
      <span className="text-slate-500 ml-1">{label}</span>
    </div>
  </div>
);

const PackageInfo = ({ duracion, vuelo, precio_base }) => {
  // Formatear el precio
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    });
  };

  // Calcular precio por día
  const pricePerDay = formatPrice(precio_base / duracion);
  
  return (
    <div className="space-y-8">
      {/* Título de la sección */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Información del Paquete
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Todo lo que necesitas saber sobre tu próxima aventura
        </p>
      </div>

      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          icon={<FiCalendar className="w-7 h-7" />}
          title="Duración Total"
          value={`${duracion} días`}
          subtitle={`${duracion - 1} noches de aventura`}
          colorClass="hover:bg-blue-50/30"
          gradientClass="bg-gradient-to-br from-blue-500 to-cyan-600"
          index={0}
        />
        
        <InfoCard
          icon={<FiAirplay className="w-7 h-7" />}
          title="Vuelo Incluido"
          value={vuelo ? vuelo.nombre : "Vuelo Premium"}
          subtitle={vuelo ? `Transporte: ${vuelo.transporte}` : "Ida y vuelta incluido"}
          colorClass="hover:bg-emerald-50/30"
          gradientClass="bg-gradient-to-br from-emerald-500 to-teal-600"
          index={1}
        />
        
        <InfoCard
          icon={<FiDollarSign className="w-7 h-7" />}
          title="Precio Total"
          value={formatPrice(precio_base)}
          subtitle={`${pricePerDay} por día`}
          colorClass="hover:bg-amber-50/30"
          gradientClass="bg-gradient-to-br from-amber-500 to-orange-600"
          index={2}
        />
      </div>

      {/* Estadísticas adicionales */}
      <div className="flex flex-wrap justify-center gap-4 pt-6">
        <StatBadge 
          icon={<FiTrendingUp className="w-4 h-4" />}
          value="4.9"
          label="rating"
        />
        <StatBadge 
          icon={<FiClock className="w-4 h-4" />}
          value="24/7"
          label="soporte"
        />
        <StatBadge 
          icon={<FiSend className="w-4 h-4" />}
          value="100%"
          label="garantía"
        />
      </div>

      {/* Nota informativa */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              💡 Precio todo incluido
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              Este precio incluye vuelos, alojamiento, actividades y guía especializado. 
              Sin costos ocultos ni sorpresas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;