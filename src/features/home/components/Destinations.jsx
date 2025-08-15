import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import { formatPrecio, sanitizeMoneda } from "../../../utils/priceUtils";

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
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Activo
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
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
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm">{duracion || destinoTxt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Vuelos
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Ver todos los destinos</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
