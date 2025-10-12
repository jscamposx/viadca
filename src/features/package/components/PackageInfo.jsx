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
    className={`group relative overflow-hidden bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 backdrop-blur-sm ${colorClass}`}
    style={{ animationDelay: `${index * 150}ms` }}
  >
    <div
      className={`absolute inset-0 opacity-0 md:group-hover:opacity-10 transition-opacity duration-300 ${gradientClass}`}
    ></div>

    {/* Mobile: Diseño horizontal compacto */}
    <div className="relative p-4 md:p-6 flex md:block items-center md:items-start gap-4 md:gap-0">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl md:mb-4 ${gradientClass} shadow-lg md:group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
      >
        <div className="text-white scale-90 md:scale-100">{icon}</div>
      </div>

      <div className="flex-1 md:space-y-2">
        <h3 className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        <p className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs md:text-sm text-slate-600 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="hidden md:block absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div
      className={`absolute bottom-0 left-0 right-0 h-1 ${gradientClass} transform scale-x-0 md:group-hover:scale-x-100 transition-transform duration-300`}
    ></div>
  </div>
);

const PackageInfo = ({ paquete }) => {
  const moneda = sanitizeMoneda(paquete.moneda);
  const personasValue = parseInt(paquete?.personas, 10);
  const personasValidas = !isNaN(personasValue) && personasValue > 0;

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
  const hasPrecioVuelo =
    paquete?.precio_vuelo != null && parseFloat(paquete.precio_vuelo) > 0;
  const hasPrecioHospedaje =
    paquete?.precio_hospedaje != null &&
    parseFloat(paquete.precio_hospedaje) > 0;
  const precioVueloFormatted = hasPrecioVuelo
    ? formatPrecio(paquete.precio_vuelo, moneda)
    : null;
  const precioHospedajeFormatted = hasPrecioHospedaje
    ? formatPrecio(paquete.precio_hospedaje, moneda)
    : null;
  const precioPorPersonaFormatted =
    personasValidas && paquete?.precio_total
      ? formatPrecio(
          (parseFloat(paquete?.precio_total) || 0) / personasValue,
          moneda,
        )
      : null;

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Mobile: Grid de 1 columna, Desktop: 4 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <InfoCard
          icon={<FiCalendar className="w-6 h-6 md:w-7 md:h-7" />}
          title="Duración Total"
          value={`${paquete.duracion_dias} días`}
          subtitle={`${Math.max((paquete.duracion_dias || 1) - 1, 0)} noches`}
          colorClass="hover:bg-blue-50/30"
          gradientClass="bg-gradient-to-br from-blue-500 to-cyan-600"
          index={0}
        />

        <InfoCard
          icon={<FiDollarSign className="w-6 h-6 md:w-7 md:h-7" />}
          title="Precio Total"
          value={
            <>
              <span>{precioTotalFormatted}</span>
              {precioTotalFormatted && (
                <span className="ml-1.5 text-[10px] md:text-xs text-amber-700 font-semibold">
                  ({moneda})
                </span>
              )}
              {personasValidas && precioPorPersonaFormatted && (
                <span className="block text-xs md:text-sm text-amber-600 font-semibold mt-0.5 md:mt-1">
                  {precioPorPersonaFormatted} por persona
                </span>
              )}
            </>
          }
          subtitle={
            personasValidas
              ? (
                  <span>
                    Para {personasValue} viajero
                    {personasValue > 1 ? "s" : ""}
                  </span>
                )
              : (
                  <span>Precio final del paquete</span>
                )
          }
          colorClass="hover:bg-amber-50/30"
          gradientClass="bg-gradient-to-br from-amber-500 to-orange-600"
          index={1}
        />

        <InfoCard
          icon={<FiCalendar className="w-6 h-6 md:w-7 md:h-7" />}
          title="Fecha de Inicio"
          value={formatDate(paquete.fecha_inicio)}
          subtitle="Salida estimada"
          colorClass="hover:bg-emerald-50/30"
          gradientClass="bg-gradient-to-br from-emerald-500 to-green-600"
          index={2}
        />

        <InfoCard
          icon={<FiCalendar className="w-6 h-6 md:w-7 md:h-7" />}
          title="Fecha de Fin"
          value={formatDate(paquete.fecha_fin)}
          subtitle="Regreso estimado"
          colorClass="hover:bg-purple-50/30"
          gradientClass="bg-gradient-to-br from-purple-500 to-indigo-600"
          index={3}
        />
      </div>

      {(hasPrecioVuelo || hasPrecioHospedaje) && (
        <div className="rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 border border-slate-200/70 bg-white/70 backdrop-blur-sm shadow-inner">
          <h4 className="text-xs md:text-sm font-semibold text-slate-700 mb-3 md:mb-4 flex items-center gap-2">
            <FiDollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500" />
            Desglose de precios
          </h4>
          <ul className="space-y-2 text-xs md:text-sm text-slate-600">
            {hasPrecioVuelo && (
              <li className="flex justify-between">
                <span className="font-medium">Vuelo</span>
                <span className="font-semibold text-slate-800">
                  {precioVueloFormatted}
                  <span className="ml-1 text-[10px] md:text-[11px] text-slate-500">
                    {moneda}
                  </span>
                </span>
              </li>
            )}
            {hasPrecioHospedaje && (
              <li className="flex justify-between">
                <span className="font-medium">Hospedaje</span>
                <span className="font-semibold text-slate-800">
                  {precioHospedajeFormatted}
                  <span className="ml-1 text-[10px] md:text-[11px] text-slate-500">
                    {moneda}
                  </span>
                </span>
              </li>
            )}
            <li className="flex justify-between border-t border-slate-200 pt-2 md:pt-3 mt-1">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {precioTotalFormatted}
                <span className="ml-1 text-[10px] md:text-[11px] text-blue-600">
                  {moneda}
                </span>
              </span>
            </li>
          </ul>
        </div>
      )}

      <div className="rounded-xl md:rounded-2xl p-4 md:p-6 border border-amber-200 bg-amber-50/70">
        <div className="flex items-start gap-2.5 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
            <FiAlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-0.5 md:mb-1 text-sm md:text-base">Importante</h4>
            <p className="text-amber-800 text-xs md:text-sm leading-relaxed">
              Los precios pueden variar según disponibilidad, temporada y tipo
              de cambio. Confirma el costo final al reservar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;
