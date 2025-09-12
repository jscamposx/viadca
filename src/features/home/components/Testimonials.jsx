import React from "react";
import { AnimatedSection } from "../../../hooks/scrollAnimations";
import OptimizedImage, {
  AvatarImage,
} from "../../../components/ui/OptimizedImage.jsx";

const testimonialsData = [
  {
    name: "Yadis González Mercado",
    location: "Hace 3 días",
    avatar: "/HomePage/testimonio-user1.avif",
    quote: "La asesoría y el trato es excelente!! Lo súper recomiendo",
    accentFrom: "from-emerald-500",
    accentTo: "to-teal-500",
  },
  {
    name: "Araceli Gurrola Lopez",
    location: "Hace 1 semana",
    avatar: "/HomePage/testimonio-user2.avif",
    quote: "El servicio me parece excelente y profesional 👌",
    accentFrom: "from-indigo-500",
    accentTo: "to-violet-500",
  },
  {
    name: "Techy Ruiz Piña",
    location: "Hace 5 días",
    avatar: "/HomePage/testimonio-user3.avif",
    quote: "EXCELENTE SERVICIO MUY PROFESIONAL Y EFICIENTE. ",
    accentFrom: "from-orange-500",
    accentTo: "to-amber-500",
  },
  {
    name: "Nat Ruiz",
    location: "Hace 2 semanas",
    avatar: "/HomePage/testimonio-user4.avif",
    quote: "Excelente organización, destinos increíbles! 100% recomendado",
    accentFrom: "from-pink-500",
    accentTo: "to-rose-500",
  },
];

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
  const len = testimonialsData.length;

  const next = React.useCallback(() => setIndex((i) => mod(i + 1, len)), [len]);
  const prev = React.useCallback(() => setIndex((i) => mod(i - 1, len)), [len]);
  const goTo = React.useCallback((i) => setIndex(mod(i, len)), [len]);

  // autoplay robusto a 5s con pausa en hover y cuando la pestaña no está visible
  const intervalRef = React.useRef(null);

  const start = React.useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      if (!document.hidden) next();
    }, 5500);
  }, [next]);

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
              {testimonialsData.map((t, i) => {
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
            </div>
          </div>

          {/* Controles mejorados (pill centrado) */}
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

              <div className="flex items-center gap-2 sm:gap-3">
                {testimonialsData.map((t, i) => (
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
              </div>

              <button
                type="button"
                onClick={next}
                className="group inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-transparent ring-1 ring-transparent hover:bg-white/90 hover:ring-slate-900/10 text-slate-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary"
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
