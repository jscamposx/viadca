import React from "react";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import OptimizedImage, {
  AvatarImage,
} from "../../../components/ui/OptimizedImage.jsx";

// Datos ahora cargados dinámicamente desde /data/testimonials.json
// Formato esperado de cada item:
// {
//   "name": "Nombre Cliente",
//   "location": "Hace X días" (o ciudad),
//   "avatar": "/HomePage/testimonio-user1.avif",
//   "quote": "Texto del testimonio",
//   "accentFrom": "from-indigo-500" (opcional),
//   "accentTo": "to-violet-500" (opcional)
// }

// Paletas fallback determinísticas (cíclicas) si no vienen acentos definidos
const COLOR_PAIRS = [
  ["from-indigo-500", "to-violet-500"],
  ["from-emerald-500", "to-teal-500"],
  ["from-orange-500", "to-amber-500"],
  ["from-pink-500", "to-rose-500"],
  ["from-blue-500", "to-cyan-500"],
  ["from-fuchsia-500", "to-purple-500"],
];

const enrichTestimonial = (t, index) => {
  const pair = COLOR_PAIRS[index % COLOR_PAIRS.length];
  return {
    ...t,
    accentFrom: t.accentFrom || pair[0],
    accentTo: t.accentTo || pair[1],
  };
};

const mod = (n, m) => ((n % m) + m) % m;

const SlideCard = ({ t, state }) => {
  // state: -1 (prev), 0 (active), 1 (next), others hidden
  const base =
    "absolute left-1/2 top-1/2 w-[96%] sm:w-[85%] lg:w-[520px] -translate-x-1/2 -translate-y-1/2 origin-center transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] transform-gpu will-change-transform motion-reduce:transform-none motion-reduce:transition-none";

  const stateMap = {
    [-1]: "hidden sm:block sm:-translate-x-[58%] sm:rotate-y-[12deg] sm:scale-[.92] sm:opacity-70 sm:z-0 sm:blur-[0.5px]",
    [0]: "translate-x-[-50%] rotate-y-0 scale-100 opacity-100 z-10 blur-0",
    [1]: "hidden sm:block sm:-translate-x-[42%] sm:rotate-y-[-12deg] sm:scale-[.92] sm:opacity-70 sm:z-0 sm:blur-[0.5px]",
  };

  const cls = `${base} ${stateMap[state] || "opacity-0 pointer-events-none"}`;

  return (
    <article
      className={`${cls} select-none`}
      aria-hidden={state !== 0}
      role={state === 0 ? "article" : undefined}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/90 sm:backdrop-blur shadow-2xl ring-1 ring-slate-900/5 p-4 sm:p-6 md:p-7 lg:p-8">
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.accentFrom} ${t.accentTo}`}
          aria-hidden="true"
        />
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <AvatarImage
            src={t.avatar}
            alt={`Foto de ${t.name}, testimonio de cliente de viajes VIADCA (${t.location})`}
            width={64}
            height={64}
            lazy={true}
            placeholder={false}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
          />
          <div className="min-w-0">
            <h3 className="text-slate-900 font-semibold leading-tight truncate">
              {t.name}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm truncate">
              {t.location}
            </p>
          </div>
        </div>
        <p className="text-slate-700 leading-relaxed text-[15px] sm:text-base">
          “{t.quote}”
        </p>
      </div>
      <div
        className={`pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br ${t.accentFrom} ${t.accentTo} opacity-20 blur-2xl`}
        aria-hidden="true"
      />
    </article>
  );
};

const Testimonials = () => {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch JSON una sola vez
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/data/testimonials.json?_=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (Array.isArray(json) && active) {
          setData(json.map(enrichTestimonial));
        } else if (active) {
          throw new Error("Formato inválido: se esperaba un array");
        }
      } catch (e) {
        if (active) setError(e.message || "Error cargando testimonios");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const len = data.length;

  // Umbral para pasar a modo navegación compacta
  const MAX_DOTS = 8;
  const compact = len > MAX_DOTS;

  const next = React.useCallback(() => len && setIndex((i) => mod(i + 1, len)), [len]);
  const prev = React.useCallback(() => len && setIndex((i) => mod(i - 1, len)), [len]);
  const goTo = React.useCallback((i) => len && setIndex(mod(i, len)), [len]);

  // autoplay robusto a 5s con pausa en hover y cuando la pestaña no está visible
  const intervalRef = React.useRef(null);

  const start = React.useCallback(() => {
    if (!len) return;
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (!document.hidden) next();
    }, 5500);
  }, [next, len]);

  const stop = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (!paused) start();
    return () => stop();
  }, [paused, start, stop]);

  React.useEffect(() => {
    const onVis = () => {
      if (document.hidden) stop();
      else if (!paused) start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [paused, start, stop]);

  // teclado (izquierda/derecha)
  React.useEffect(() => {
    const onKey = (e) => {
      if (!len) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section
      id="testimonios"
      className="py-10 sm:py-14 lg:py-18 px-4 sm:px-6 lg:px-8 scroll-mt-32"
      aria-labelledby="testimonios-heading"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 xl:gap-16 items-center">
        {/* Left content */}
        <AnimatedSection
          animation="fadeInLeft"
          className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left"
        >
          <p className="text-text-gray font-semibold text-sm sm:text-base uppercase tracking-wide">
            Testimonios
          </p>
          <h2
            id="testimonios-heading"
            className="font-volkhov font-bold text-3xl sm:text-5xl text-secondary leading-tight"
          >
            Lo que dicen nuestros
            <br />
            viajeros satisfechos
          </h2>
        </AnimatedSection>

        {/* Right: carrusel dinámico */}
        <AnimatedSection
          animation="fadeInRight"
          delay={300}
          className="relative"
        >
          <div className="sm:hidden absolute inset-0 -z-10 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60" />
          <div
            className="relative h-[220px] sm:h-[300px] lg:h-[420px] xl:h-[460px] transform-gpu will-change-transform overflow-visible"
            role="region"
            aria-roledescription="carrusel"
            aria-label="Carrusel de testimonios"
            aria-live="polite"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {/* Deck de tarjetas */}
            <div
              className="relative h-full w-full"
              style={{ perspective: 1200 }}
            >
              {data.map((t, i) => {
                const rel =
                  i === index
                    ? 0
                    : i === mod(index - 1, len)
                      ? -1
                      : i === mod(index + 1, len)
                        ? 1
                        : 2;
                return <SlideCard key={i} t={t} state={rel} />;
              })}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                  Cargando testimonios...
                </div>
              )}
              {!loading && !error && !len && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  No hay testimonios disponibles.
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 text-sm px-4 text-center">
                  Error: {error}
                </div>
              )}
            </div>
          </div>

          {/* Controles navegación */}
          <div className="relative flex justify-center mt-6 mx-auto w-full max-w-[360px] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-4">
            <div className="inline-flex items-center gap-1.5 sm:gap-3 rounded-full bg-white/80 backdrop-blur-md ring-1 ring-slate-900/10 shadow-lg px-2 py-1 sm:px-3 sm:py-1.5">
              <button
                type="button"
                onClick={prev}
                className="group inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-transparent ring-1 ring-transparent hover:bg-white/90 hover:ring-slate-900/10 text-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary"
                aria-label="Testimonio anterior"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {compact ? (
                <div className="flex items-center gap-3 min-w-[140px] px-1" aria-label="Estado del carrusel" role="group">
                  <div className="text-[12px] font-medium tabular-nums text-slate-600 select-none">
                    {String(index + 1).padStart(2, "0")}
                    <span className="text-slate-400"> / {String(len).padStart(2, "0")}</span>
                  </div>
                  <div className="relative h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden" aria-hidden="true">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-500 ease-out"
                      style={{ width: len ? `${((index + 1) / len) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  {data.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="relative grid place-items-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ease-out bg-transparent hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-secondary/70"
                      aria-label={`Ir al testimonio ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                    >
                      <span
                        className={`block rounded-full ${
                          i === index
                            ? `h-2.5 w-2.5 bg-gradient-to-r ${t.accentFrom} ${t.accentTo} border-2 border-white`
                            : "h-2 w-2 bg-slate-400/80"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                  {loading && (
                    <span className="text-[11px] text-slate-500 px-2">...</span>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={next}
                disabled={!len}
                className="group inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-transparent ring-1 ring-transparent hover:bg-white/90 hover:ring-slate-900/10 text-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Siguiente testimonio"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Testimonials;
