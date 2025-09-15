import { FiDollarSign, FiCalendar, FiAlertTriangle } from "react-icons/fi";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";

const InfoCard = ({
  icon,
  title,
  value,
  subtitle,
  colorClass,
  gradientClass,
  index,
}) => (
  <div
    className={`group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 backdrop-blur-sm ${colorClass}`}
    style={{ animationDelay: `${index * 150}ms` }}
  >
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradientClass}`}
    ></div>

    <div className="relative p-6">
      <div
        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${gradientClass} shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        <div className="text-white">{icon}</div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-xl font-bold text-slate-800 leading-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-sm text-slate-600 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradientClass} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
  </div>
);

const PackageInfo = ({ paquete }) => {
  const moneda = sanitizeMoneda(paquete.moneda);

  const formatDate = (dateString) => {
    if (!dateString) return "Por confirmar";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Por confirmar";
    return d.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const precioTotalFormatted = formatPrecio(paquete?.precio_total, moneda);

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard
          icon={<FiCalendar className="w-7 h-7" />}
          title="Duración Total"
          value={`${paquete.duracion_dias} días`}
          subtitle={`${Math.max((paquete.duracion_dias || 1) - 1, 0)} noches`}
          colorClass="hover:bg-blue-50/30"
          gradientClass="bg-gradient-to-br from-blue-500 to-cyan-600"
          index={0}
        />

        <InfoCard
          icon={<FiDollarSign className="w-7 h-7" />}
          title="Precio Total"
          value={
            <>
              <span>{precioTotalFormatted}</span>
              {precioTotalFormatted && (
                <span className="ml-2 text-xs text-amber-700 font-semibold">
                  ({moneda})
                </span>
              )}
            </>
          }
          subtitle={<span>Precio por persona</span>}
          colorClass="hover:bg-amber-50/30"
          gradientClass="bg-gradient-to-br from-amber-500 to-orange-600"
          index={1}
        />

        <InfoCard
          icon={<FiCalendar className="w-7 h-7" />}
          title="Fecha de Inicio"
          value={formatDate(paquete.fecha_inicio)}
          subtitle="Salida estimada"
          colorClass="hover:bg-emerald-50/30"
          gradientClass="bg-gradient-to-br from-emerald-500 to-green-600"
          index={2}
        />

        <InfoCard
          icon={<FiCalendar className="w-7 h-7" />}
          title="Fecha de Fin"
          value={formatDate(paquete.fecha_fin)}
          subtitle="Regreso estimado"
          colorClass="hover:bg-purple-50/30"
          gradientClass="bg-gradient-to-br from-purple-500 to-indigo-600"
          index={3}
        />
      </div>

      <div className="rounded-2xl p-6 border border-amber-200 bg-amber-50/70">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <FiAlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Importante</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              Los precios pueden variar según disponibilidad, temporada y tipo de cambio. Confirma el costo final al reservar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;
