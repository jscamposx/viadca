import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";
import { FiMapPin, FiSend, FiHome, FiGlobe, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const Destinations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/paquetes/listado");
        const list = Array.isArray(data) ? data : [];
        const activos = list.filter((p) => p?.activo !== false);
        if (mounted) setItems(activos);
      } catch (e) {
        if (mounted)
          setError(
            e?.response?.data?.message ||
              "No se pudieron cargar los destinos. Intenta más tarde.",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="destinos"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-slate-600 font-semibold text-base sm:text-lg uppercase tracking-wide mb-3 lg:mb-4">
            Destinos favoritos
          </p>
          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl lg:text-5xl text-slate-800 leading-tight">
            Explora nuestros destinos más populares
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Descubre lugares increíbles con nuestros paquetes todo incluido
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading && [0, 1, 2].map((i) => (
            <article
              key={`skeleton-${i}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 animate-pulse"
              aria-hidden="true"
            >
              <div className="relative overflow-hidden">
                <div className="w-full h-48 sm:h-56 lg:h-64 bg-slate-200" />
              </div>
              <div className="p-5 lg:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-6 w-40 bg-slate-200 rounded" />
                  <div className="h-6 w-20 bg-slate-200 rounded" />
                </div>
                <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </div>
              </div>
            </article>
          ))}

          {!loading && items.map((p) => {
            const img = p?.primera_imagen ||
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop";
            const moneda = sanitizeMoneda(p?.moneda);
            const precio = formatPrecio(p?.precio_total, moneda);
            const duracion = p?.duracion_dias ? `${p.duracion_dias} días` : "";
            const destinoTxt = p?.destinos_nombres || "Destino";
            const url = `/paquetes/${p?.codigoUrl}`;

            return (
              <article
                key={p?.codigoUrl || p?.titulo}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-blue-100 hover:border-blue-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={img}
                    alt={p?.titulo || destinoTxt}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  ></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" aria-hidden="true" />
                      Activo
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                      <FiMapPin className="w-4 h-4 text-blue-600" aria-hidden="true" />
                      {destinoTxt}
                    </span>
                  </div>
                </div>
                <div className="p-5 lg:p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg lg:text-xl text-slate-800 group-hover:text-blue-600 transition-colors">
                      {p?.titulo || "Paquete"}
                    </h3>
                    <div className="text-right">
                      <span className="text-sm text-slate-500">Desde</span>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="font-bold text-lg lg:text-xl text-green-600">
                          {precio || "—"}
                        </div>
                        {moneda && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                            title={`Moneda: ${moneda}`}
                            aria-label={`Moneda ${moneda}`}
                          >
                            {moneda}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-600 mb-4">
                    <FiMapPin className="w-4 h-4 mr-2 text-blue-500" aria-hidden="true" />
                    <span className="text-sm">{duracion || destinoTxt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiSend className="w-3 h-3" aria-hidden="true" />
                        Vuelos
                      </span>
                      <span className="flex items-center gap-1">
                        <FiHome className="w-3 h-3" aria-hidden="true" />
                        Hotel 4★
                      </span>
                    </div>
                    <Link
                      to={url}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded"
                      aria-label={`Ver detalles de ${p?.titulo || "paquete"}`}
                    >
                      Ver detalles →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Ver más destinos */}
        <div className="text-center mt-12 lg:mt-16">
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold hover:shadow-lg hover:scale-105 transform inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            type="button"
            aria-label="Ver todos los destinos disponibles"
          >
            <FiGlobe className="w-5 h-5" aria-hidden="true" />
            <span>Ver todos los destinos</span>
            <FiArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
